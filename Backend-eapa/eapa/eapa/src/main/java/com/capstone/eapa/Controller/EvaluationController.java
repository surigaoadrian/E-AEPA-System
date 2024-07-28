package com.capstone.eapa.Controller;

import com.capstone.eapa.DTO.AveragesDTO;
import com.capstone.eapa.DTO.EvaluationDTO;
import com.capstone.eapa.DTO.DepartmentEvaluationCountDTO;
import com.capstone.eapa.DTO.EvaluationStatusDTO;
import com.capstone.eapa.DTO.PeerEvaluationDTO;
import com.capstone.eapa.Entity.EvaluationEntity;
import com.capstone.eapa.Service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
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
    public EvaluationEntity updateEvaluation(@PathVariable int evalID,
            @RequestBody EvaluationEntity updatedEvaluation) {
        return evalServ.updateEvaluation(evalID, updatedEvaluation);
    }

    @GetMapping("/getAllEvaluation")
    public List<EvaluationEntity> getAllEvaluation() {
        return evalServ.getAllEvaluations();
    }

    // Get evaluation ID
    @GetMapping("/getEvalID")
    public Integer getEvalIDByUserIdPeriodStage(int userID, String period, String stage, String evalType) {
        return evalServ.getEvalIDByUserIDAndPeriodAndStageAndEvalType(userID, period, stage, evalType);
    }

    // Get evaluation ID for assigned peer
    @GetMapping("/getEvalIDAssignedPeer")
    public Integer getEvalIDAssignedPeer(int userID, String period, String stage, String evalType, int peerID) {
        return evalServ.getEvalIDByUserIDPeriodStageEvalTypePeerID(userID, period, stage, evalType, peerID);
    }

    // Get evaluation ID for HEAD
    @GetMapping("/getEvalIDHead")
    public Integer getEvalIDByUserIdPeriodStageHead(int userID, int empID, String period, String stage,
            String evalType) {
        return evalServ.getEvalIDByUserIdPeriodStageHead(userID, empID, period, stage, evalType);
    }

    @GetMapping("/isEvaluationCompleted")
    public boolean isEvaluationCompleted(@RequestParam int userID, @RequestParam String period,
            @RequestParam String stage, @RequestParam String evalType) {
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

    @GetMapping("/mergedPeerStatus")
    public List<PeerEvaluationDTO> getMergedPeerEvaluations() {
        return evalServ.getMergedPeerEvaluations();
    }

    @GetMapping("/isEvaluationCompletedHead")
    public boolean isEvaluationCompletedHead(@RequestParam int userID, @RequestParam int empID,
            @RequestParam String period, @RequestParam String stage, @RequestParam String evalType) {
        return evalServ.isEvaluationCompletedHead(userID, empID, period, stage, evalType);
    }

    // total employees for recommendation
    @GetMapping("/countRecommendedEmployees")
    public long countRecommendedEmployees() {
        return evalServ.countRecommendedEmployees();
    }

    // Endpoint for 3rd Month evaluation status
    @GetMapping("/thirdMonthStatus")
    public ResponseEntity<Map<String, Long>> getThirdMonthStatus() {
        EvaluationStatusDTO statusDTO = evalServ.getThirdMonthEvaluationStatus();
        Map<String, Long> statusMap = new HashMap<>();
        statusMap.put("completed", statusDTO.getCompleted());
        statusMap.put("notCompleted", statusDTO.getNotCompleted());
        return ResponseEntity.ok(statusMap);
    }

    // New endpoint to get evaluation entity
    @GetMapping("/getEvaluationHead")
    public ResponseEntity<EvaluationEntity> getEvaluationByUserIdPeriodStageHead(@RequestParam int userID,
            @RequestParam int empID, @RequestParam String period, @RequestParam String stage,
            @RequestParam String evalType) {
        EvaluationEntity evaluation = evalServ.getEvaluationByUserIdPeriodStageHead(userID, empID, period, stage,
                evalType);
        return ResponseEntity.ok(evaluation);
    }

    @GetMapping("/getPeerEvaluationAverages")
    public ResponseEntity<AveragesDTO> getPeerEvaluationAverages(@RequestParam int peerID, @RequestParam int userID,
            @RequestParam String period, @RequestParam String evalType) {
        AveragesDTO averages = evalServ.getPeerEvaluationAverages(peerID, userID, period, evalType);
        return ResponseEntity.ok(averages);
    }

    // Endpoint for 5th Month evaluation status
    @GetMapping("/fifthMonthStatus")
    public ResponseEntity<Map<String, Long>> getFifthMonthStatus() {
        EvaluationStatusDTO statusDTO = evalServ.getFifthMonthEvaluationStatus();
        Map<String, Long> statusMap = new HashMap<>();
        statusMap.put("completed", statusDTO.getCompleted());
        statusMap.put("notCompleted", statusDTO.getNotCompleted());
        return ResponseEntity.ok(statusMap);
    }

    // Endpoint for Annual evaluation status
    @GetMapping("/annualStatus")
    public ResponseEntity<Map<String, Long>> getAnnualStatus() {
        EvaluationStatusDTO statusDTO = evalServ.getAnnualEvaluationStatus();
        Map<String, Long> statusMap = new HashMap<>();
        statusMap.put("completed", statusDTO.getCompleted());
        return ResponseEntity.ok(statusMap);
    }

    // get the number of evaluators
    @GetMapping("/unique-user-count")
    public Long getUniqueUserCount() {
        return evalServ.getTotalUniqueUserIds();
    }

    // 3rd Month Completed Evaluation Per Department
    @GetMapping("/thirdMonthPerDept")
    public ResponseEntity<List<DepartmentEvaluationCountDTO>> getCompletedEvaluationsForThirdMonth() {
        List<DepartmentEvaluationCountDTO> counts = evalServ.getCompletedEvaluationsForThirdMonth();
        return ResponseEntity.ok(counts);
    }

    // Annual Completed Evaluation Per Department
    @GetMapping("/annualPerDept")
    public ResponseEntity<List<DepartmentEvaluationCountDTO>> getCompletedEvaluationsForAnnual() {
        List<DepartmentEvaluationCountDTO> counts = evalServ.getCompletedEvaluationsForAnnual();
        return ResponseEntity.ok(counts);
    }

    // 5th Month Completed Evaluation Per Department
    @GetMapping("/fifthMonthPerDept")
    public ResponseEntity<List<DepartmentEvaluationCountDTO>> getCompletedEvaluationsForFifthMonth() {
        List<DepartmentEvaluationCountDTO> counts = evalServ.getCompletedEvaluationsForFifthMonth();
        return ResponseEntity.ok(counts);
    }
}
