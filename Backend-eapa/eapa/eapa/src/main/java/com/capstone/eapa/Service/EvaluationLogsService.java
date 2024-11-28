package com.capstone.eapa.Service;

import com.capstone.eapa.Entity.EvaluationLogsEntity;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.EvaluationLogsRepository;
import com.capstone.eapa.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EvaluationLogsService {
    @Autowired
    EvaluationLogsRepository evalLogsRepo;
    @Autowired
    UserRepository userRepo;

    public EvaluationLogsEntity createEvalLogs(EvaluationLogsEntity evalLogs){
        Optional<UserEntity> user = userRepo.findByUserID(evalLogs.getUser().getUserID());

        if(user.isPresent()){
            evalLogs.setUser(user.get());
        }else {
            throw new RuntimeException("User not found with id: " + evalLogs.getUser().getUserID());
        }

        return evalLogsRepo.save(evalLogs);
    }

    public List<EvaluationLogsEntity> getEvalLogsByUserID(int userID){
        return evalLogsRepo.findByUserID(userID);
    }

    public List<EvaluationLogsEntity> getAllEvaluationLogs(){
        return evalLogsRepo.findAll();
    }
}
