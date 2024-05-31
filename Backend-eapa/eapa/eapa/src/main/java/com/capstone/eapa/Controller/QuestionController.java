
package com.capstone.eapa.Controller;

import com.capstone.eapa.Entity.QuestionEntity;
import com.capstone.eapa.Service.QuestionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/question")
@CrossOrigin(origins = "http://localhost:5173")
public class QuestionController {
    @Autowired
    QuestionService quesServ;

    @PostMapping("/addQuestion")
    public QuestionEntity createQuestion(@RequestBody QuestionEntity question){
        return quesServ.createQuestion(question);
    }

    @GetMapping("/getAllQuestions")
    public List<QuestionEntity> getAllQuestions(){
        return quesServ.getAllQuestions();
    }



}
