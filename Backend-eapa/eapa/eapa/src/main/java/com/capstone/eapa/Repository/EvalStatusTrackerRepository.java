package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.AcademicYearEntity;
import com.capstone.eapa.Entity.EvalStatusTrackerEntity;
import com.capstone.eapa.Entity.SemesterEntity;
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
        List<EvalStatusTrackerEntity> findByUser_UserID(int userId);
        // Check if an entry exists for a specific user, academic year, and semester
    boolean existsByUserAndSemesterAndAcademicYear(UserEntity user, SemesterEntity semester, AcademicYearEntity academicYear);

    // Native query to find duplicates
    @Query(value = "SELECT user_id, academic_year_id, semester_id, COUNT(*) as count " +
            "FROM tblevalstatustracker " +
            "GROUP BY user_id, academic_year_id, semester_id " +
            "HAVING COUNT(*) > 1", nativeQuery = true)
    List<Object[]> findDuplicates();


    // Fetch evaluation status for a specific user and academic year
    List<EvalStatusTrackerEntity> findByUser_UserIDAndAcademicYear_Id(int userId, int academicYearId);

    // Find entries by user, academic year, and semester
    @Query("SELECT e FROM EvalStatusTrackerEntity e " +
            "WHERE e.user.id = :userId AND e.academicYear.id = :academicYearId AND e.semester.id = :semesterId")
    List<EvalStatusTrackerEntity> findByUserAndAcademicYearAndSemester(
            @Param("userId") int userId,
            @Param("academicYearId") int academicYearId,
            @Param("semesterId") int semesterId);

    // Delete by academic year id
    @Transactional
    @Modifying
    @Query("DELETE FROM EvalStatusTrackerEntity e WHERE e.academicYear.id = :academicYearId")
    void deleteByAcademicYear_Id(@Param("academicYearId") int academicYearId);
}
