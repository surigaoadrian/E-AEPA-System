package com.capstone.eapa.Controller;

import com.capstone.eapa.Entity.SchoolYearEntity;
import com.capstone.eapa.Entity.SemesterEntity;
import com.capstone.eapa.Service.SchoolYearService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schoolYear")
@CrossOrigin(origins = "*")
public class SchoolYearController {
    @Autowired
    SchoolYearService syServ;

    @GetMapping("/current")
    public SchoolYearEntity getCurrentSchoolYear() {
        return syServ.getCurrentSchoolYear();
    }

    //get current school year only
    @GetMapping("/currentyear")
    public String getCurrentSchoolYearOnly() {
        return syServ.getCurrentSchoolYearOnly();
    }

    //return the semester based on the current month
    @GetMapping("/semester/{month}")
    public String getSemesterForMonth(@PathVariable String month) {
        return syServ.getSemesterForMonth(month);
    }

    //update months of a semester
    @PostMapping("/semester/{id}")
    public SemesterEntity updateSemesterMonths(@PathVariable int id, @RequestBody List<String> newMonths) {
        return syServ.updateSemesterMonths(id, newMonths);
    }
}
