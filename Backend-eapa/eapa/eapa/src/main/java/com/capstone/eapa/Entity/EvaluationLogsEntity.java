package com.capstone.eapa.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "tblevaluationlogs")
public class EvaluationLogsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    private String evalType;

    private String stage;
    private String period;
    private String dateTaken;
    private String schoolYear;
    private String semester;

    public EvaluationLogsEntity() {
    }

    public EvaluationLogsEntity(UserEntity user, String evalType, String stage, String period, String dateTaken, String schoolYear, String semester) {
        this.user = user;
        this.evalType = evalType;
        this.stage = stage;
        this.period = period;
        this.dateTaken = dateTaken;
        this.schoolYear = schoolYear;
        this.semester = semester;
    }

    public int getId() {
        return id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public String getEvalType() {
        return evalType;
    }

    public void setEvalType(String evalType) {
        this.evalType = evalType;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public String getDateTaken() {
        return dateTaken;
    }

    public void setDateTaken(String dateTaken) {
        this.dateTaken = dateTaken;
    }

    public String getSchoolYear() {
        return schoolYear;
    }

    public void setSchoolYear(String schoolYear) {
        this.schoolYear = schoolYear;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }
}
