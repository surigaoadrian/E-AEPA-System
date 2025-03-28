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
import org.springframework.transaction.annotation.Transactional;

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
//    public void createEvalStatusTrackerForUser(int academicYearId, int firstSemesterId, int secondSemesterId, int userId) {
//        // Fetch the necessary entities
//        UserEntity user = userRepo.findById(userId)
//                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
//        AcademicYearEntity academicYear = acadYearRepo.findById(academicYearId)
//                .orElseThrow(() -> new EntityNotFoundException("Academic year not found with id: " + academicYearId));
//        SemesterEntity firstSemester = semRepo.findById(firstSemesterId)
//                .orElseThrow(() -> new EntityNotFoundException("First semester not found with id: " + firstSemesterId));
//        SemesterEntity secondSemester = semRepo.findById(secondSemesterId)
//                .orElseThrow(() -> new EntityNotFoundException("Second semester not found with id: " + secondSemesterId));
//
//        // Create an entry for the first semester
//        EvalStatusTrackerEntity firstSemEvalStatus = new EvalStatusTrackerEntity(
//                user, academicYear, firstSemester, false, null, false
//        );
//        evalStatusRepo.save(firstSemEvalStatus);
//
//        // Create an entry for the second semester
//        EvalStatusTrackerEntity secondSemEvalStatus = new EvalStatusTrackerEntity(
//                user, academicYear, secondSemester, false, null, false
//        );
//        evalStatusRepo.save(secondSemEvalStatus);
//    }
    //updated code that has duplicate checker
    public String createEvalStatusTrackerForUser(int academicYearId, int firstSemesterId, int secondSemesterId, int userId) {
        // Fetch the necessary entities
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        AcademicYearEntity academicYear = acadYearRepo.findById(academicYearId)
                .orElseThrow(() -> new EntityNotFoundException("Academic year not found with id: " + academicYearId));
        SemesterEntity firstSemester = semRepo.findById(firstSemesterId)
                .orElseThrow(() -> new EntityNotFoundException("First semester not found with id: " + firstSemesterId));
        SemesterEntity secondSemester = semRepo.findById(secondSemesterId)
                .orElseThrow(() -> new EntityNotFoundException("Second semester not found with id: " + secondSemesterId));

        // Check if entries already exist for the first and second semesters in the given academic year
        boolean firstSemesterExists = evalStatusRepo.existsByUserAndSemesterAndAcademicYear(user, firstSemester, academicYear);
        boolean secondSemesterExists = evalStatusRepo.existsByUserAndSemesterAndAcademicYear(user, secondSemester, academicYear);

        if (firstSemesterExists && secondSemesterExists) {
            return "Existing entries in the database for the given academic year.";
        }

        // Create an entry for the first semester if it doesn't exist
        if (!firstSemesterExists) {
            EvalStatusTrackerEntity firstSemEvalStatus = new EvalStatusTrackerEntity(
                    user, academicYear, firstSemester, false, null, false
            );
            evalStatusRepo.save(firstSemEvalStatus);
        }

        // Create an entry for the second semester if it doesn't exist
        if (!secondSemesterExists) {
            EvalStatusTrackerEntity secondSemEvalStatus = new EvalStatusTrackerEntity(
                    user, academicYear, secondSemester, false, null, false
            );
            evalStatusRepo.save(secondSemEvalStatus);
        }

        return "Entries created successfully.";
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
                    dto.setSentResult(entity.isSentResult());
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

    //update evaluation status isSentResult
    public EvalStatusTrackerDTO updateEvalStatusSentResult(int trackerId, boolean isSentResult){
        EvalStatusTrackerEntity tracker = evalStatusRepo.findById(trackerId).orElseThrow(() -> new RuntimeException("Evaluation status not found"));

        tracker.setSentResult(isSentResult);
        EvalStatusTrackerEntity updatedTracker = evalStatusRepo.save(tracker);

        // Map to DTO
        EvalStatusTrackerDTO dto = new EvalStatusTrackerDTO();
        dto.setId(updatedTracker.getId());
        dto.setSentResult(updatedTracker.isSentResult());

        return dto;
    }

    // Delete evaluation status by academic year
    public void deleteEvaluationStatusByAcademicYear(int academicYearId) {
        evalStatusRepo.deleteByAcademicYear_Id(academicYearId);
    }

    public void removeDuplicateEntries() {
        try {
            List<Object[]> duplicates = evalStatusRepo.findDuplicates();

            if (duplicates.isEmpty()) {
                System.out.println("No duplicates found.");
                return;
            }

            System.out.println("Duplicates found:");
            for (Object[] duplicate : duplicates) {
                // Extract values safely
                Integer userId = duplicate[0] != null ? Integer.parseInt(duplicate[0].toString()) : null;
                Integer academicYearId = duplicate[1] != null ? Integer.parseInt(duplicate[1].toString()) : null;
                Integer semesterId = duplicate[2] != null ? Integer.parseInt(duplicate[2].toString()) : null;
                Long count = duplicate[3] != null ? Long.parseLong(duplicate[3].toString()) : null;

                // Log the values
                System.out.println("User ID: " + userId +
                        ", Academic Year ID: " + academicYearId +
                        ", Semester ID: " + semesterId +
                        ", Count: " + count);

                // Ensure no null values are processed
                if (userId == null || academicYearId == null || semesterId == null || count == null) {
                    System.out.println("Skipping entry due to null values.");
                    continue;
                }

                // Remove duplicates
                List<EvalStatusTrackerEntity> duplicateEntries = evalStatusRepo.findByUserAndAcademicYearAndSemester(userId, academicYearId, semesterId);
                if (duplicateEntries.size() > 1) {
                    duplicateEntries.remove(0); // Keep the first one
                    evalStatusRepo.deleteAll(duplicateEntries);
                    System.out.println("Removed " + (duplicateEntries.size()) + " duplicate entries for User ID: " + userId);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error while processing duplicates", e);
        }
    }
}
