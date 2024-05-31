package com.capstone.eapa.Service;

import com.capstone.eapa.Entity.EvaluationEntity;
import com.capstone.eapa.Entity.QuestionEntity;
import com.capstone.eapa.Entity.ResponseEntity;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.EvaluationRepository;
import com.capstone.eapa.Repository.QuestionRepository;
import com.capstone.eapa.Repository.ResponseRepository;
import com.capstone.eapa.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Service
public class ResponseService {
    @Autowired
    private ResponseRepository resRepo;
    @Autowired
    private EvaluationRepository evalRepo;
    @Autowired
    private QuestionRepository quesRepo;
    @Autowired
    private UserRepository userRepo;


    public List<ResponseEntity> createResponse(List<ResponseEntity> responses){
        for(ResponseEntity response : responses){
            //load existing evaluation
            Optional<EvaluationEntity> evaluation = evalRepo.findById(response.getEvaluation().getEvalID());
            if(evaluation.isPresent()){
                response.setEvaluation(evaluation.get());
            } else {
                throw new RuntimeException("Evaluation not found");
            }

            //load existing question
            Optional<QuestionEntity> question = quesRepo.findById(response.getQuestion().getQuesID());
            if(question.isPresent()){
                response.setQuestion(question.get());
            } else {
                throw new RuntimeException("Question not found");
            }

            //load existing user
            Optional<UserEntity> user = userRepo.findByUserID(response.getUser().getUserID());
            if(user.isPresent()){
                response.setUser(user.get());
            } else {
                throw new RuntimeException("User not found");
            }
        }
        return resRepo.saveAll(responses);
    }

    public List<ResponseEntity> getAllResponse(){
        return resRepo.findAllResponse();
    }
}
