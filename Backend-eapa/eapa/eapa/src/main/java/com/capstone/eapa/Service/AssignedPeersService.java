package com.capstone.eapa.Service;

import com.capstone.eapa.DTO.EvaluatorAssignmentDTO;
import com.capstone.eapa.Entity.AssignedPeerEvaluators;
import com.capstone.eapa.Entity.AssignedPeersEntity;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.AssignedPeerEvaluatorsRepository;
import com.capstone.eapa.Repository.AssignedPeersRepository;
import com.capstone.eapa.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AssignedPeersService {
    @Autowired
    AssignedPeersRepository apRepo;

    //ANGELA
    @Autowired 
    AssignedPeerEvaluatorsRepository apeRepo;

    @Autowired
    UserRepository userRepo;

    //create asssigned peers
    public AssignedPeersEntity createAssignedPeers(AssignedPeersEntity assignedPeers){
        Optional<UserEntity> evaluatee = userRepo.findByUserID(assignedPeers.getEvaluatee().getUserID());

        if(evaluatee.isPresent()){
            assignedPeers.setEvaluatee(evaluatee.get());
        } else {
            throw new RuntimeException("User not found with id: " + assignedPeers.getEvaluatee().getUserID());
        }

        // Fetch and set evaluators
        List<AssignedPeerEvaluators> evaluators = assignedPeers.getEvaluators();

        for (int i = 0; i < evaluators.size(); i++) {
            Optional<UserEntity> evaluator = userRepo.findById(evaluators.get(i).getEvaluator().getUserID());
            if (evaluator.isPresent()) {
                evaluators.get(i).setEvaluator(evaluator.get());
                evaluators.get(i).setAssignedPeers(assignedPeers);
            } else {
                throw new RuntimeException("Peer not found with id: " + evaluators.get(i).getEvaluator().getUserID());
            }
        }
        assignedPeers.setEvaluators(evaluators);

        return apRepo.save(assignedPeers);
    }

    // Get all assigned peers
    public List<AssignedPeersEntity> getAllAssignedPeers() {
        return apRepo.findAllAssignedPeers();
    }


     //Check if a user is an assigned peer and return an array of AssignedPeersEntity objects
    public List<EvaluatorAssignmentDTO> getEvaluateeAssignmentsByEvaluator(int evaluatorId) {
        List<AssignedPeersEntity> assignedPeersList = apRepo.findAll();
        List<EvaluatorAssignmentDTO> evaluatorAssignments = new ArrayList<>();

        for (AssignedPeersEntity assignedPeers : assignedPeersList) {
            for (AssignedPeerEvaluators evaluator : assignedPeers.getEvaluators()) {
                if (evaluator.getEvaluator().getUserID() == evaluatorId && !"COMPLETED".equalsIgnoreCase(evaluator.getStatus())) {
                    EvaluatorAssignmentDTO dto = new EvaluatorAssignmentDTO(
                            assignedPeers.getId(),
                            assignedPeers.getDateAssigned(),
                            assignedPeers.getPeriod(),
                            assignedPeers.getEvaluatee().getUserID(),
                            evaluator.getEvaluator().getUserID(),
                            evaluator.getStatus()
                    );
                    evaluatorAssignments.add(dto);
                }
            }
        }

        return evaluatorAssignments;
    }

    // Get ID of the tblassignedevaluator based on evaluatorId and assignedPeersId
    public Integer getAssignedEvaluatorId(int evaluatorId, int assignedPeersId) {
        return apRepo.findIdByEvaluatorAndAssignedPeers(evaluatorId, assignedPeersId);
    }

    // Get ID of tblassignedpeers based on period and evaluatee_id
    public Integer getAssignedPeersId(String period, int evaluateeId) {
        return apRepo.findIdByPeriodAndEvaluateeId(period, evaluateeId);
    }

    // Check if the ID of tblassignedpeers exists based on period and evaluatee_id
    public boolean isAssignedPeersIdPresent(String period, int evaluateeId) {
        Integer id = apRepo.findIdByPeriodAndEvaluateeId(period, evaluateeId);
        return id != null;
    }

    // Update status of assigned evaluators by ID
    public void updateAssignedEvaluatorStatus(int id, String status) {
        apRepo.updateStatusById(id, status);
    }

    // Method to get evaluator IDs for a given assignedPeersID
    public List<Integer> getEvaluatorIdsByAssignedPeersId(int assignedPeersId) {
        return apRepo.findEvaluatorIdsByAssignedPeersId(assignedPeersId);
    }

    //update evaluator
    public void updateAssignedEvaluators(int assignPeerId, List<Integer> evaluatorIds) {
        Optional<AssignedPeersEntity> optionalAssignedPeers = apRepo.findById(assignPeerId);
        if (optionalAssignedPeers.isPresent()) {
            AssignedPeersEntity assignedPeers = optionalAssignedPeers.get();

            // Clear current evaluators
            assignedPeers.getEvaluators().clear();

            // Add new evaluators based on provided IDs
            for (Integer evaluatorId : evaluatorIds) {
                Optional<UserEntity> evaluator = userRepo.findById(evaluatorId);
                if (evaluator.isPresent()) {
                    AssignedPeerEvaluators assignedPeerEvaluators = new AssignedPeerEvaluators();
                    assignedPeerEvaluators.setAssignedPeers(assignedPeers);
                    assignedPeerEvaluators.setEvaluator(evaluator.get());
                    assignedPeerEvaluators.setStatus("PENDING"); // or some default status
                    assignedPeers.getEvaluators().add(assignedPeerEvaluators);
                } else {
                    throw new RuntimeException("User not found with id: " + evaluatorId);
                }
            }
            apRepo.save(assignedPeers);
        } else {
            throw new RuntimeException("Assigned peers not found with id: " + assignPeerId);
        }
    }

    //ANGELA 
    public Map<Integer, String> getOverallStatus() {
        List<AssignedPeerEvaluators> evaluations = apeRepo.findAll();
        Map<Integer, String> overallStatusMap = new HashMap<>();
    
        // Group evaluations by evaluatee_id
        Map<Integer, List<AssignedPeerEvaluators>> groupedEvaluations = new HashMap<>();
        for (AssignedPeerEvaluators evaluation : evaluations) {
            int evaluateeId = evaluation.getAssignedPeers().getEvaluatee().getUserID();
            groupedEvaluations
                .computeIfAbsent(evaluateeId, k -> new ArrayList<>())
                .add(evaluation);
        }
    
        // Determine overall status for each evaluatee_id
        for (Map.Entry<Integer, List<AssignedPeerEvaluators>> entry : groupedEvaluations.entrySet()) {
            int evaluateeId = entry.getKey();
            List<AssignedPeerEvaluators> evals = entry.getValue();
    
            boolean allCompleted = true;
    
            for (AssignedPeerEvaluators eval : evals) {
                if (!"COMPLETED".equals(eval.getStatus())) {
                    allCompleted = false;
                    break; // Stop checking if a pending status is found
                }
            }
    
            overallStatusMap.put(evaluateeId, allCompleted ? "COMPLETED" : "PENDING");
        }
    
        return overallStatusMap;
    }

    public boolean isAssignedPeersIdPresentAnnual(String period, int evaluateeId, String schoolYear, String semester) {
        Integer id = apRepo.findIdByPeriodAndEvaluateeIdAndSchoolYearAndSemester(period, evaluateeId, schoolYear, semester);
        return id != null;
    }


}
