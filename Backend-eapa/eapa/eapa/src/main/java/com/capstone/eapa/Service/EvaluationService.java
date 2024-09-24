package com.capstone.eapa.Service;

import com.capstone.eapa.DTO.AveragesDTO;
import com.capstone.eapa.DTO.EvaluationDTO;
import com.capstone.eapa.DTO.DepartmentEvaluationCountDTO;
import com.capstone.eapa.DTO.EvaluationStatusDTO;
import com.capstone.eapa.DTO.PeerEvaluationDTO;
import com.capstone.eapa.Entity.AssignedPeerEvaluators;
import com.capstone.eapa.Entity.AssignedPeersEntity;
import com.capstone.eapa.Entity.EvaluationEntity;
import com.capstone.eapa.Entity.ResponseEntity;
import com.capstone.eapa.Entity.Role;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.AssignedPeerEvaluatorsRepository;
import com.capstone.eapa.Repository.EvaluationRepository;
import com.capstone.eapa.Repository.ResponseRepository;
import com.capstone.eapa.Repository.UserRepository;

import io.jsonwebtoken.lang.Objects;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
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
//    public Integer getEvalIDByUserIDPeriodStageEvalTypePeerID(int userID, String period, String stage, String evalType, int peerID) {
//        Integer evalID = evalRepo.findEvalIDByUserIDAndPeriodAndStageAndEvalTypeAndPeerID(userID, period, stage, evalType, peerID);
//        return evalID != null ? evalID : null;
//    }

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

    public List<EvaluationEntity> getEvaluationsByUser(int userID) {
        return evalRepo.findByUserID(userID);
    }

    public List<EvaluationDTO> getAggregatedEvaluations() {
        List<EvaluationEntity> evaluations = evalRepo.findAll();

        // Fetch peer evaluations and create a map by evaluateeId
        List<PeerEvaluationDTO> peerEvaluations = getMergedPeerEvaluations();
        Map<Integer, String> peerEvaluationStatusMap = peerEvaluations.stream()
                .collect(Collectors.toMap(PeerEvaluationDTO::getEvaluateeId, PeerEvaluationDTO::getMergedStatus));

        return evaluations.stream()
                .collect(Collectors.groupingBy(EvaluationEntity::getUserId))
                .entrySet().stream()
                .map(entry -> {
                    int userId = entry.getKey();
                    UserEntity user = userRepo.findByUserID(userId).orElse(null);

                    if (user == null) {
                        return null; // Handle missing user case
                    }

                    String workID = user.getWorkID();
                    String position = user.getPosition();
                    String dept = user.getDept();
                    String empStatus = user.getEmpStatus();
                    String fName = user.getfName();
                    String lName = user.getlName();
                    Role role = user.getRole();

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
                            // case "PEER-A-VALUES":
                                
                            //     break;
                            case "PEER-VALUES":
                                dto.setPvbpaStatus(eval.getStatus());
                                // Do not set directly, will set below from peer evaluations
                                break;
                            // Add more cases as needed
                        }
                    }

                    // // Set the combined peer status
                    // String combinedPeerStatus = calculateCombinedPeerStatus(userEvaluations);
                    // dto.setPavbpaStatus(combinedPeerStatus);

                    // // Set the peer values status from peer evaluations
                    // String peerValuesStatus = peerEvaluationStatusMap.get(userId);
                    // if (peerValuesStatus != null) {
                    //     dto.setPvbpaStatus(peerValuesStatus);
                    // }

                    return dto;
                })
                // .filter(Objects::nonNull) // Remove any null entries
                .collect(Collectors.toList());
    }

    public List<PeerEvaluationDTO> getMergedPeerEvaluations() {
        List<AssignedPeerEvaluators> evaluations = assignedPeerEvaluatorsRepo.findAll();

        // Create a map to store AssignedPeersEntity based on id
        Map<Integer, AssignedPeersEntity> assignedPeersEntityMap = evaluations.stream()
                .map(AssignedPeerEvaluators::getAssignedPeers) // Get AssignedPeersEntity
                .distinct() // Ensure each entry is unique
                .collect(Collectors.toMap(AssignedPeersEntity::getId, Function.identity()));

        // Group evaluations by AssignedPeersEntity id
        Map<Integer, List<AssignedPeerEvaluators>> groupedByPeersId = evaluations.stream()
                .collect(Collectors.groupingBy(evaluation -> evaluation.getAssignedPeers().getId()));

        return groupedByPeersId.entrySet().stream()
                .map(entry -> {
                    int assignedPeersId = entry.getKey();
                    List<AssignedPeerEvaluators> peerEvaluations = entry.getValue();

                    PeerEvaluationDTO dto = new PeerEvaluationDTO();
                    dto.setAssignedPeersId(assignedPeersId);

                    // Retrieve evaluateeId from AssignedPeersEntity
                    AssignedPeersEntity assignedPeersEntity = assignedPeersEntityMap.get(assignedPeersId);
                    if (assignedPeersEntity != null) {
                        dto.setEvaluateeId(assignedPeersEntity.getEvaluatee().getUserID());
                    }

                    long pendingCount = peerEvaluations.stream()
                            .filter(e -> "PENDING".equals(e.getStatus()))
                            .count();

                    long completedCount = peerEvaluations.stream()
                            .filter(e -> "COMPLETED".equals(e.getStatus()))
                            .count();

                    String mergedStatus;
                    if (pendingCount == 3) {
                        mergedStatus = "Not Yet Open";
                    } else if (completedCount == 3) {
                        mergedStatus = "COMPLETED";
                    } else if (pendingCount >= 1 && pendingCount < 3) {
                        mergedStatus = "IN PROGRESS";
                    } else {
                        mergedStatus = "UNKNOWN"; // Default case, handle other cases as needed
                    }

                    dto.setMergedStatus(mergedStatus);

                    return dto;
                })
                .collect(Collectors.toList());
    }

    public String calculateCombinedPeerStatus(List<EvaluationEntity> userEvaluations) {
        boolean peerCompleted = false;
        boolean peerACompleted = false;

        for (EvaluationEntity eval : userEvaluations) {
            if ("PEER-VALUES".equals(eval.getEvalType() + "-" + eval.getStage())) {
                if ("COMPLETED".equals(eval.getStatus())) {
                    peerCompleted = true;
                }
            } else if ("PEER-A-VALUES".equals(eval.getEvalType() + "-" + eval.getStage())) {
                if ("COMPLETED".equals(eval.getStatus())) {
                    peerACompleted = true;
                }
            }
        }

        if (peerCompleted && peerACompleted) {
            return "COMPLETED";
        } else if (peerCompleted || peerACompleted) {
            return "IN PROGRESS";
        } else {
            return "Not Yet Open";
        }
    }

//total employee for recommendation
    public long countRecommendedEmployees() {
        return evalRepo.countByPeriodAndStatus();
    }



    // Method to get 3rd Month evaluation status
    public EvaluationStatusDTO getThirdMonthEvaluationStatus() {
        List<Long> completedThirdMonthUsers = evalRepo.getCompleted3rdMonthEvaluation();
            long completed = completedThirdMonthUsers.size();
            long notCompleted = evalRepo.countOpenForThirdMonth();
        return new EvaluationStatusDTO(completed, notCompleted);
    }

    // Method to get 5th Month evaluation status
    public EvaluationStatusDTO getFifthMonthEvaluationStatus() {
        List<Long> completedFifthMonthUsers = evalRepo.getCompleted5thMonthEvaluation();
        long completed = completedFifthMonthUsers.size();
        long notCompleted = evalRepo.countOpenForFifthMonth();
        return new EvaluationStatusDTO(completed,notCompleted);
    }

    public EvaluationStatusDTO getAnnualEvaluationStatus() {
        List<Long> completedAnnualUsers = evalRepo.getCompletedAnnualEvaluation();
        long completed = completedAnnualUsers.size();
        long notCompleted = evalRepo.countOpenForFifthMonth();
        return new EvaluationStatusDTO(completed, notCompleted);
    }

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
        List<EvaluationEntity> evaluations = evalRepo.findByUserIDAndPeerIDAndPeriodAndEvalType(userID, peerID, period,
                evalType);

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
