package com.capstone.eapa.Controller;

import com.capstone.eapa.Entity.ResultsEntity;
import com.capstone.eapa.Service.ResultsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/results")
@CrossOrigin(origins = "*")
public class ResultsController {
    @Autowired
    private ResultsService resultService;

    @PostMapping("/calculateResults")
    public ResultsEntity calculateAndSaveResults(@RequestParam int evaluationID) {
        return resultService.calculateAndSaveResults(evaluationID);
    }

    @PostMapping("/calculateJobResults")
    public ResultsEntity calculateAndSaveJobResults(@RequestParam int evaluationID) {
        return resultService.calculateAndSaveJobResults(evaluationID);
    }

    //Get SELF (VALUES and JOB)
    @GetMapping("/getAverages")
    public ResultsEntity getAverages(
            @RequestParam int userId,
            @RequestParam String evalType,
            @RequestParam String stage,
            @RequestParam String period) {
        return resultService.getAverages(userId, evalType, stage, period);
    }

    @GetMapping("/getJobRespAverageByEmpId")
    public double getJobRespAverageByEmpIdEvalTypeAndPeriod(@RequestParam int empId, @RequestParam String period) {
        return resultService.getJobRespAverageByEmpIdEvalTypeAndPeriod(empId, period);
    }

    //Get Head Values results
    @GetMapping("/getValuesAveragesByEmpIdAndEvalType")
    public ResultsEntity getValuesAveragesByEmpIdAndEvalType(@RequestParam int empId) {
        return resultService.getValuesAveragesByEmpIdAndEvalType(empId);
    }

//    @GetMapping("/getValuesAveragesByEmpIdAndEvalType")
//    public List<ResultsEntity> getAllPeerResponsesByEmpID(@RequestParam int empId) {
//        return resultService.getAllPeerResponsesByEmpID(empId);
//    }



}
