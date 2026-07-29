package org.gramavoice.backend.repository;

import org.gramavoice.backend.model.WelfareScheme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WelfareSchemeRepository extends JpaRepository<WelfareScheme, Long> {
    List<WelfareScheme> findByCategoryTa(String categoryTa);
}
