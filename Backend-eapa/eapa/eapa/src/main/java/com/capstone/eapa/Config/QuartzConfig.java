package com.capstone.eapa.Config;

import com.capstone.eapa.Entity.SemesterEntity;
import com.capstone.eapa.Repository.SemesterRepository;
import jakarta.annotation.PostConstruct;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Month;
import java.util.Arrays;
import java.util.List;

@Configuration
public class QuartzConfig {
    @Autowired
    private SemesterRepository semRepo;

    @Bean
    public JobDetail jobDetail() {
        return JobBuilder.newJob(SchoolYearJob.class)
                .withIdentity("schoolYearJob")
                .storeDurably()
                .build();
    }

    @Bean
    public Trigger trigger(JobDetail jobDetail) {
        List<SemesterEntity> semesters = semRepo.findAllByOrderById();
        if (semesters.isEmpty()) {
            throw new IllegalStateException("Semesters not configured");
        }

        String firstMonth = semesters.get(0).getMonths().get(0);
        Month startMonth = Month.valueOf(firstMonth.toUpperCase());

        // Cron expression to run at midnight on the first day of the first month of the school year
        String cronExpression = String.format("0 0 0 1 %d ?", startMonth.getValue());

        return TriggerBuilder.newTrigger()
                .forJob(jobDetail)
                .withIdentity("schoolYearTrigger")
                .withSchedule(CronScheduleBuilder.cronSchedule(cronExpression))
                .build();
    }

    @PostConstruct
    public void initializeSemesters() {
        if (semRepo.count() == 0) {
            // Add default semesters if none are configured
            SemesterEntity firstSemester = new SemesterEntity();
            firstSemester.setName("First Semester");
            firstSemester.setMonths(Arrays.asList("August", "September", "October", "November", "December"));

            SemesterEntity secondSemester = new SemesterEntity();
            secondSemester.setName("Second Semester");
            secondSemester.setMonths(Arrays.asList("January", "February", "March", "April", "May"));

            semRepo.save(firstSemester);
            semRepo.save(secondSemester);
        }
    }
}
