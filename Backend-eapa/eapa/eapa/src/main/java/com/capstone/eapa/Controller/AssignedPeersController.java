package com.capstone.eapa.Controller;

import com.capstone.eapa.DTO.AssignedPeersDTO;
import com.capstone.eapa.DTO.EvaluatorAssignmentDTO;
import com.capstone.eapa.DTO.EvaluatorDTO;
import com.capstone.eapa.DTO.UserDTO;
import com.capstone.eapa.Entity.AssignedPeerEvaluators;
import com.capstone.eapa.Entity.AssignedPeersEntity;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Service.AssignedPeersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/assignedPeers")
@CrossOrigin(origins = "*")
public class AssignedPeersController {
    @Autowired
    AssignedPeersService apServ;

    @PostMapping("/createAssignedPeers")
    public AssignedPeersDTO createAssignedPeers(@RequestBody AssignedPeersEntity assignedPeers) {
        AssignedPeersEntity savedEntity = apServ.createAssignedPeers(assignedPeers);
        return convertToDTO(savedEntity);
    }

    private AssignedPeersDTO convertToDTO(AssignedPeersEntity assignedPeers) {
        AssignedPeersDTO dto = new AssignedPeersDTO();
        dto.setId(assignedPeers.getId());
        dto.setEvaluatee(convertUserToDTO(assignedPeers.getEvaluatee()));
        dto.setEvaluators(assignedPeers.getEvaluators().stream()
                .map(this::convertEvaluatorToDTO)
                .collect(Collectors.toList()));
        dto.setPeriod(assignedPeers.getPeriod());
        dto.setDateAssigned(assignedPeers.getDateAssigned());
        return dto;
    }

    private UserDTO convertUserToDTO(UserEntity user) {
        UserDTO dto = new UserDTO();
        dto.setUserID(user.getUserID());
        dto.setWorkID(user.getWorkID());
        dto.setfName(user.getfName());
        dto.setlName(user.getlName());
        dto.setWorkEmail(user.getWorkEmail());
        dto.setUsername(user.getUsername());
        dto.setPosition(user.getPosition());
        dto.setDept(user.getDept());
        return dto;
    }

    private EvaluatorDTO convertEvaluatorToDTO(AssignedPeerEvaluators evaluator) {
        EvaluatorDTO dto = new EvaluatorDTO();
        dto.setUserID(evaluator.getEvaluator().getUserID());
        dto.setStatus(evaluator.getStatus());
        return dto;
    }

    @GetMapping("/getAssignedPeers")
    public List<AssignedPeersEntity> getAssignedPeers(){
        return apServ.getAllAssignedPeers();
    }

    @GetMapping("/checkEvaluator")
    public List<EvaluatorAssignmentDTO> checkEvaluator(@RequestParam int evaluatorId) {
        return apServ.getEvaluateeAssignmentsByEvaluator(evaluatorId);
    }

    @GetMapping("/getAssignedEvaluatorId")
    public Integer getAssignedEvaluatorId(@RequestParam int evaluatorId, @RequestParam int assignedPeersId) {
        return apServ.getAssignedEvaluatorId(evaluatorId, assignedPeersId);
    }

    //returns true or false if id exists
    @GetMapping("/isAssignedPeersIdPresent")
    public boolean isAssignedPeersIdPresent(String period, int evaluateeId){
        return apServ.isAssignedPeersIdPresent(period, evaluateeId);
    }

    //is assign peer id present for annual
    @GetMapping("/isAssignedPeersIdPresentAnnual")
    public boolean isAssignedPeersIdPresentAnnual(
            @RequestParam String period,
            @RequestParam int evaluateeId,
            @RequestParam String schoolYear,
            @RequestParam String semester) {
        return apServ.isAssignedPeersIdPresentAnnual(period, evaluateeId, schoolYear, semester);
    }

    // Update status of assigned evaluators by ID
    @PatchMapping("/updateEvaluatorStatus/{id}")
    public void updateEvaluatorStatus(@PathVariable int id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        apServ.updateAssignedEvaluatorStatus(id, status);
    }

    //kani nga method cielo kuhaon niya ang id sa tblassignpeersid ang params ani kay (period ug id sa user)
    @GetMapping("/getAssignedPeersId")
    public Integer getAssignedPeersId(@RequestParam String period, @RequestParam int evaluateeId) {
        return apServ.getAssignedPeersId(period, evaluateeId);
    }

    //kani na method cielo mo kuha sa peer ids unya e sud sa array. ang params ani kay (id nga result sa ibabaw nga method)
    @GetMapping("/getEvaluatorIds")
    public List<Integer> getEvaluatorIds(@RequestParam int assignedPeersId) {
        return apServ.getEvaluatorIdsByAssignedPeersId(assignedPeersId);
    }

    //update assigned peers
    @PatchMapping("/updateAssignedEvaluators/{assignPeerId}")
    public ResponseEntity<String> updateAssignedEvaluators(
            @PathVariable int assignPeerId,
            @RequestBody List<Integer> evaluatorIds) {
        try {
            apServ.updateAssignedEvaluators(assignPeerId, evaluatorIds);
            return ResponseEntity.ok("Assigned evaluators updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating assigned evaluators.");
        }
    }


}
