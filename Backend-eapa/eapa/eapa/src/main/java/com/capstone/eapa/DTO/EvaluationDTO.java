package com.capstone.eapa.DTO;

import com.capstone.eapa.Entity.Role;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;

public class EvaluationDTO {
    private int userId;
    @Enumerated(value = EnumType.STRING)
    private Role role;
    private String workID;
    private String position;
    private String dept;
    private String empStatus;
    private String fName;
    private String lName;
    private String sjbpStatus;
    private String svbpaStatus;
    private String pvbpaStatus;
    private String pavbpaStatus;
    

    // Getters and Setters

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
    
    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
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

    public String getPavbpaStatus() {
        return pavbpaStatus;
    }

    public void setPavbpaStatus(String pavbpaStatus) {
        this.pavbpaStatus = pavbpaStatus;
    }

}
