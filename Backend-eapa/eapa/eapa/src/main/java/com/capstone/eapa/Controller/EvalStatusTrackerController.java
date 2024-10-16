package com.capstone.eapa.Controller;

import com.capstone.eapa.DTO.EvalStatusTrackerDTO;
import com.capstone.eapa.Entity.EvalStatusTrackerEntity;
import com.capstone.eapa.Service.EvalStatusTrackerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/eval-status")
@CrossOrigin(origins = "*")
public class EvalStatusTrackerController {
    @Autowired
    private EvalStatusTrackerService evalStatusService;

    //create 2 entries manually if not yet in the table
    @PostMapping("/create-tracker")
    public ResponseEntity<String> createEvalStatusTrackerForUser(
            @RequestParam int academicYearId,
            @RequestParam int firstSemesterId,
            @RequestParam int secondSemesterId,
            @RequestParam int userId) {
        try {
            evalStatusService.createEvalStatusTrackerForUser(academicYearId, firstSemesterId, secondSemesterId, userId);
            return ResponseEntity.ok("Evaluation Status Tracker created successfully for user ID: " + userId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating Evaluation Status Tracker: " + e.getMessage());
        }
    }

    // Fetch evaluation status for a specific user and academic year
    @GetMapping
    public List<EvalStatusTrackerDTO> getEvaluationStatus(
            @RequestParam int userId,
            @RequestParam int academicYearId
    ) {
        return evalStatusService.getEvaluationStatusByUserAndYear(userId, academicYearId);
    }

    // Update evaluation status for a specific tracker entry
    @PatchMapping("/update/{trackerId}")
    public EvalStatusTrackerDTO updateEvaluationStatus(
            @PathVariable int trackerId,
            @RequestParam boolean isCompleted
    ) {
        return evalStatusService.updateEvaluationStatus(trackerId, isCompleted);
    }

    // Delete all evaluation status entries by academic year
    @DeleteMapping("/by-academic-year/{academicYearId}")
    public void deleteEvaluationStatusByAcademicYear(@PathVariable int academicYearId) {
        evalStatusService.deleteEvaluationStatusByAcademicYear(academicYearId);
    }
}
