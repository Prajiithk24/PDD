package org.gramavoice.backend.repository;

import org.gramavoice.backend.model.User;
import org.gramavoice.backend.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByMobileNumber(String mobileNumber);
    List<User> findByRole(UserRole role);
}
