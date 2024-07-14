package com.capstone.eapa.Controller;

import com.capstone.eapa.DTO.EvaluationDTO;
import com.capstone.eapa.Entity.EvaluationEntity;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/evaluation")
@CrossOrigin(origins = "*")
public class EvaluationController {
    @Autowired
    EvaluationService evalServ;

    @PostMapping("/createEvaluation")
    public EvaluationEntity createEvaluation(@RequestBody EvaluationEntity evaluation) {
        return evalServ.createEvaluation(evaluation);
    }

    // for edit employee: personal details
    @PatchMapping("/updateEvaluation/{evalID}")
    public EvaluationEntity updateEvaluation(@PathVariable int evalID, @RequestBody EvaluationEntity updatedEvaluation) {
        return evalServ.updateEvaluation(evalID, updatedEvaluation);
    }

    @GetMapping("/getAllEvaluation")
    public List<EvaluationEntity> getAllEvaluation() {
        return evalServ.getAllEvaluations();
    }

    //Get evaluation ID
    @GetMapping("/getEvalID")
    public Integer getEvalIDByUserIdPeriodStage(int userID, String period, String stage, String evalType) {
        return evalServ.getEvalIDByUserIDAndPeriodAndStageAndEvalType(userID, period, stage, evalType);
    }

    //Get evaluation ID for HEAD
    @GetMapping("/getEvalIDHead")
    public Integer getEvalIDByUserIdPeriodStageHead(int userID, int empID, String period, String stage, String evalType) {
        return evalServ.getEvalIDByUserIdPeriodStageHead(userID, empID, period, stage, evalType);
    }

    @GetMapping("/isEvaluationCompleted")
    public boolean isEvaluationCompleted(@RequestParam int userID, @RequestParam String period, @RequestParam String stage, @RequestParam String evalType) {
        return evalServ.isEvaluationCompleted(userID, period, stage, evalType);
    }

    @GetMapping("/getEvaluationsByUser/{userID}")
    public ResponseEntity<List<EvaluationEntity>> getEvaluationsByUser(@PathVariable int userID) {
        List<EvaluationEntity> evaluations = evalServ.getEvaluationsByUser(userID);
        return ResponseEntity.ok(evaluations);
    }

    @GetMapping("/evaluations")
    public List<EvaluationDTO> getEvaluations() {
        return evalServ.getAggregatedEvaluations();
    }

    @GetMapping("/isEvaluationCompletedHead")
    public boolean isEvaluationCompletedHead(@RequestParam int userID, @RequestParam int empID, @RequestParam String period, @RequestParam String stage, @RequestParam String evalType) {
        return evalServ.isEvaluationCompletedHead(userID, empID, period, stage, evalType);
    }

    //total employees for recommendation
    @GetMapping("/countRecommendedEmployees")
    public long countRecommendedEmployees() {
        return evalServ.countRecommendedEmployees();
    }

    // for 3rd month evaluation status BarGraph
    @GetMapping("/thirdMonthStatus")
    public ResponseEntity<Map<String, Long>> getThirdMonthStatus() {
        Map<String, Long> statusMap = evalServ.getThirdMonthEvaluationStatus();
        return ResponseEntity.ok(statusMap);
    }

    // for 5th month evaluation status BarGraph
    @GetMapping("/fifthMonthStatus")
    public ResponseEntity<Map<String, Long>> getFifthMonthStatus() {
        Map<String, Long> statusMap = evalServ.getFifthMonthEvaluationStatus();
        return ResponseEntity.ok(statusMap);
    }
}

