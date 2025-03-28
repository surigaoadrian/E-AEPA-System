package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.SemesterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface SemesterRepository extends JpaRepository<SemesterEntity, Integer> {
    @Query("SELECT s FROM SemesterEntity s WHERE :date BETWEEN s.startDate AND s.endDate")
    Optional<SemesterEntity> findByDateWithinSemester(@Param("date") LocalDate date);

}
