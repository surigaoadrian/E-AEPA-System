package com.capstone.eapa.Service;

import com.capstone.eapa.Entity.QuestionEntity;
import com.capstone.eapa.Repository.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {
    @Autowired
    QuestionRepository quesRepo;

    public QuestionEntity createQuestion (QuestionEntity question){
        return quesRepo.save(question);
    }

    public List<QuestionEntity> getAllQuestions(){
        return quesRepo.findAllQuestions();
    }
}
