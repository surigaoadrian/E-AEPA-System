package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.AcademicYearEntity;
import com.capstone.eapa.Entity.EvalStatusTrackerEntity;
import com.capstone.eapa.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface EvalStatusTrackerRepository extends JpaRepository<EvalStatusTrackerEntity, Integer> {
    // Fetch evaluation status for a specific user and academic year
    List<EvalStatusTrackerEntity> findByUser_UserIDAndAcademicYear_Id(int userId, int academicYearId);

    // Delete by academic year id
    @Transactional
    @Modifying
    @Query("DELETE FROM EvalStatusTrackerEntity e WHERE e.academicYear.id = :academicYearId")
    void deleteByAcademicYear_Id(@Param("academicYearId") int academicYearId);
}
