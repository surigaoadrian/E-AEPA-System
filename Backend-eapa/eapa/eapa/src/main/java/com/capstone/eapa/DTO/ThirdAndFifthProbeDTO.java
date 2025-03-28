package com.capstone.eapa.DTO;

public class ThirdAndFifthProbeDTO {
    private int userID;
    private String fName;
    private String lName;
    private String dept;
    private String position;
    private String dateHired;

    public ThirdAndFifthProbeDTO(int userID, String fName, String lName, String dept, String position, String dateHired) {
        this.userID = userID;
        this.fName = fName;
        this.lName = lName;
        this.dept = dept;
        this.position = position;
        this.dateHired = dateHired;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
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

    public String getDept() {
        return dept;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getDateHired() {
        return dateHired;
    }

    public void setDateHired(String dateHired) {
        this.dateHired = dateHired;
    }
}
