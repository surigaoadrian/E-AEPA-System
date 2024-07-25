package com.capstone.eapa.Service;

import com.capstone.eapa.Entity.SchoolYearEntity;
import com.capstone.eapa.Entity.SemesterEntity;
import com.capstone.eapa.Repository.SchoolYearRepository;
import com.capstone.eapa.Repository.SemesterRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class SchoolYearService {

    @Autowired
    private SchoolYearRepository syRepo;

    @Autowired
    private SemesterRepository semRepo;

    @Transactional
    public SchoolYearEntity getCurrentSchoolYear() {
        return createOrGetSchoolYear();
    }

    @Transactional
    public synchronized void checkAndCreateSchoolYear() {
        createOrGetSchoolYear();
    }

    //returns only the school year
    @Transactional
    public String getCurrentSchoolYearOnly() {
        SchoolYearEntity schoolYear = createOrGetSchoolYear();
        return schoolYear.getYear();
    }

    //returns the semester based on the passed month
    @Transactional
    public String getSemesterForMonth(String month) {
        List<SemesterEntity> semesters = semRepo.findAllByOrderById();
        if (semesters.isEmpty()) {
            throw new IllegalStateException("Semesters not configured");
        }

        for (SemesterEntity semester : semesters) {
            if (semester.getMonths().contains(month)) {
                return semester.getName();
            }
        }

        return "No semester found for the given month.";
    }

    @Transactional
    public SemesterEntity updateSemesterMonths(int semesterId, List<String> newMonths) {
        Optional<SemesterEntity> optionalSemester = semRepo.findById(semesterId);
        if (!optionalSemester.isPresent()) {
            throw new IllegalArgumentException("Semester not found");
        }

        SemesterEntity semester = optionalSemester.get();
        semester.setMonths(newMonths);
        semRepo.save(semester);

        // Ensure the first month of the first semester is the first month of the school year
        List<SemesterEntity> semesters = semRepo.findAllByOrderById();
        if (!semesters.isEmpty() && semesters.get(0).getId() == semesterId) {
            SchoolYearEntity latestSchoolYear = syRepo.findTopByOrderByIdDesc();
            if (latestSchoolYear != null) {
                String newFirstMonth = newMonths.get(0);
                Month startMonth = Month.valueOf(newFirstMonth.toUpperCase());
                LocalDate currentDate = LocalDate.now();
                int currentMonth = currentDate.getMonthValue();
                int currentYear = currentDate.getYear();

                int startYear;
                if (currentMonth >= startMonth.getValue()) {
                    startYear = currentYear;
                } else {
                    startYear = currentYear - 1;
                }
                int endYear = startYear + 1;

                String schoolYear = startYear + "-" + endYear;
                latestSchoolYear.setYear(schoolYear);
                syRepo.save(latestSchoolYear);
            }
        }

        return semester;
    }

    private SchoolYearEntity createOrGetSchoolYear() {
        SchoolYearEntity latestSchoolYear = syRepo.findTopByOrderByIdDesc();

        List<SemesterEntity> semesters = semRepo.findAllByOrderById();
        if (semesters.isEmpty()) {
            throw new IllegalStateException("Semesters not configured");
        }

        String firstMonth = semesters.get(0).getMonths().get(0);
        Month startMonth = Month.valueOf(firstMonth.toUpperCase());
        LocalDate currentDate = LocalDate.now();
        int currentMonth = currentDate.getMonthValue();
        int currentYear = currentDate.getYear();

        int startYear;
        if (currentMonth >= startMonth.getValue()) {
            startYear = currentYear;
        } else {
            startYear = currentYear - 1;
        }
        int endYear = startYear + 1;

        String schoolYear = startYear + "-" + endYear;

        if (latestSchoolYear != null && latestSchoolYear.getYear().equals(schoolYear)) {
            return latestSchoolYear;
        }

        SchoolYearEntity schoolYearEntity = new SchoolYearEntity();
        schoolYearEntity.setYear(schoolYear);
        schoolYearEntity.setSemesters(semesters);

        return syRepo.save(schoolYearEntity);
    }
}
