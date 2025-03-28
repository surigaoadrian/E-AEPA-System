package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.RegularEmpCountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RegularEmpCountRepository extends JpaRepository<RegularEmpCountEntity, Integer> {
    Optional<RegularEmpCountEntity> findByMonthAndYear(String month, int year);

    @Query("SELECT r FROM RegularEmpCountEntity r WHERE r.year = :year")
    List<RegularEmpCountEntity> findByYear(@Param("year") int year);
}
