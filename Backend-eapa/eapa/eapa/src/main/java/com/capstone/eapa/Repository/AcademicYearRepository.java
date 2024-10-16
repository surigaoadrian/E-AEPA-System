package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.AcademicYearEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface AcademicYearRepository extends JpaRepository<AcademicYearEntity, Integer> {
    @Query("SELECT a FROM AcademicYearEntity a WHERE :date BETWEEN a.startDate AND a.endDate")
    Optional<AcademicYearEntity> findAcademicYearByDate(@Param("date") LocalDate date);

    // Deactivate all active years
    @Modifying
    @Query("UPDATE AcademicYearEntity a SET a.isActive = false WHERE a.isActive = true")
    void deactivateAllAcademicYears();

    @Query("SELECT a FROM AcademicYearEntity a WHERE a.isActive = true")
    Optional<AcademicYearEntity> findActiveAcademicYear();

}
