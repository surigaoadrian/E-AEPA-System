
package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.EvaluationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationRepository extends JpaRepository<EvaluationEntity, Integer> {
    @Query(value = "SELECT * FROM tblevaluation eval WHERE eval.is_deleted = 0", nativeQuery = true)
    List<EvaluationEntity> findAllEvals();

    @Query(value = "SELECT evalID FROM tblevaluation WHERE TRIM(user_id) = :userID AND TRIM(period) = :period AND TRIM(stage) = :stage AND TRIM(eval_type) = :evalType AND TRIM(is_deleted) = 0", nativeQuery = true)
    Integer findEvalIDByUserIDAndPeriodAndStageAndEvalType(int userID, String period, String stage, String evalType);

    //Query to check evaluation status SELF and PEER
    @Query(value = "SELECT status FROM tblevaluation WHERE TRIM(user_id) = :userID AND TRIM(period) = :period AND TRIM(stage) = :stage AND TRIM(eval_type) = :evalType AND TRIM(is_deleted) = 0", nativeQuery = true)
    String findStatusByUserIDPeriodStageAndEvalType(int userID, String period, String stage, String evalType);

     @Query("SELECT e FROM EvaluationEntity e WHERE e.user.userID = :userID")
    List<EvaluationEntity> findByUserID(@Param("userID") int userID);

}
