package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.SchoolYearEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchoolYearRepository extends JpaRepository<SchoolYearEntity, Integer> {
    SchoolYearEntity findTopByOrderByIdDesc();
}
