package com.capstone.eapa.Controller;

import com.capstone.eapa.Entity.EvaluationLogsEntity;
import com.capstone.eapa.Service.EvaluationLogsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/evaluationLogs")
@CrossOrigin(origins = "*")
public class EvaluationLogsController {
    @Autowired
    EvaluationLogsService evalLogsServ;

    @PostMapping("/createEvalLogs")
    public EvaluationLogsEntity createEvalLogs(@RequestBody EvaluationLogsEntity evalLogs){
        return evalLogsServ.createEvalLogs(evalLogs);
    }

    @GetMapping("/getEvalLogsByUserId")
    public List<EvaluationLogsEntity> getEvalLogsByUserId(@RequestParam int userID){
        return evalLogsServ.getEvalLogsByUserID(userID);
    }




}
