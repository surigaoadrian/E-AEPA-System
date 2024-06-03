package com.capstone.eapa.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tblresults")
public class ResultsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int resultsID;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "emp_id", nullable = true)
    private UserEntity emp;

    @Column(name = "cultAve")
    private double cultureOfExcellenceAverage;
    @Column(name = "intAve")
    private double integrityAverage;
    @Column(name = "teamAve")
    private double teamworkAverage;
    @Column(name = "univAve")
    private double universalityAverage;

    @Column(name = "jobAve")
    private double jobRespAverage;

    private String evalType; //SELF or PEER
    private String period; //3rd Month, 5th Month, Annual
    private String stage; //Values or Job


    private int isDeleted = 0;

    public ResultsEntity() {
        super();
    }

    public ResultsEntity(UserEntity user, UserEntity emp, double cultureOfExcellenceAverage, double integrityAverage, double teamworkAverage, double universalityAverage, double jobRespAverage, String evalType, String period, String stage, int isDeleted) {
        this.user = user;
        this.emp = emp;
        this.cultureOfExcellenceAverage = cultureOfExcellenceAverage;
        this.integrityAverage = integrityAverage;
        this.teamworkAverage = teamworkAverage;
        this.universalityAverage = universalityAverage;
        this.jobRespAverage = jobRespAverage;
        this.evalType = evalType;
        this.period = period;
        this.stage = stage;
        this.isDeleted = isDeleted;
    }


    public int getResultsID() {
        return resultsID;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public UserEntity getEmp() {
        return emp;
    }

    public void setEmp(UserEntity emp) {
        this.emp = emp;
    }

    public double getCultureOfExcellenceAverage() {
        return cultureOfExcellenceAverage;
    }

    public void setCultureOfExcellenceAverage(double cultureOfExcellenceAverage) {
        this.cultureOfExcellenceAverage = cultureOfExcellenceAverage;
    }

    public double getIntegrityAverage() {
        return integrityAverage;
    }

    public void setIntegrityAverage(double integrityAverage) {
        this.integrityAverage = integrityAverage;
    }

    public double getTeamworkAverage() {
        return teamworkAverage;
    }

    public void setTeamworkAverage(double teamworkAverage) {
        this.teamworkAverage = teamworkAverage;
    }

    public double getUniversalityAverage() {
        return universalityAverage;
    }

    public void setUniversalityAverage(double universalityAverage) {
        this.universalityAverage = universalityAverage;
    }

    public double getJobRespAverage() {
        return jobRespAverage;
    }

    public void setJobRespAverage(double jobRespAverage) {
        this.jobRespAverage = jobRespAverage;
    }

    public String getEvalType() {
        return evalType;
    }

    public void setEvalType(String evalType) {
        this.evalType = evalType;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public int getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(int isDeleted) {
        this.isDeleted = isDeleted;
    }



}
