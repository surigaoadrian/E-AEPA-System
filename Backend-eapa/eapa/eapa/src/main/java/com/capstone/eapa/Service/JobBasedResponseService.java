package com.capstone.eapa.Service;

import com.capstone.eapa.Entity.EvaluationEntity;
import com.capstone.eapa.Entity.JobBasedResponseEntity;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.EvaluationRepository;
import com.capstone.eapa.Repository.JobBasedResponseRepository;
import com.capstone.eapa.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class JobBasedResponseService {
    @Autowired
    JobBasedResponseRepository jbrespRepo;
    @Autowired
    EvaluationRepository evalRepo;
    @Autowired
    private UserRepository userRepo;

    // Create responses
    public List<JobBasedResponseEntity> createResponse(List<JobBasedResponseEntity> responses) {
        for (JobBasedResponseEntity response : responses) {
            // Load existing evaluation
            Optional<EvaluationEntity> evaluation = evalRepo.findById(response.getEvaluation().getEvalID());
            if (evaluation.isPresent()) {
                response.setEvaluation(evaluation.get());
            } else {
                throw new RuntimeException("Evaluation not found");
            }

            // Load existing user
            Optional<UserEntity> user = userRepo.findById(response.getUser().getUserID());
            if (user.isPresent()) {
                response.setUser(user.get());
            } else {
                throw new RuntimeException("User not found");
            }
        }
        return jbrespRepo.saveAll(responses);
    }

    public List<JobBasedResponseEntity> getAllResponse(){
        return jbrespRepo.findAllResponse();
    }

    //return only the responsiblity of the user
    public List<String> getAllResponseByID(int userID){
        return jbrespRepo.findResponsesByID(userID);
    }



}
