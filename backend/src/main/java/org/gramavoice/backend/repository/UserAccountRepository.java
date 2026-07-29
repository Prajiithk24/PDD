package org.gramavoice.backend.repository;

import org.gramavoice.backend.model.UserAccount;
import org.gramavoice.backend.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {
    List<UserAccount> findByRole(UserRole role);
    Optional<UserAccount> findByUsername(String username);
    Optional<UserAccount> findByMobileNumber(String mobileNumber);
}
