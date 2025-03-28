package com.capstone.eapa.DTO;

import com.capstone.eapa.Entity.Role;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

import java.time.LocalDate;

public class EvaluationDTO {
    private int userId;
    @Enumerated(value = EnumType.STRING)
    private Role role;
    private String workID;
    private String dept;
    private String empStatus;
    private String fName;
    private String lName;
    private String sjbpStatus;
    private String svbpaStatus;
    private String pvbpaStatus;
    private String hjbpStatus;
    private String hvbpaStatus;
    private String dateHired;
    private Boolean isSentResult;
    private int semester;

    public Boolean getSentResult() {
        return isSentResult;
    }

    public void setSentResult(Boolean isSentResult) {
        this.isSentResult = isSentResult;
    }

    public int getSemester() {
        return semester;
    }

    public void setSemester(int semester) {
        this.semester = semester;
    }

    public String getSchoolYear() {
        return schoolYear;
    }

    public void setSchoolYear(String schoolYear) {
        this.schoolYear = schoolYear;
    }

    public LocalDate getSjbpDateTaken() {
        return sjbpDateTaken;
    }

    private String schoolYear;
    private LocalDate sjbpDateTaken;
    private String period; // New field for period
    private boolean is3rdEvalComplete= false;
    private boolean is5thEvalComplete= false;



    

    // Getters and Setters

    public boolean isIs3rdEvalComplete() {
        return is3rdEvalComplete;
    }

    public void setIs3rdEvalComplete(boolean is3rdEvalComplete) {
        this.is3rdEvalComplete = is3rdEvalComplete;
    }

    public boolean isIs5thEvalComplete() {
        return is5thEvalComplete;
    }

    public void setIs5thEvalComplete(boolean is5thEvalComplete) {
        this.is5thEvalComplete = is5thEvalComplete;
    }

    public String getDateHired() {
        return dateHired;
    }

    public String getHjbpStatus() {
        return hjbpStatus;
    }

    public void setHjbpStatus(String hjbpStatus) {
        this.hjbpStatus = hjbpStatus;
    }

    public String getHvbpaStatus() {
        return hvbpaStatus;
    }

    public void setHvbpaStatus(String hvbpaStatus) {
        this.hvbpaStatus = hvbpaStatus;
    }

    public void setDateHired(String dateHired) {
        this.dateHired = dateHired;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }
    

    public String getWorkID() {
        return workID;
    }

    public void setWorkID(String workID) {
        this.workID = workID;
    }

    public String getDept() {
        return dept;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }

    public String getEmpStatus() {
        return empStatus;
    }

    public void setEmpStatus(String empStatus) {
        this.empStatus = empStatus;
    }

    public String getfName() {
        return fName;
    }

    public void setfName(String fName) {
        this.fName = fName;
    }

    public String getlName() {
        return lName;
    }

    public void setlName(String lName) {
        this.lName = lName;
    }

    public String getSjbpStatus() {
        return sjbpStatus;
    }

    public void setSjbpStatus(String sjbpStatus) {
        this.sjbpStatus = sjbpStatus;
    }

    public String getSvbpaStatus() {
        return svbpaStatus;
    }

    public void setSvbpaStatus(String svbpaStatus) {
        this.svbpaStatus = svbpaStatus;
    }

    public String getPvbpaStatus() {
        return pvbpaStatus;
    }

    public void setPvbpaStatus(String pvbpaStatus) {
        this.pvbpaStatus = pvbpaStatus;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public void setSjbpDateTaken(LocalDate dateTaken) {
        this.sjbpDateTaken = dateTaken;
    }

    public LocalDate getSjbDateTaken() {
        return sjbpDateTaken;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }
}
