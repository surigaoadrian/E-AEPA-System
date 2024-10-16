package com.capstone.eapa.Controller;

import com.capstone.eapa.Entity.AcademicYearEntity;
import com.capstone.eapa.Entity.SemesterEntity;
import com.capstone.eapa.Service.AcademicYearService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/academicYear")
@CrossOrigin(origins = "*")
public class AcademicYearController {
    @Autowired
    private AcademicYearService acadYearServ;

    @PostMapping("/create-year")
    public AcademicYearEntity createAcademicYear(@RequestParam("academicYearStartDate") String academicYearStartDate,
                                                 @RequestParam("academicYearEndDate") String academicYearEndDate,
                                                 @RequestParam("firstSemesterStartDate") String firstSemesterStartDate,
                                                 @RequestParam("firstSemesterEndDate") String firstSemesterEndDate,
                                                 @RequestParam("secondSemesterStartDate") String secondSemesterStartDate,
                                                 @RequestParam("secondSemesterEndDate") String secondSemesterEndDate) {

        LocalDate academicStart = LocalDate.parse(academicYearStartDate);
        LocalDate academicEnd = LocalDate.parse(academicYearEndDate);
        LocalDate firstSemesterStart = LocalDate.parse(firstSemesterStartDate);
        LocalDate firstSemesterEnd = LocalDate.parse(firstSemesterEndDate);
        LocalDate secondSemesterStart = LocalDate.parse(secondSemesterStartDate);
        LocalDate secondSemesterEnd = LocalDate.parse(secondSemesterEndDate);

        return acadYearServ.createAcademicYear(academicStart, academicEnd, firstSemesterStart, firstSemesterEnd, secondSemesterStart, secondSemesterEnd);
    }


    @GetMapping("/current-year")
    public String getCurrentAcademicYear() {
        return acadYearServ.getCurrentAcademicYear();
    }

    @GetMapping("/current-semester")
    public String getCurrentSemester() {
        return acadYearServ.getCurrentSemester();
    }

    @DeleteMapping("/delete-year/{id}")
    public void deleteAcademicYear(@PathVariable int id) {
        acadYearServ.deleteAcademicYear(id);
    }

    @PutMapping("/edit-year/{id}")
    public AcademicYearEntity editAcademicYear(@PathVariable int id,
                                         @RequestParam("startDate") String startDate,
                                         @RequestParam("endDate") String endDate) {
        LocalDate newStartDate = LocalDate.parse(startDate);
        LocalDate newEndDate = LocalDate.parse(endDate);
        return acadYearServ.editAcademicYear(id, newStartDate, newEndDate);
    }

    @PutMapping("/edit-semester/{id}")
    public SemesterEntity editSemester(@PathVariable int id,
                                       @RequestParam("startDate") String startDate,
                                       @RequestParam("endDate") String endDate) {
        LocalDate newStartDate = LocalDate.parse(startDate);
        LocalDate newEndDate = LocalDate.parse(endDate);
        return acadYearServ.editSemester(id, newStartDate, newEndDate);
    }

    @GetMapping("/all-years")
    public List<AcademicYearEntity> getAllAcademicYears(){
        return acadYearServ.getAllAcademicYears();
    }

    // New method to get the current academic year with semesters
    @GetMapping("/current-year-full")
    public ResponseEntity<AcademicYearEntity> getCurrentAcademicYearEntity() {
        Optional<AcademicYearEntity> currentAcademicYear = acadYearServ.getCurrentAcademicYearEntity();

        if (currentAcademicYear.isPresent()) {
            return new ResponseEntity<>(currentAcademicYear.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Return 404 if no current academic year is found
        }
    }

    // New endpoint to manually set an academic year as active
    @PutMapping("/set-active/{id}")
    public ResponseEntity<?> setActiveAcademicYear(@PathVariable int id) {
        acadYearServ.setActiveAcademicYear(id);
        return ResponseEntity.ok("Academic year " + id + " is now active.");
    }

    // New endpoint to manually set an academic year as inactive
    @PutMapping("/set-inactive/{id}")
    public ResponseEntity<?> setInactiveAcademicYear(@PathVariable int id) {
        acadYearServ.setInactiveAcademicYear(id);
        return ResponseEntity.ok("Academic year " + id + " is now inactive.");
    }

}
