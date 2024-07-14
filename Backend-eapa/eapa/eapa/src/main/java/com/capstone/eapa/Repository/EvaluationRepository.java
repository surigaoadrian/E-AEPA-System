
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

    //Query to get evaluation id
    @Query(value = "SELECT evalID FROM tblevaluation WHERE TRIM(user_id) = :userID AND TRIM(period) = :period AND TRIM(stage) = :stage AND TRIM(eval_type) = :evalType AND TRIM(is_deleted) = 0", nativeQuery = true)
    Integer findEvalIDByUserIDAndPeriodAndStageAndEvalType(int userID, String period, String stage, String evalType);

    //Query evaluation id for HEAD
    @Query(value = "SELECT evalID FROM tblevaluation WHERE TRIM(user_id) = :userID AND TRIM(peer_id) = :empID  AND TRIM(period) = :period AND TRIM(stage) = :stage AND TRIM(eval_type) = :evalType AND TRIM(is_deleted) = 0", nativeQuery = true)
    Integer findEvalIDByUserIdPeriodStageHead(int userID, int empID, String period, String stage, String evalType);


    //Query to check evaluation status SELF and PEER
    @Query(value = "SELECT status FROM tblevaluation WHERE TRIM(user_id) = :userID AND TRIM(period) = :period AND TRIM(stage) = :stage AND TRIM(eval_type) = :evalType AND TRIM(is_deleted) = 0", nativeQuery = true)
    String findStatusByUserIDPeriodStageAndEvalType(int userID, String period, String stage, String evalType);

    //Query to check evaluation status HEAD
    @Query(value = "SELECT status FROM tblevaluation WHERE TRIM(user_id) = :userID AND TRIM(peer_id) = :empID AND TRIM(period) = :period AND TRIM(stage) = :stage AND TRIM(eval_type) = :evalType AND TRIM(is_deleted) = 0", nativeQuery = true)
    String findStatusByUserIDEmpIDPeriodStageAndEvalType(int userID, int empID, String period, String stage, String evalType);


     @Query("SELECT e FROM EvaluationEntity e WHERE e.user.userID = :userID")
    List<EvaluationEntity> findByUserID(@Param("userID") int userID);

     //total employees for recommendation
    @Query("SELECT COUNT(e) FROM EvaluationEntity e WHERE e.period = '5th Month' AND e.status = 'COMPLETED'")
    long countByPeriodAndStatus();
//     for 3rd Month evaluation status
    @Query("SELECT COUNT(DISTINCT e.user.id) " +
            "FROM EvaluationEntity e " +
            "WHERE e.period = '3rd Month' " +
            "AND e.status = 'COMPLETED' " +
            "AND e.user.id IN (" +
            "    SELECT ee.user.id " +
            "    FROM EvaluationEntity ee " +
            "    WHERE ee.period = '3rd Month' " +
            "    AND ee.status = 'COMPLETED' " +
            "    GROUP BY ee.user.id " +
            "    HAVING COUNT(DISTINCT ee.evalType) = 3 " +
            "    AND SUM(CASE WHEN ee.evalType = 'SELF' THEN 1 ELSE 0 END) > 0 " +
            "    AND SUM(CASE WHEN ee.evalType = 'HEAD' THEN 1 ELSE 0 END) > 0 " +
            "    AND SUM(CASE WHEN ee.evalType = 'PEER' THEN 1 ELSE 0 END) > 0" +
            ")")
    Long countCompletedForThirdMonth();

    @Query("SELECT COUNT(DISTINCT e.user.userID) " +
            "FROM EvaluationEntity e " +
            "WHERE e.period = '3rd Month' " +
            "AND e.status = 'OPEN'")
    long countOpenForThirdMonth();


    // for 5th Month evaluation status
    @Query("SELECT COUNT(DISTINCT e.user.id) " +
            "FROM EvaluationEntity e " +
            "WHERE e.period = '5th Month' " +
            "AND e.status = 'COMPLETED' " +
            "AND e.user.id IN (" +
            "    SELECT ee.user.id " +
            "    FROM EvaluationEntity ee " +
            "    WHERE ee.period = '5th Month' " +
            "    AND ee.status = 'COMPLETED' " +
            "    GROUP BY ee.user.id " +
            "    HAVING COUNT(DISTINCT ee.evalType) = 3 " +
            "    AND SUM(CASE WHEN ee.evalType = 'SELF' THEN 1 ELSE 0 END) > 0 " +
            "    AND SUM(CASE WHEN ee.evalType = 'HEAD' THEN 1 ELSE 0 END) > 0 " +
            "    AND SUM(CASE WHEN ee.evalType = 'PEER' THEN 1 ELSE 0 END) > 0" +
            ")")
    Long countCompletedForFifthMonth();

    @Query("SELECT COUNT(DISTINCT e.user.userID) " +
            "FROM EvaluationEntity e " +
            "WHERE e.period = '5th Month' " +
            "AND e.status = 'OPEN'")
    long countOpenForFifthMonth();



}
