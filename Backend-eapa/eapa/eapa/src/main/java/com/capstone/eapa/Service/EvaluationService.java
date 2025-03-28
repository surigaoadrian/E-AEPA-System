package com.capstone.eapa.Service;

import com.capstone.eapa.DTO.AveragesDTO;
import com.capstone.eapa.DTO.EvaluationDTO;
import com.capstone.eapa.DTO.DepartmentEvaluationCountDTO;
import com.capstone.eapa.DTO.EvaluationStatusDTO;
import com.capstone.eapa.DTO.PeerEvaluationDTO;
import com.capstone.eapa.Entity.AssignedPeerEvaluators;
import com.capstone.eapa.Entity.AssignedPeersEntity;
import com.capstone.eapa.Entity.EvalStatusTrackerEntity;
import com.capstone.eapa.Entity.EvaluationEntity;
import com.capstone.eapa.Entity.ResponseEntity;
import com.capstone.eapa.Entity.Role;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.AssignedPeerEvaluatorsRepository;
import com.capstone.eapa.Repository.EvalStatusTrackerRepository;
import com.capstone.eapa.Repository.EvaluationRepository;
import com.capstone.eapa.Repository.ResponseRepository;
import com.capstone.eapa.Repository.UserRepository;

import io.jsonwebtoken.lang.Objects;
import jakarta.transaction.Transactional;

import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.function.Function;

@Service
public class EvaluationService {
    @Autowired
    EvaluationRepository evalRepo;

    @Autowired
    UserRepository userRepo;

    @Autowired
    ResponseRepository resRepo;

    @Autowired
    AssignedPeerEvaluatorsRepository assignedPeerEvaluatorsRepo;

    @Autowired
    AssignedPeersService apeServ;

    @Autowired
    EvalStatusTrackerRepository evalStatusRepo;

    // create evaluation
    public EvaluationEntity createEvaluation(EvaluationEntity evaluation) {
        Optional<UserEntity> user = userRepo.findByUserID(evaluation.getUser().getUserID());
        Optional<UserEntity> peer = evaluation.getPeer() != null
                ? userRepo.findByUserID(evaluation.getPeer().getUserID())
                : Optional.empty();

        if (user.isPresent()) {
            evaluation.setUser(user.get());
        } else {
            throw new RuntimeException("User not found with id: " + evaluation.getUser().getUserID());
        }

        if (peer.isPresent()) {
            evaluation.setPeer(peer.get());
        } else if (evaluation.getPeer() != null) {
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

    // Get all evaluation
    public List<EvaluationEntity> getAllEvaluations() {
        return evalRepo.findAllEvals();
    }

    
    // Get evaluation ID
    public Integer getEvalIDByUserIDAndPeriodAndStageAndEvalType(int userID, String period, String stage,
            String evalType) {
        return evalRepo.findEvalIDByUserIDAndPeriodAndStageAndEvalType(userID, period, stage, evalType);
    }

    //get peer id using eval id
    public Integer getPeerIDByEvalID(int evalID) {
        Integer peerID = evalRepo.findPeerIDByEvalID(evalID);
        return peerID;
    }

    //Get evaluation ID for assigned peer
    public Integer getEvalIDByUserIDPeriodStageEvalTypePeerID(int userID, String period, String stage, String evalType, int peerID) {
        return evalRepo.findEvalIDByUserIDAndPeriodAndStageAndEvalTypeAndPeerID(userID, period, stage, evalType, peerID);
    }
    // public Integer getEvalIDByUserIDPeriodStageEvalTypePeerID(int userID, String
    // period, String stage, String evalType, int peerID) {
    // Integer evalID =
    // evalRepo.findEvalIDByUserIDAndPeriodAndStageAndEvalTypeAndPeerID(userID,
    // period, stage, evalType, peerID);
    // return evalID != null ? evalID : null;
    // }

    // Get evaluation ID for HEAD
    public Integer getEvalIDByUserIdPeriodStageHead(int userID, int empID, String period, String stage,
            String evalType) {
        return evalRepo.findEvalIDByUserIdPeriodStageHead(userID, empID, period, stage, evalType);
    }

    // Get evaluation entity HEAD
    public EvaluationEntity getEvaluationByUserIdPeriodStageHead(int userID, int empID, String period, String stage,
            String evalType) {
        return evalRepo.findEvalByUserIdPeriodStageHead(userID, empID, period, stage, evalType);
    }

    // returns true if evaluation is done
    public boolean isEvaluationCompleted(int userID, String period, String stage, String evalType) {
        String status = evalRepo.findStatusByUserIDPeriodStageAndEvalType(userID, period, stage, evalType);
        return "COMPLETED".equals(status);
    }



    // returns true if evaluation is done (HEAD)
    public boolean isEvaluationCompletedHead(int userID, int empID, String period, String stage, String evalType) {
        String status = evalRepo.findStatusByUserIDEmpIDPeriodStageAndEvalType(userID, empID, period, stage, evalType);
        return "COMPLETED".equals(status);
    }

    // returns true if annual evaluation is done
    public boolean isEvaluationCompletedAnnual(int userID, String period, String stage, String evalType,
            String schoolYear) {
        String status = evalRepo.findStatusByUserIDPeriodStageEvalTypeAndSchoolYear(userID, period, stage, evalType,
                schoolYear);
        return "COMPLETED".equals(status);
    }

    public List<EvaluationEntity> getEvaluationsByUser(int userID) {
        return evalRepo.findByUserID(userID);
    }

    // ANGELA
    public List<EvaluationDTO> getAggregatedEvaluations() {
        List<EvaluationEntity> evaluations = evalRepo.findAll();
        Map<Integer, String> overallStatuses = apeServ.getOverallStatus();

        // Collect user IDs for HEAD evaluations
        Set<Integer> userIdsForHeadEval = evaluations.stream()
                .filter(eval -> "HEAD".equals(eval.getEvalType()) && eval.getPeer() != null)
                .map(eval -> eval.getPeer().getUserID())
                .collect(Collectors.toSet());

        // Get head evaluation statuses
        List<EvaluationDTO> headEvalStatuses = getHeadEvalStatus(userIdsForHeadEval);

        return evaluations.stream()
                .collect(Collectors.groupingBy(EvaluationEntity::getUserId))
                .entrySet().stream()
                .map(entry -> {
                    int userId = entry.getKey();
                    UserEntity user = userRepo.findByUserID(userId).orElse(null);

                    if (user == null) {
                        return null; 
                    }

                    String workID = user.getWorkID();
                    String position = user.getPosition();
                    String dept = user.getDept();
                    String empStatus = user.getEmpStatus();
                    String fName = user.getfName();
                    String lName = user.getlName();
                    Role role = user.getRole();
                    String dateHired = user.getDateHired();
                    boolean is3rdEvalComplete = user.getIs3rdEvalComplete();
                    boolean is5thEvalComplete = user.getIs5thEvalComplete();

                    List<EvaluationEntity> userEvaluations = entry.getValue();

                    EvaluationDTO dto = new EvaluationDTO();
                    dto.setUserId(userId);
                    dto.setWorkID(workID);
                    dto.setDept(dept);
                    dto.setEmpStatus(empStatus);
                    dto.setfName(fName);
                    dto.setlName(lName);
                    dto.setRole(role);
                    dto.setDateHired(dateHired);
                    dto.setIs3rdEvalComplete(is3rdEvalComplete);
                    dto.setIs5thEvalComplete(is5thEvalComplete);



                    // Set overall status from AssignedPeerEvaluators
                    String overallStatus = overallStatuses.get(userId); 
                    dto.setPvbpaStatus(overallStatus != null ? overallStatus : "N/A");

                    headEvalStatuses.stream()
                            .filter(headDto -> headDto.getUserId() == userId)
                            .findFirst()
                            .ifPresent(headDto -> {
                                dto.setHjbpStatus(headDto.getHjbpStatus());
                                dto.setHvbpaStatus(headDto.getHvbpaStatus());
                            });

                    List<LocalDate> evaluationDates = new ArrayList<>();
                    String schoolYear = null; // Initialize schoolYear variable
                    for (EvaluationEntity eval : userEvaluations) {
                        LocalDate dateTaken = eval.getDateTaken();
                        evaluationDates.add(dateTaken);
                        if (schoolYear == null) {
                            schoolYear = eval.getSchoolYear();
                        }
                        dto.setPeriod(eval.getPeriod());
                        dto.setSchoolYear(schoolYear != null ? schoolYear : "N/A");
                        switch (eval.getEvalType() + "-" + eval.getStage()) {
                            case "SELF-JOB":
                                dto.setSjbpStatus(eval.getStatus());
                                dto.setSjbpDateTaken(dateTaken);
                                break;
                            case "SELF-VALUES":
                                dto.setSvbpaStatus(eval.getStatus());
                                break;
                        }
                    }
                    // Query EvalStatusTrackerEntity for the acadYearId, semester, and isSentResult
                List<EvalStatusTrackerEntity> evalTrackers = evalStatusRepo.findByUser_UserID(userId);
                if (!evalTrackers.isEmpty()) {
                    EvalStatusTrackerEntity latestTracker = evalTrackers.get(0); // Assuming you want the latest tracker
                    // dto.setSchoolYear(latestTracker.getAcademicYear().getId());
                    dto.setSemester(latestTracker.getSemester().getId());
                    dto.setSentResult(latestTracker.isSentResult());
                }
                return dto;
                })
                .collect(Collectors.toList());
    }

    public List<EvaluationDTO> getHeadEvalStatus(Set<Integer> userIds) {
        List<EvaluationEntity> evaluations = evalRepo.findAll();
    
        
        Map<Integer, EvaluationDTO> dtoMap = new HashMap<>();
    
        evaluations.stream()
            .filter(eval -> "HEAD".equals(eval.getEvalType()) && eval.getPeer() != null) 
            .filter(eval -> userIds.contains(eval.getPeer().getUserID())) 
            .forEach(eval -> {
                int peerId = eval.getPeer().getUserID();
                EvaluationDTO dto = dtoMap.computeIfAbsent(peerId, id -> {
                    EvaluationDTO newDto = new EvaluationDTO();
                    newDto.setUserId(eval.getPeer().getUserID()); 
                    newDto.setRole(eval.getPeer().getRole());
                    newDto.setWorkID(eval.getPeer().getWorkID());
                    newDto.setDept(eval.getPeer().getDept());
                    newDto.setEmpStatus(eval.getPeer().getEmpStatus());
                    return newDto; 
                });
    
                // Set the status based on evalType and stage
                switch (eval.getStage()) {
                    case "JOB":
                        dto.setHjbpStatus(eval.getStatus()); 
                        break;
                    case "VALUES":
                        dto.setHvbpaStatus(eval.getStatus()); 
                        break;
                }
            });
    
        return new ArrayList<>(dtoMap.values()); 
    }

    // total employee for recommendation
    public long countRecommendedEmployees() {
        return evalRepo.countByPeriodAndStatus();
    }

//    // 3rd Month: Eligible takers
//    public EvaluationStatusDTO getThirdMonthEvaluationStatus() {
//        List<Long> eligibleUsers = userRepo.getUsersFor3rdMonthEvaluation();
//        List<Long> completedEvaluations = evalRepo.getCompleted3rdMonthEvaluation();
//
//        int totalEligible = eligibleUsers.size();
//        int completed = completedEvaluations.size();
//        int notCompleted = Math.max(0, totalEligible - completed); // Ensure notCompleted is non-negative
//
//        return new EvaluationStatusDTO(completed, notCompleted);
//    }
//
//    public EvaluationStatusDTO getFifthMonthEvaluationStatus() {
//        List<Long> eligibleUsers = userRepo.getUsersFor5thMonthEvaluation();
//        List<Long> completedEvaluations = evalRepo.getCompleted5thMonthEvaluation();
//
//        int totalEligible = eligibleUsers.size();
//        int completed = completedEvaluations.size();
//        int notCompleted = Math.max(0, totalEligible - completed); // Ensure notCompleted is non-negative
//
//        return new EvaluationStatusDTO(completed, notCompleted);
//    }
//
//    public EvaluationStatusDTO getAnnualEvaluationStatus() {
//        List<Long> eligibleUsers = userRepo.getUsersForAnnualEvaluation();
//        List<Long> completedEvaluations = evalRepo.getCompletedAnnualEvaluation();
//
//        int totalEligible = eligibleUsers.size();
//        int completed = completedEvaluations.size();
//        int notCompleted = Math.max(0, totalEligible - completed); // Ensure notCompleted is non-negative
//
//        return new EvaluationStatusDTO(completed, notCompleted);
//    }

    // New methods for only completed counts
    public long getCompleted3rdMonthEvaluationCount() {
        return evalRepo.getCompleted3rdMonthEvaluation().size();
    }

    public long getCompleted5thMonthEvaluationCount() {
        return evalRepo.getCompleted5thMonthEvaluation().size();
    }

    public long getCompletedAnnualEvaluationCount() {
        return evalRepo.getCompletedAnnualEvaluation().size();
    }

    public Long getTotalUniqueUserIds() {
        return evalRepo.countUniqueUserIds();
    }

    // Evaluation Count per Department : 3rd Month
    public List<DepartmentEvaluationCountDTO> getCompletedEvaluationsForThirdMonth() {
        List<Object[]> results = evalRepo.countCompletedForThirdMonthPerDept();
        return results.stream()
                .map(result -> new DepartmentEvaluationCountDTO((String) result[0], (Long) result[1]))
                .collect(Collectors.toList());
    }

    // Evaluation Count per Department : Annual
    public List<DepartmentEvaluationCountDTO> getCompletedEvaluationsForAnnual() {
        List<Object[]> results = evalRepo.countCompletedForAnnualPerDept();
        return results.stream()
                .map(result -> new DepartmentEvaluationCountDTO((String) result[0], (Long) result[1]))
                .collect(Collectors.toList());
    }

    // Evaluation Count per Department : 5th Month
    public List<DepartmentEvaluationCountDTO> getCompletedEvaluationsForFifthMonth() {
        List<Object[]> results = evalRepo.countCompletedForFifthMonthPerDept();
        return results.stream()
                .map(result -> new DepartmentEvaluationCountDTO((String) result[0], (Long) result[1]))
                .collect(Collectors.toList());
    }

    public AveragesDTO getPeerEvaluationAverages(int peerID, int userID, String period, String evalType, String schoolYear, String semester) {
        List<EvaluationEntity> evaluations = evalRepo.findByUserIDAndPeerIDAndPeriodAndEvalType(userID, peerID, period,
                evalType, schoolYear, semester);

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
            if (category == null)
                continue; // Skip if category is null

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