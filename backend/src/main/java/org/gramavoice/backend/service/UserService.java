package org.gramavoice.backend.service;

import org.gramavoice.backend.model.User;
import org.gramavoice.backend.model.UserAccount;
import org.gramavoice.backend.model.UserRole;
import org.gramavoice.backend.repository.UserRepository;
import org.gramavoice.backend.repository.UserAccountRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@Transactional
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserAccountRepository userAccountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User getByUsername(String username) {
        return findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));
    }

    public User save(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "இந்த பயனர் பெயர் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது.");
        }
        if (user.getMobileNumber() != null && !user.getMobileNumber().isBlank() && userRepository.existsByMobileNumber(user.getMobileNumber())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "இந்த கைபேசி எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது.");
        }
        String pwd = user.getPassword();
        if (pwd == null || pwd.trim().length() < 4) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "கடவுச்சொல் குறைந்தது 4 எழுத்துக்கள் கொண்டிருக்க வேண்டும்.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        log.info("New user registered: {} (role={})", savedUser.getUsername(), savedUser.getRole());

        syncUserAccount(savedUser);
        return savedUser;
    }

    public User updateProfile(String username, String fullName, String mobileNumber, String village, String district) {
        User user = getByUsername(username);
        if (fullName != null && !fullName.isBlank()) {
            user.setFullName(fullName);
        }
        if (mobileNumber != null && !mobileNumber.isBlank() && !mobileNumber.equals(user.getMobileNumber())) {
            if (userRepository.existsByMobileNumber(mobileNumber)) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Mobile number already exists");
            }
            user.setMobileNumber(mobileNumber);
        }
        if (village != null) {
            user.setVillage(village);
        }
        if (district != null) {
            user.setDistrict(district);
        }
        User savedUser = userRepository.save(user);
        syncUserAccount(savedUser);
        return savedUser;
    }

    public void syncUserAccount(User user) {
        if (user == null || user.getRole() != UserRole.CITIZEN) {
            return;
        }
        try {
            UserAccount account = null;
            if (user.getUsername() != null && !user.getUsername().isBlank()) {
                account = userAccountRepository.findByUsername(user.getUsername()).orElse(null);
            }
            if (account == null && user.getMobileNumber() != null && !user.getMobileNumber().isBlank()) {
                account = userAccountRepository.findByMobileNumber(user.getMobileNumber()).orElse(null);
            }
            if (account == null) {
                account = new UserAccount();
            }
            account.setUsername(user.getUsername());
            account.setPassword(user.getPassword());
            account.setFullName(user.getFullName() != null ? user.getFullName() : user.getUsername());
            account.setMobileNumber(user.getMobileNumber() != null ? user.getMobileNumber() : "");
            account.setVillage(user.getVillage() != null ? user.getVillage() : "");
            account.setDistrict(user.getDistrict() != null ? user.getDistrict() : "");
            account.setRole(user.getRole());
            userAccountRepository.save(account);
            log.info("User account synced to user_account table for: {}", user.getUsername());
        } catch (Exception e) {
            log.error("Failed to sync user to user_account table: {}", e.getMessage(), e);
        }
    }

    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public void initializeUsers() {
        try {
            ensureCitizen("citizen", "password", "குடிமக்கள்", "9876500000");
        } catch (Exception e) {
            log.warn("Seed citizen warning: {}", e.getMessage());
        }
        try {
            ensureAdmin("admin", "admin123", "மாவட்ட நிர்வாகி");
        } catch (Exception e) {
            log.warn("Seed admin warning: {}", e.getMessage());
        }
        try {
            initializeDepartmentUsers();
        } catch (Exception e) {
            log.warn("Seed dept users warning: {}", e.getMessage());
        }
        try {
            initializeDistrictDepartmentUsers();
        } catch (Exception e) {
            log.warn("Seed district users warning: {}", e.getMessage());
        }
        try {
            syncAllUsersToUserAccount();
        } catch (Exception e) {
            log.warn("Sync user account warning: {}", e.getMessage());
        }
    }

    public void syncAllUsersToUserAccount() {
        try {
            List<User> citizens = userRepository.findByRole(UserRole.CITIZEN);
            for (User citizen : citizens) {
                syncUserAccount(citizen);
            }
        } catch (Exception e) {
            log.error("Failed startup sync to user_account table: {}", e.getMessage(), e);
        }
    }

    public void initializeDepartmentUsers() {
        for (DepartmentSeed seed : DEPARTMENT_SEEDS) {
            ensureOfficer(seed.username(), seed.password(), seed.fullName(), seed.mobileNumber(), "", seed.departmentCode());
        }
    }

    public void initializeDistrictDepartmentUsers() {
        List<DistrictInfo> districts = List.of(
            new DistrictInfo("Madurai", "mad"),
            new DistrictInfo("Chennai", "che"),
            new DistrictInfo("Coimbatore", "coi"),
            new DistrictInfo("Tiruchirappalli", "tri"),
            new DistrictInfo("Salem", "sal"),
            new DistrictInfo("Tirunelveli", "tne"),
            new DistrictInfo("Erode", "ero"),
            new DistrictInfo("Vellore", "vel"),
            new DistrictInfo("Thanjavur", "tha"),
            new DistrictInfo("Dindigul", "din"),
            new DistrictInfo("Theni", "the"),
            new DistrictInfo("Kanyakumari", "kan"),
            new DistrictInfo("Thoothukudi", "tho"),
            new DistrictInfo("Virudhunagar", "vir"),
            new DistrictInfo("Sivaganga", "siv"),
            new DistrictInfo("Ramanathapuram", "ram"),
            new DistrictInfo("Pudukkottai", "pud"),
            new DistrictInfo("Karur", "kar"),
            new DistrictInfo("Namakkal", "nam"),
            new DistrictInfo("Dharmapuri", "dha"),
            new DistrictInfo("Krishnagiri", "kri"),
            new DistrictInfo("Tiruppur", "tup"),
            new DistrictInfo("Nilgiris", "nil"),
            new DistrictInfo("Cuddalore", "cud"),
            new DistrictInfo("Nagapattinam", "nag"),
            new DistrictInfo("Tiruvarur", "tvr"),
            new DistrictInfo("Perambalur", "per"),
            new DistrictInfo("Ariyalur", "ari"),
            new DistrictInfo("Tiruvallur", "tvl"),
            new DistrictInfo("Tiruvannamalai", "tvm"),
            new DistrictInfo("Ranipet", "ran"),
            new DistrictInfo("Kallakurichi", "kal"),
            new DistrictInfo("Tenkasi", "ten"),
            new DistrictInfo("Chengalpattu", "cgl"),
            new DistrictInfo("Mayiladuthurai", "may")
        );

        List<DeptMeta> depts = List.of(
            new DeptMeta("water", "WATER", "குடிநீர் துறை அலுவலர்"),
            new DeptMeta("electricity", "ELECTRICITY", "மின்சார துறை அலுவலர்"),
            new DeptMeta("roads", "ROADS", "சாலை துறை அலுவலர்"),
            new DeptMeta("municipal", "MUNICIPAL", "ஊராட்சி அலுவலர்"),
            new DeptMeta("ration", "RATION", "ரேஷன் துறை அலுவலர்"),
            new DeptMeta("general", "GENERAL", "பொது சேவை அலுவலர்")
        );

        for (DistrictInfo d : districts) {
            for (DeptMeta dept : depts) {
                String username = d.prefix() + "_" + dept.codeLower();
                String password = d.prefix() + "_" + dept.codeLower() + "_123";
                String fullName = dept.titleTa() + " (" + d.name() + ")";
                String mobile = "9" + String.format("%09d", Math.abs((username + "_v2").hashCode()) % 1000000000L);
                
                try {
                    Optional<User> opt = userRepository.findByUsername(username);
                    if (opt.isPresent()) {
                        User u = opt.get();
                        if (!passwordEncoder.matches(password, u.getPassword())) {
                            u.setPassword(passwordEncoder.encode(password));
                            u.setFullName(fullName);
                            u.setVillage(d.name());
                            u.setDistrict(d.name());
                            u.setRole(UserRole.OFFICER);
                            u.setDepartmentCode(dept.codeUpper());
                            userRepository.save(u);
                        }
                    } else {
                        User u = new User(username, passwordEncoder.encode(password), fullName, null, d.name(), d.name(), UserRole.OFFICER);
                        u.setDepartmentCode(dept.codeUpper());
                        userRepository.save(u);
                    }
                } catch (Exception e) {
                    log.warn("Failed to seed officer {}: {}", username, e.getMessage());
                }
            }
        }
        log.info("Initialized district department officers for {} districts.", districts.size());
    }

    private void ensureCitizen(String username, String password, String fullName, String mobile) {
        ensureManagedSeedUser(username, password, fullName, mobile, "சோழவந்தான்", "மதுரை", UserRole.CITIZEN, null);
    }

    private void ensureAdmin(String username, String password, String fullName) {
        ensureManagedSeedUser(username, password, fullName, "9000000099", "மதுரை", "மதுரை", UserRole.ADMIN, null);
    }

    private void ensureOfficer(String username, String password, String fullName, String mobile, String district, String departmentCode) {
        ensureManagedSeedUser(username, password, fullName, mobile, district, district, UserRole.OFFICER, departmentCode);
    }

    private record DistrictInfo(String name, String prefix) {}
    private record DeptMeta(String codeLower, String codeUpper, String titleTa) {}


    private void createSeedUserIfMissing(
            String username,
            String password,
            String fullName,
            String mobile,
            String village,
            String district,
            UserRole role,
            String departmentCode
    ) {
        userRepository.findByUsername(username)
                .orElseGet(() -> createSeedUser(username, password, fullName, mobile, village, district, role, departmentCode));
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void ensureManagedSeedUser(
            String username,
            String password,
            String fullName,
            String mobile,
            String village,
            String district,
            UserRole role,
            String departmentCode
    ) {
        try {
            userRepository.findByUsername(username).ifPresentOrElse(
                    user -> syncManagedSeedUser(user, password, fullName, mobile, village, district, role, departmentCode),
                    () -> createSeedUser(username, password, fullName, mobile, village, district, role, departmentCode)
            );
        } catch (Exception e) {
            log.warn("Could not seed user {}: {}", username, e.getMessage());
        }
    }

    private User createSeedUser(
            String username,
            String password,
            String fullName,
            String mobile,
            String village,
            String district,
            UserRole role,
            String departmentCode
    ) {
        String safeMobile = mobile;
        if (safeMobile != null && userRepository.existsByMobileNumber(safeMobile)) {
            safeMobile = "9" + String.format("%09d", Math.abs(username.hashCode()) % 1000000000);
        }
        User user = new User(username, password, fullName, safeMobile, village, district, role);
        if (departmentCode != null) {
            user.setDepartmentCode(departmentCode);
        }
        user.setPassword(passwordEncoder.encode(password));
        return userRepository.save(user);
    }

    private void syncManagedSeedUser(
            User user,
            String password,
            String fullName,
            String mobile,
            String village,
            String district,
            UserRole role,
            String departmentCode
    ) {
        boolean changed = false;

        if (user.getPassword() == null || !passwordEncoder.matches(password, user.getPassword())) {
            user.setPassword(passwordEncoder.encode(password));
            changed = true;
        }

        if (fullName != null && !fullName.equals(user.getFullName())) {
            user.setFullName(fullName);
            changed = true;
        }
        if ((user.getMobileNumber() == null || user.getMobileNumber().isBlank()) && mobile != null && !mobile.isBlank()) {
            user.setMobileNumber(mobile);
            changed = true;
        }
        if (!village.equals(user.getVillage())) {
            user.setVillage(village);
            changed = true;
        }
        if (!district.equals(user.getDistrict())) {
            user.setDistrict(district);
            changed = true;
        }
        if (user.getRole() != role) {
            user.setRole(role);
            changed = true;
        }
        if (departmentCode != null && !departmentCode.equals(user.getDepartmentCode())) {
            user.setDepartmentCode(departmentCode);
            changed = true;
        }

        if (changed) {
            userRepository.save(user);
        }
    }

    private record DepartmentSeed(String username, String password, String fullName, String mobileNumber, String departmentCode) {}

    private static final List<DepartmentSeed> DEPARTMENT_SEEDS = List.of(
            new DepartmentSeed("water", "water123", "குடிநீர் துறை அலுவலர்", "9000000010", "WATER"),
            new DepartmentSeed("electricity", "electricity123", "மின்சார துறை அலுவலர்", "9000000011", "ELECTRICITY"),
            new DepartmentSeed("roads", "roads123", "சாலை துறை அலுவலர்", "9000000012", "ROADS"),
            new DepartmentSeed("municipal", "municipal123", "ஊராட்சி அலுவலர்", "9000000013", "MUNICIPAL"),
            new DepartmentSeed("ration", "ration123", "ரேஷன் துறை அலுவலர்", "9000000014", "RATION"),
            new DepartmentSeed("general", "general123", "பொது சேவை அலுவலர்", "9000000015", "GENERAL")
    );

}
