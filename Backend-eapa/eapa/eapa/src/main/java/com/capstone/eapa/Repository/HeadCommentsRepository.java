package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.HeadCommentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HeadCommentsRepository extends JpaRepository<HeadCommentsEntity, Integer> {
    List<HeadCommentsEntity> findByUserID_UserIDAndIsDeleted(int userId, int isDeleted);
    List<HeadCommentsEntity> findByUserID_UserIDAndPeriodAndSchoolYearAndSemesterAndIsDeleted(
        int userId, String period, String schoolYear, String semester, int isDeleted
    );
}