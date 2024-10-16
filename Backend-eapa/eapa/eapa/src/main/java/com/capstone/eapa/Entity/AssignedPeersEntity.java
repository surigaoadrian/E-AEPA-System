package com.capstone.eapa.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tblassignedpeers")
public class AssignedPeersEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluatee_id", nullable = false)
    private UserEntity evaluatee;

    @OneToMany(mappedBy = "assignedPeers", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<AssignedPeerEvaluators> evaluators;

    private String period; //3rd Month, 5th Month, Annual
    private String dateAssigned; //YYYY-MM-DD
    private String schoolYear;
    private String semester;

    public AssignedPeersEntity() {
        super();
    }

//    public AssignedPeersEntity(UserEntity evaluatee, String period, String dateAssigned, List<AssignedPeerEvaluators> evaluators) {
//        this.evaluatee = evaluatee;
//        this.period = period;
//        this.dateAssigned = dateAssigned;
//        this.evaluators = evaluators;
//    }


    public AssignedPeersEntity(UserEntity evaluatee,  String period, String dateAssigned, String schoolYear, String semester) {
        this.evaluatee = evaluatee;
        this.period = period;
        this.dateAssigned = dateAssigned;
        this.schoolYear = schoolYear;
        this.semester = semester;
    }

    public int getId() {
        return id;
    }

    public UserEntity getEvaluatee() {
        return evaluatee;
    }

    public void setEvaluatee(UserEntity evaluatee) {
        this.evaluatee = evaluatee;
    }

    public List<AssignedPeerEvaluators> getEvaluators() {
        return evaluators;
    }

    public void setEvaluators(List<AssignedPeerEvaluators> evaluators) {
        this.evaluators = evaluators;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public String getDateAssigned() {
        return dateAssigned;
    }

    public void setDateAssigned(String dateAssigned) {
        this.dateAssigned = dateAssigned;
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
