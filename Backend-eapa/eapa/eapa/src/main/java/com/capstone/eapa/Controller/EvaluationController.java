package com.capstone.eapa.Controller;

import com.capstone.eapa.DTO.EvaluationDTO;
import com.capstone.eapa.Entity.EvaluationEntity;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Service.EvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/evaluation")
@CrossOrigin(origins = "http://localhost:5173")
public class EvaluationController {
    @Autowired
    EvaluationService evalServ;

    @PostMapping("/createEvaluation")
    public EvaluationEntity createEvaluation(@RequestBody EvaluationEntity evaluation){
        return evalServ.createEvaluation(evaluation);
    }

    // for edit employee: personal details
    @PatchMapping("/updateEvaluation/{evalID}")
    public EvaluationEntity updateEvaluation(@PathVariable int evalID, @RequestBody EvaluationEntity updatedEvaluation) {
        return evalServ.updateEvaluation(evalID, updatedEvaluation);
    }

    @GetMapping("/getAllEvaluation")
    public List<EvaluationEntity> getAllEvaluation(){
        return evalServ.getAllEvaluations();
    }


    @GetMapping("/getEvalID")
    public Integer getEvalIDByUserIDAndPeriodAndStageAndEvalType(@RequestParam int userID, @RequestParam String period, @RequestParam String stage, @RequestParam String evalType) {
        return evalServ.getEvalIDByUserIDAndPeriodAndStageAndEvalType(userID, period, stage, evalType);
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
}
