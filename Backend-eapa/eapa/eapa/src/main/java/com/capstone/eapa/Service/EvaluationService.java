package com.capstone.eapa.Service;

import com.capstone.eapa.Entity.EvaluationEntity;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.EvaluationRepository;
import com.capstone.eapa.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class EvaluationService {
    @Autowired
    EvaluationRepository evalRepo;

    @Autowired
    UserRepository userRepo;

    //create evaluation
    public EvaluationEntity createEvaluation(EvaluationEntity evaluation){
        Optional<UserEntity> user = userRepo.findByUserID(evaluation.getUser().getUserID());
        Optional<UserEntity> peer = evaluation.getPeer() != null ? userRepo.findByUserID(evaluation.getPeer().getUserID()) : Optional.empty();

        if(user.isPresent()){
            evaluation.setUser(user.get());
        } else {
            throw new RuntimeException("User not found with id: " + evaluation.getUser().getUserID());
        }

        if(peer.isPresent()){
            evaluation.setPeer(peer.get());
        } else if(evaluation.getPeer() != null){
            throw new RuntimeException("Peer not found with id: " + evaluation.getPeer().getUserID());
        }

        return evalRepo.save(evaluation);

    }

    @Transactional
    public EvaluationEntity updateEvaluation(int evalID, EvaluationEntity updatedEvaluation) {
        Optional<EvaluationEntity> existingEvalOpt = evalRepo.findById(evalID);

        if (existingEvalOpt.isPresent()) {
            EvaluationEntity existingEval = existingEvalOpt.get();

            if (updatedEvaluation.getUser() != null) {
                Optional<UserEntity> user = userRepo.findById(updatedEvaluation.getUser().getUserID());
                if (user.isPresent()) {
                    existingEval.setUser(user.get());
                } else {
                    throw new RuntimeException("User not found with id: " + updatedEvaluation.getUser().getUserID());
                }
            }
            if (updatedEvaluation.getPeer() != null) {
                Optional<UserEntity> peer = userRepo.findById(updatedEvaluation.getPeer().getUserID());
                if (peer.isPresent()) {
                    existingEval.setPeer(peer.get());
                } else {
                    throw new RuntimeException("Peer not found with id: " + updatedEvaluation.getPeer().getUserID());
                }
            }
            if (updatedEvaluation.getEvalType() != null) {
                existingEval.setEvalType(updatedEvaluation.getEvalType());
            }
            if (updatedEvaluation.getStage() != null) {
                existingEval.setStage(updatedEvaluation.getStage());
            }
            if (updatedEvaluation.getPeriod() != null) {
                existingEval.setPeriod(updatedEvaluation.getPeriod());
            }
            if (updatedEvaluation.getStatus() != null) {
                existingEval.setStatus(updatedEvaluation.getStatus());
            }
            if (updatedEvaluation.getDateTaken() != null) {
                existingEval.setDateTaken(updatedEvaluation.getDateTaken());
            }
            if (updatedEvaluation.getIsDeleted() != 0) {
                existingEval.setIsDeleted(updatedEvaluation.getIsDeleted());
            }

            return evalRepo.save(existingEval);
        } else {
            throw new RuntimeException("Evaluation not found with id: " + evalID);
        }
    }

    //Get all evaluation
    public List<EvaluationEntity> getAllEvaluations(){
        return evalRepo.findAllEvals();
    }

    //Get evaluation ID
    public Integer getEvalIDByUserIDAndPeriodAndStageAndEvalType(int userID, String period, String stage, String evalType) {
        return evalRepo.findEvalIDByUserIDAndPeriodAndStageAndEvalType(userID, period, stage, evalType);
    }

    //returns true if evaluation is done
    public boolean isEvaluationCompleted(int userID, String period, String stage, String evalType) {
        String status = evalRepo.findStatusByUserIDPeriodStageAndEvalType(userID, period, stage, evalType);
        return "COMPLETED".equals(status);
    }

    public List<EvaluationEntity> getEvaluationsByUser(int userID) {
        return evalRepo.findByUserID(userID);
    }



}
