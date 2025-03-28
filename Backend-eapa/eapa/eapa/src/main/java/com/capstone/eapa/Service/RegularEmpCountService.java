package com.capstone.eapa.Service;

import com.capstone.eapa.Entity.RegularEmpCountEntity;
import com.capstone.eapa.Repository.RegularEmpCountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@Service
public class RegularEmpCountService {

    @Autowired
    private RegularEmpCountRepository regEmpCountRepo;

    @Autowired
    private UserService userServ;

    @EventListener(ApplicationReadyEvent.class)
    public void checkAndCreateOrUpdateCurrentMonthRecord() {
        createMonthRegularEmpCount();
    }

    //create
    //@Scheduled(cron = "0 * * * * *") // runs every minute
    @Scheduled(cron = "0 0 1 1 * *") // Runs at the start of each month
    public void createMonthRegularEmpCount() {
        LocalDate currentDate = LocalDate.now();
        String month = currentDate.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
        int year = currentDate.getYear();

        int currentRegEmpCount = userServ.getRegularEmpCount();

        Optional<RegularEmpCountEntity> existingRecord = regEmpCountRepo.findByMonthAndYear(month, year);

        if (!existingRecord.isPresent()) {
            RegularEmpCountEntity newRecord = new RegularEmpCountEntity(month, year, currentRegEmpCount);
            regEmpCountRepo.save(newRecord);
        } else {
            RegularEmpCountEntity record = existingRecord.get();
            record.setRegularEmpCount(currentRegEmpCount);
            regEmpCountRepo.save(record);
        }
    }

    // Update manually
    public void updateRegEmpCount(String month, int year, int currentRegEmpCount) {
        Optional<RegularEmpCountEntity> existingRecord = regEmpCountRepo.findByMonthAndYear(month, year);
        if (existingRecord.isPresent()) {
            RegularEmpCountEntity record = existingRecord.get();
            record.setRegularEmpCount(currentRegEmpCount);
            regEmpCountRepo.save(record);
        }
    }

    // Get regular employee count for a specific month and year
    public int getRegularEmpCountByMonthAndYear(String month, int year) {
        Optional<RegularEmpCountEntity> result = regEmpCountRepo.findByMonthAndYear(month, year);
        return result.map(RegularEmpCountEntity::getRegularEmpCount).orElse(0); // Return count or 0 if not found
    }


    public List<RegularEmpCountEntity> getRegularEmpCountsByYear(int year) {
        return regEmpCountRepo.findByYear(year);
    }
}
