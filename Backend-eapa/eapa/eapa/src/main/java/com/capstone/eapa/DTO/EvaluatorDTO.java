package com.capstone.eapa.DTO;

public class EvaluatorDTO {
    private int userID;
    private String status;

    public EvaluatorDTO() {
        super();
    }

    public EvaluatorDTO(int userID, String status) {
        this.userID = userID;
        this.status = status;
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
