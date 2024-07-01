package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.ResultsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResultsRepository extends JpaRepository<ResultsEntity, Integer> {
    ResultsEntity findByUser_UserIDAndEvalTypeAndStageAndPeriod(int userId, String evalType, String stage, String period);
    ResultsEntity findByEmp_UserIDAndEvalTypeAndStage(int empId, String evalType, String stage);
    List<ResultsEntity> findAllByEmp_UserIDAndEvalTypeAndStage(int empId, String evalType, String stage);
}
