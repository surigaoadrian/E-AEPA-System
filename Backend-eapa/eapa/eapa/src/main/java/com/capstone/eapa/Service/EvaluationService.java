package com.capstone.eapa.Service;

import com.capstone.eapa.DTO.AveragesDTO;
import com.capstone.eapa.DTO.EvaluationDTO;
import com.capstone.eapa.DTO.DepartmentEvaluationCountDTO;
import com.capstone.eapa.DTO.EvaluationStatusDTO;
import com.capstone.eapa.Entity.EvaluationEntity;
import com.capstone.eapa.Entity.ResponseEntity;
import com.capstone.eapa.Entity.Role;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.EvaluationRepository;
import com.capstone.eapa.Repository.ResponseRepository;
import com.capstone.eapa.Repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
public class EvaluationService {
    @Autowired
    EvaluationRepository evalRepo;

    @Autowired
    UserRepository userRepo;

    @Autowired
    ResponseRepository resRepo;

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
            if (updatedEvaluation.getSchoolYear() != null) {
                existingEval.setSchoolYear(updatedEvaluation.getSchoolYear());
            }
            if (updatedEvaluation.getSemester() != null) {
                existingEval.setSemester(updatedEvaluation.getSemester());
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

    //Get evaluation ID for assigned peer
    public Integer getEvalIDByUserIDPeriodStageEvalTypePeerID(int userID, String period, String stage, String evalType, int peerID) {
        return evalRepo.findEvalIDByUserIDAndPeriodAndStageAndEvalTypeAndPeerID(userID, period, stage, evalType, peerID);
    }

    //Get evaluation ID for HEAD
    public Integer getEvalIDByUserIdPeriodStageHead(int userID, int empID, String period, String stage, String evalType) {
        return evalRepo.findEvalIDByUserIdPeriodStageHead(userID, empID, period, stage, evalType);
    }

    // Get evaluation entity HEAD
    public EvaluationEntity getEvaluationByUserIdPeriodStageHead(int userID, int empID, String period, String stage, String evalType) {
        return evalRepo.findEvalByUserIdPeriodStageHead(userID, empID, period, stage, evalType);
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


//total employee for recommendation
    public long countRecommendedEmployees() {
        return evalRepo.countByPeriodAndStatus();
    }



    // Method to get 3rd Month evaluation status
    public EvaluationStatusDTO getThirdMonthEvaluationStatus() {
        List<Long> completedThirdMonthUsers = evalRepo.getCompleted3rdMonthEvaluation();
        List<Long> completedFifthMonthUsers = evalRepo.getCompleted5thMonthEvaluation();

        // Filter out users who have completed the 5th month from the 3rd month completed list
        long adjustedCompleted = completedThirdMonthUsers.stream()
                .filter(userId -> !completedFifthMonthUsers.contains(userId))
                .count();

        long open = evalRepo.countOpenForThirdMonth();

        return new EvaluationStatusDTO(adjustedCompleted, open);
    }


    // Method to get 5th Month evaluation status
    public EvaluationStatusDTO getFifthMonthEvaluationStatus() {
        List<Long> completedFifthMonthUsers = evalRepo.getCompleted5thMonthEvaluation();
        List<Long> completedAnnualUsers = evalRepo.getCompletedAnnualEvaluation();

        // Filter out users who have completed both 5th Month and Annual evaluations
        long adjustedCompleted = completedFifthMonthUsers.stream()
                .filter(userId -> !completedAnnualUsers.contains(userId))
                .count();

        // Count of users who have not completed the 5th Month evaluation
        long open = evalRepo.countOpenForFifthMonth();

        return new EvaluationStatusDTO(adjustedCompleted, open);
    }


    public EvaluationStatusDTO getAnnualEvaluationStatus() {
        List<Long> completedAnnualUsers = evalRepo.getCompletedAnnualEvaluation();
        List<Long> completedFifthMonthUsers = evalRepo.getCompleted5thMonthEvaluation();

        // Count users who have completed the Annual evaluation
        long adjustedCompleted = completedAnnualUsers.size();

        // Add users from the 5th Month evaluation who have also completed the Annual evaluation
        long additionalCompleted = completedFifthMonthUsers.stream()
                .filter(completedAnnualUsers::contains)
                .count();

        adjustedCompleted += additionalCompleted;

        // Count of users who have not yet completed
        long open = evalRepo.countOpenForAnnual();

        return new EvaluationStatusDTO(adjustedCompleted, open);

    }


    public Long getTotalUniqueUserIds() {
        return evalRepo.countUniqueUserIds();
    }

    //Evaluation Count per Department : 3rd Month
    public List<DepartmentEvaluationCountDTO> getCompletedEvaluationsForThirdMonth() {
        List<Object[]> results = evalRepo.countCompletedForThirdMonthPerDept();
        return results.stream()
                .map(result -> new DepartmentEvaluationCountDTO((String) result[0], (Long) result[1]))
                .collect(Collectors.toList());
    }

    //Evaluation Count per Department : Annual
    public List<DepartmentEvaluationCountDTO> getCompletedEvaluationsForAnnual() {
        List<Object[]> results = evalRepo.countCompletedForAnnualPerDept();
        return results.stream()
                .map(result -> new DepartmentEvaluationCountDTO((String) result[0], (Long) result[1]))
                .collect(Collectors.toList());
    }
    //Evaluation Count per Department : 5th Month
    public List<DepartmentEvaluationCountDTO> getCompletedEvaluationsForFifthMonth() {
        List<Object[]> results = evalRepo.countCompletedForFifthMonthPerDept();
        return results.stream()
                .map(result -> new DepartmentEvaluationCountDTO((String) result[0], (Long) result[1]))
                .collect(Collectors.toList());
    }



    public AveragesDTO getPeerEvaluationAverages(int peerID, int userID, String period, String evalType) {
        List<EvaluationEntity> evaluations = evalRepo.findByUserIDAndPeerIDAndPeriodAndEvalType(userID, peerID, period, evalType);

        if (evaluations.isEmpty()) {
            throw new RuntimeException("No evaluations found matching the criteria");
        }

        // Collect all responses for the found evaluations
        List<ResponseEntity> responses = evaluations.stream()
                .flatMap(evaluation -> resRepo.findByEvaluation_EvalID(evaluation.getEvalID()).stream())
                .collect(Collectors.toList());

        // Calculate averages by category
        AveragesDTO averages = new AveragesDTO();

        double totalCOE = 0, totalINT = 0, totalTEA = 0, totalUNI = 0;
        int countCOE = 0, countINT = 0, countTEA = 0, countUNI = 0;

        for (ResponseEntity response : responses) {
            String category = response.getQuestion().getCategory();
            if (category == null) continue; // Skip if category is null

            double score = response.getScore();

            switch (category) {
                case "CULTURE OF EXCELLENCE":
                    totalCOE += score;
                    countCOE++;
                    break;
                case "INTEGRITY":
                    totalINT += score;
                    countINT++;
                    break;
                case "TEAMWORK":
                    totalTEA += score;
                    countTEA++;
                    break;
                case "UNIVERSALITY":
                    totalUNI += score;
                    countUNI++;
                    break;
            }
        }

        averages.setCOE(countCOE > 0 ? totalCOE / countCOE : 0);
        averages.setINT(countINT > 0 ? totalINT / countINT : 0);
        averages.setTEA(countTEA > 0 ? totalTEA / countTEA : 0);
        averages.setUNI(countUNI > 0 ? totalUNI / countUNI : 0);

        return averages;
    }



}
