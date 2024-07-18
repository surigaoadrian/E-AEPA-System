package com.capstone.eapa.Service;

import com.capstone.eapa.DTO.EvaluationDTO;
import com.capstone.eapa.Entity.EvaluationEntity;
import com.capstone.eapa.Entity.Role;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.EvaluationRepository;
import com.capstone.eapa.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.stream.Collectors;
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

    //Get evaluation ID for HEAD
    public Integer getEvalIDByUserIdPeriodStageHead(int userID, int empID, String period, String stage, String evalType) {
        return evalRepo.findEvalIDByUserIdPeriodStageHead(userID, empID, period, stage, evalType);
    }

    //returns true if evaluation is done
    public boolean isEvaluationCompleted(int userID, String period, String stage, String evalType) {
        String status = evalRepo.findStatusByUserIDPeriodStageAndEvalType(userID, period, stage, evalType);
        return "COMPLETED".equals(status);
    }

    //returns true if evaluation is done (HEAD)
    public boolean isEvaluationCompletedHead(int userID, int empID, String period, String stage, String evalType) {
        String status = evalRepo.findStatusByUserIDEmpIDPeriodStageAndEvalType(userID, empID, period, stage, evalType);
        return "COMPLETED".equals(status);
    }    public List<EvaluationEntity> getEvaluationsByUser(int userID) {
        return evalRepo.findByUserID(userID);
    }
    
    public List<EvaluationDTO> getAggregatedEvaluations() {
        List<EvaluationEntity> evaluations = evalRepo.findAll();

        return evaluations.stream()
            .collect(Collectors.groupingBy(EvaluationEntity::getUserId))
            .entrySet().stream()
            .map(entry -> {
                int userId = entry.getKey();
                String position = userRepo.findByUserID(userId).get().getPosition();
                String workID = userRepo.findByUserID(userId).get().getWorkID();
                String dept = userRepo.findByUserID(userId).get().getDept();
                String empStatus = userRepo.findByUserID(userId).get().getEmpStatus();
                String fName = userRepo.findByUserID(userId).get().getfName();
                String lName = userRepo.findByUserID(userId).get().getlName();
                Role role = userRepo.findByUserID(userId).get().getRole();


                List<EvaluationEntity> userEvaluations = entry.getValue();

                EvaluationDTO dto = new EvaluationDTO();
                dto.setUserId(userId);
                dto.setWorkID(workID);
                dto.setPosition(position);
                dto.setDept(dept);
                dto.setEmpStatus(empStatus);
                dto.setfName(fName);
                dto.setlName(lName);
                dto.setRole(role);
                
                for (EvaluationEntity eval : userEvaluations) {
                    switch (eval.getEvalType() + "-" + eval.getStage()) {
                        case "SELF-JOB":
                            dto.setSjbpStatus(eval.getStatus());
                            break;
                        case "SELF-VALUES":
                            dto.setSvbpaStatus(eval.getStatus());
                            break;
                        case "PEER-VALUES":
                            dto.setPvbpaStatus(eval.getStatus());
                            break;
                        // Add more cases as needed
                    }
                }
                return dto;
            })
            .collect(Collectors.toList());
    }


}
