package com.capstone.eapa.DTO;

public class UserDTO {
    private int userID;
    private String workID;
    private String fName;
    private String lName;
    private String workEmail;
    private String username;
    private String position;
    private String dept;

    public UserDTO() {
        super();
    }

    public UserDTO(int userID, String workID, String fName, String lName, String workEmail, String username, String position, String dept) {
        this.userID = userID;
        this.workID = workID;
        this.fName = fName;
        this.lName = lName;
        this.workEmail = workEmail;
        this.username = username;
        this.position = position;
        this.dept = dept;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public String getWorkID() {
        return workID;
    }

    public void setWorkID(String workID) {
        this.workID = workID;
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

    public String getWorkEmail() {
        return workEmail;
    }

    public void setWorkEmail(String workEmail) {
        this.workEmail = workEmail;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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
}
