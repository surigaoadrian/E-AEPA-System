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
    
   // Create a head comment
   public ResponseEntity createHeadComment(ResponseEntity response) {
    response.setEvaluation(null);

    // Check if a response already exists for the given user and question
    Optional<ResponseEntity> existingResponse = resRepo.findByUser_UserIDAndQuestion_QuesID(response.getUser().getUserID(), response.getQuestion().getQuesID());
    if (existingResponse.isPresent()) {
        throw new RuntimeException("Response already exists for this user and question");
    }

    // Load existing question
    Optional<QuestionEntity> question = quesRepo.findById(response.getQuestion().getQuesID());
    if (question.isPresent()) {
        response.setQuestion(question.get());
    } else {
        throw new RuntimeException("Question not found");
    }

    // Load existing user
    Optional<UserEntity> user = userRepo.findByUserID(response.getUser().getUserID());
    if (user.isPresent()) {
        response.setUser(user.get());
    } else {
        throw new RuntimeException("User not found");
    }

    return resRepo.save(response);
}

// Update a head comment
public ResponseEntity updateHeadComment(int responseID, ResponseEntity updatedResponse) {
    Optional<ResponseEntity> existingResponseOpt = resRepo.findById(responseID);
    if (existingResponseOpt.isPresent()) {
        ResponseEntity existingResponse = existingResponseOpt.get();

        existingResponse.setComments(updatedResponse.getComments());

        // Ensure question and user are valid
        if (updatedResponse.getQuestion() != null) {
            Optional<QuestionEntity> question = quesRepo.findById(updatedResponse.getQuestion().getQuesID());
            if (question.isPresent()) {
                existingResponse.setQuestion(question.get());
            } else {
                throw new RuntimeException("Question not found");
            }
        }
        if (updatedResponse.getUser() != null) {
            Optional<UserEntity> user = userRepo.findByUserID(updatedResponse.getUser().getUserID());
            if (user.isPresent()) {
                existingResponse.setUser(user.get());
            } else {
                throw new RuntimeException("User not found");
            }
        }

        return resRepo.save(existingResponse);
    } else {
        throw new RuntimeException("Response not found");
    }
}


public List<ResponseEntity> getHeadComments(int userID) {
            return resRepo.findByUser_UserID(userID);
        }
        
// Delete a head comment by responseID
public void deleteHeadComment(int responseID) {
        Optional<ResponseEntity> response = resRepo.findById(responseID);
        if (response.isPresent()) {
            resRepo.delete(response.get());
        } else {
            throw new RuntimeException("Response not found");
        }
    }

}
