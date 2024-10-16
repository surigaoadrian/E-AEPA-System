package com.capstone.eapa.Service;

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

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class AcademicYearService {
    @Autowired
    private AcademicYearRepository acadYearRepo;
    @Autowired
    private SemesterRepository semRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private EvalStatusTrackerRepository evalStatusRepo;

    //create Academic Year
//    public AcademicYearEntity createAcademicYear(LocalDate academicYearStartDate, LocalDate academicYearEndDate,
//                                           LocalDate firstSemesterStartDate, LocalDate firstSemesterEndDate,
//                                           LocalDate secondSemesterStartDate, LocalDate secondSemesterEndDate) {
//
//        AcademicYearEntity academicYear = new AcademicYearEntity(academicYearStartDate, academicYearEndDate);
//
//        SemesterEntity firstSemester = new SemesterEntity("First Semester", firstSemesterStartDate, firstSemesterEndDate, academicYear);
//        SemesterEntity secondSemester = new SemesterEntity("Second Semester", secondSemesterStartDate, secondSemesterEndDate, academicYear);
//
//        academicYear.setSemesters(Arrays.asList(firstSemester, secondSemester));
//
//        acadYearRepo.save(academicYear);
//        semRepo.saveAll(Arrays.asList(firstSemester, secondSemester));
//
//        return academicYear;
//    }
    // Create Academic Year and associated evaluation tracker entries
    public AcademicYearEntity createAcademicYear(LocalDate academicYearStartDate, LocalDate academicYearEndDate,
                                                 LocalDate firstSemesterStartDate, LocalDate firstSemesterEndDate,
                                                 LocalDate secondSemesterStartDate, LocalDate secondSemesterEndDate) {

        // Step 1: Create Academic Year and Semesters
        AcademicYearEntity academicYear = new AcademicYearEntity(academicYearStartDate, academicYearEndDate);
        SemesterEntity firstSemester = new SemesterEntity("First Semester", firstSemesterStartDate, firstSemesterEndDate, academicYear);
        SemesterEntity secondSemester = new SemesterEntity("Second Semester", secondSemesterStartDate, secondSemesterEndDate, academicYear);
        academicYear.setSemesters(Arrays.asList(firstSemester, secondSemester));

        acadYearRepo.save(academicYear);
        semRepo.saveAll(Arrays.asList(firstSemester, secondSemester));

        // Step 2: Create EvaluationStatusTracker entries for all users
        List<UserEntity> allUsers = userRepo.findAll();  // Assuming userRepo can fetch all users.
        for (UserEntity user : allUsers) {
            // Create one tracker for the first semester
            EvalStatusTrackerEntity firstSemEvalStatus = new EvalStatusTrackerEntity(
                    user, academicYear, firstSemester, false, null
            );
            evalStatusRepo.save(firstSemEvalStatus);

            // Create another tracker for the second semester
            EvalStatusTrackerEntity secondSemEvalStatus = new EvalStatusTrackerEntity(
                    user, academicYear, secondSemester, false, null
            );
            evalStatusRepo.save(secondSemEvalStatus);
        }

        return academicYear;
    }



    //edit Academic Year
    public AcademicYearEntity editAcademicYear(int academicYearId, LocalDate newStartDate, LocalDate newEndDate) {
        Optional<AcademicYearEntity> optionalAcademicYear = acadYearRepo.findById(academicYearId);
        if (optionalAcademicYear.isPresent()) {
            AcademicYearEntity academicYear = optionalAcademicYear.get();
            academicYear.setStartDate(newStartDate);
            academicYear.setEndDate(newEndDate);
            return acadYearRepo.save(academicYear);
        } else {
            throw new EntityNotFoundException("Academic Year not found");
        }
    }

    //edit semester
    public SemesterEntity editSemester(int semesterId, LocalDate newStartDate, LocalDate newEndDate) {
        Optional<SemesterEntity> optionalSemester = semRepo.findById(semesterId);
        if (optionalSemester.isPresent()) {
            SemesterEntity semester = optionalSemester.get();
            semester.setStartDate(newStartDate);
            semester.setEndDate(newEndDate);
            return semRepo.save(semester);
        } else {
            throw new EntityNotFoundException("Semester not found");
        }
    }

    //delete Academic Year
//    public void deleteAcademicYear(int academicYearId) {
//        acadYearRepo.deleteById(academicYearId);
//    }
    // Delete Academic Year and associated evaluation tracker entries
    public void deleteAcademicYear(int academicYearId) {
        Optional<AcademicYearEntity> academicYearOpt = acadYearRepo.findById(academicYearId);
        if (academicYearOpt.isPresent()) {
            AcademicYearEntity academicYear = academicYearOpt.get();

            // Delete associated EvaluationStatusTracker entries
            evalStatusRepo.deleteByAcademicYear_Id(academicYearId);

            // Delete academic year and its semesters
            acadYearRepo.deleteById(academicYearId);
        } else {
            throw new EntityNotFoundException("Academic Year not found");
        }
    }


    //get current acad year
//    public String getCurrentAcademicYear() {
//        LocalDate today = LocalDate.now();
//        Optional<AcademicYearEntity> currentYear = acadYearRepo.findAcademicYearByDate(today);
//        return currentYear.map(year -> year.getStartDate().getYear() + "-" + year.getEndDate().getYear())
//                .orElse("No current academic year found");
//    }
    public String getCurrentAcademicYear() {
        Optional<AcademicYearEntity> activeAcademicYear = acadYearRepo.findActiveAcademicYear();
        return activeAcademicYear
                .map(year -> year.getStartDate().getYear() + "-" + year.getEndDate().getYear())
                .orElse("No active school year found");
    }

    //get current semester
//    public String getCurrentSemester() {
//        LocalDate today = LocalDate.now();
//        Optional<SemesterEntity> currentSemester = semRepo.findByDateWithinSemester(today);
//        return currentSemester.map(SemesterEntity::getName)
//                .orElse("No current semester found");
//    }
    public String getCurrentSemester() {
        Optional<AcademicYearEntity> activeAcademicYear = acadYearRepo.findActiveAcademicYear();

        if (activeAcademicYear.isPresent()) {
            LocalDate today = LocalDate.now();
            for (SemesterEntity semester : activeAcademicYear.get().getSemesters()) {
                if (!today.isBefore(semester.getStartDate()) && !today.isAfter(semester.getEndDate())) {
                    return semester.getName();
                }
            }
        }
        return "No active semester found";
    }


    //get all years
    public List<AcademicYearEntity> getAllAcademicYears(){
        return acadYearRepo.findAll();
    }

    // Get the current academic year with semesters included
//    public Optional<AcademicYearEntity> getCurrentAcademicYearEntity() {
//        LocalDate today = LocalDate.now();
//        return acadYearRepo.findAcademicYearByDate(today);
//    }
    public Optional<AcademicYearEntity> getCurrentAcademicYearEntity() {
        return acadYearRepo.findActiveAcademicYear();
    }

    // Manually activate an academic year
    @Transactional
    public void setActiveAcademicYear(int academicYearId) {
        // Deactivate all current active academic years
        acadYearRepo.deactivateAllAcademicYears();

        // Set the specific academic year as active
        Optional<AcademicYearEntity> academicYear = acadYearRepo.findById(academicYearId);
        if (academicYear.isPresent()) {
            AcademicYearEntity yearToActivate = academicYear.get();
            yearToActivate.setIsActive(true);
            acadYearRepo.save(yearToActivate);
        } else {
            throw new EntityNotFoundException("Academic year not found");
        }
    }

    // Method to deactivate a specific academic year
    @Transactional
    public void setInactiveAcademicYear(int academicYearId) {
        Optional<AcademicYearEntity> academicYear = acadYearRepo.findById(academicYearId);
        if (academicYear.isPresent()) {
            AcademicYearEntity yearToDeactivate = academicYear.get();
            yearToDeactivate.setIsActive(false);  // Set isActive to false
            acadYearRepo.save(yearToDeactivate);  // Save the updated entity
        } else {
            throw new EntityNotFoundException("Academic year not found");
        }
    }
}
