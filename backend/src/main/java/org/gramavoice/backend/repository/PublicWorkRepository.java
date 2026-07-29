package org.gramavoice.backend.repository;

import org.gramavoice.backend.model.PublicWork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PublicWorkRepository extends JpaRepository<PublicWork, Long> {
    List<PublicWork> findByStatus(String status);
    List<PublicWork> findByVillage(String village);
    List<PublicWork> findByDistrict(String district);
}
