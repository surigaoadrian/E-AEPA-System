package com.capstone.eapa.Controller;

import com.capstone.eapa.Entity.RegularEmpCountEntity;

import com.capstone.eapa.Service.RegularEmpCountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/regEmpCount")
@CrossOrigin(origins = "*")
public class RegularEmpCountController {
    @Autowired
    RegularEmpCountService regEmpCountServ;

     @GetMapping("/count")
    public ResponseEntity<Integer> getRegularEmpCount(@RequestParam String month, @RequestParam int year) {
        int count = regEmpCountServ.getRegularEmpCountByMonthAndYear(month, year);
        return ResponseEntity.ok(count);
    }

    @PatchMapping("/update")
    public ResponseEntity<String> updateRegularEmpCount(
            @RequestParam String month, @RequestParam int year, @RequestParam int currentRegEmpCount) {
        regEmpCountServ.updateRegEmpCount(month, year, currentRegEmpCount);
        try {
            regEmpCountServ.updateRegEmpCount(month, year, currentRegEmpCount);
            return ResponseEntity.ok("Regular employee count updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating regular employee count: " + e.getMessage());
        }
    }

    // manually trigger the employee count creation
//    @PostMapping("/test/createRegularEmpCount")
//    public String createRegularEmpCount() {
//        regEmpCountServ.createMonthRegularEmpCount();
//        return "Regular employee count creation triggered.";
//    }

    @GetMapping("/getAllByYear")
    public ResponseEntity<List<RegularEmpCountEntity>> getRegularEmpCountsByYear(@RequestParam int year) {
        List<RegularEmpCountEntity> counts = regEmpCountServ.getRegularEmpCountsByYear(year);
        return ResponseEntity.ok(counts);
    }

}
