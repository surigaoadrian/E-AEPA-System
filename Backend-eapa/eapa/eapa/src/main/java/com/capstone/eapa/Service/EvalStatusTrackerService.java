package com.capstone.eapa.Service;


import com.capstone.eapa.DTO.EvalStatusTrackerDTO;
import com.capstone.eapa.Entity.AcademicYearEntity;
import com.capstone.eapa.Entity.EvalStatusTrackerEntity;
import com.capstone.eapa.Entity.SemesterEntity;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.AcademicYearRepository;
import com.capstone.eapa.Repository.EvalStatusTrackerRepository;
import com.capstone.eapa.Repository.SemesterRepository;
import com.capstone.eapa.Repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EvalStatusTrackerService {
    @Autowired
    private EvalStatusTrackerRepository evalStatusRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private AcademicYearRepository acadYearRepo;

    @Autowired
    private SemesterRepository semRepo;

    //create 2 entries manually if not yet in the table
    public void createEvalStatusTrackerForUser(int academicYearId, int firstSemesterId, int secondSemesterId, int userId) {
        // Fetch the necessary entities
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        AcademicYearEntity academicYear = acadYearRepo.findById(academicYearId)
                .orElseThrow(() -> new EntityNotFoundException("Academic year not found with id: " + academicYearId));
        SemesterEntity firstSemester = semRepo.findById(firstSemesterId)
                .orElseThrow(() -> new EntityNotFoundException("First semester not found with id: " + firstSemesterId));
        SemesterEntity secondSemester = semRepo.findById(secondSemesterId)
                .orElseThrow(() -> new EntityNotFoundException("Second semester not found with id: " + secondSemesterId));

        // Create an entry for the first semester
        EvalStatusTrackerEntity firstSemEvalStatus = new EvalStatusTrackerEntity(
                user, academicYear, firstSemester, false, null
        );
        evalStatusRepo.save(firstSemEvalStatus);

        // Create an entry for the second semester
        EvalStatusTrackerEntity secondSemEvalStatus = new EvalStatusTrackerEntity(
                user, academicYear, secondSemester, false, null
        );
        evalStatusRepo.save(secondSemEvalStatus);
    }


    // Fetch evaluation status for a specific user and academic year
//    public List<EvalStatusTrackerEntity> getEvaluationStatusByUserAndYear(int userId, int academicYearId) {
//        return evalStatusRepo.findByUserIdAndAcademicYearId(userId, academicYearId);
//    }

    // Fetch evaluation status for a specific user and academic year
//    public List<EvalStatusTrackerEntity> getEvaluationStatusByUserAndYear(int userId, int academicYearId) {
//        UserEntity user =  userRepo.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
//        AcademicYearEntity academicYear = acadYearRepo.findById(academicYearId).orElseThrow(() -> new EntityNotFoundException("Academic year not found"));
//
//        return evalStatusRepo.findByUserAndAcademicYear(user, academicYear);
//    }
    public List<EvalStatusTrackerDTO> getEvaluationStatusByUserAndYear(int userId, int academicYearId) {
        List<EvalStatusTrackerEntity> evalStatusEntities = evalStatusRepo.findByUser_UserIDAndAcademicYear_Id(userId, academicYearId);

        // Convert entities to DTOs
        return evalStatusEntities.stream()
                .map(entity -> {
                    EvalStatusTrackerDTO dto = new EvalStatusTrackerDTO();
                    dto.setId(entity.getId());
                    dto.setCompleted(entity.isCompleted());
                    dto.setCompletedAt(entity.getCompletedAt() != null ? entity.getCompletedAt().toString() : null);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Update evaluation status
//    public EvalStatusTrackerEntity updateEvaluationStatus(int trackerId, boolean isCompleted) {
//        EvalStatusTrackerEntity tracker = evalStatusRepo.findById(trackerId).orElseThrow(() -> new RuntimeException("Tracker not found"));
//        tracker.setCompleted(isCompleted);
//        if (isCompleted) {
//            tracker.setCompletedAt(java.time.LocalDateTime.now());
//        }
//        return evalStatusRepo.save(tracker);
//    }
    public EvalStatusTrackerDTO updateEvaluationStatus(int trackerId, boolean isCompleted) {
        EvalStatusTrackerEntity tracker = evalStatusRepo.findById(trackerId)
                .orElseThrow(() -> new RuntimeException("Evaluation status not found"));

        tracker.setCompleted(isCompleted);
        tracker.setCompletedAt(isCompleted ? LocalDateTime.now() : null);
        EvalStatusTrackerEntity updatedTracker = evalStatusRepo.save(tracker);

        // Map to DTO
        EvalStatusTrackerDTO dto = new EvalStatusTrackerDTO();
        dto.setId(updatedTracker.getId());
        dto.setCompleted(updatedTracker.isCompleted());
        dto.setCompletedAt(updatedTracker.getCompletedAt() != null ? updatedTracker.getCompletedAt().toString() : null);

        return dto;
    }

    // Delete evaluation status by academic year
    public void deleteEvaluationStatusByAcademicYear(int academicYearId) {
        evalStatusRepo.deleteByAcademicYear_Id(academicYearId);
    }
}
