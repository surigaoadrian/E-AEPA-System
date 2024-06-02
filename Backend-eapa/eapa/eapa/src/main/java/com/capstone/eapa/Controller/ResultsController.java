package com.capstone.eapa.Controller;

import com.capstone.eapa.Entity.ResultsEntity;
import com.capstone.eapa.Service.ResultsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    
}
