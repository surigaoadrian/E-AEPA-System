package com.capstone.eapa.DTO;

public class UpdateCommentRequest {
    private String comment;
    private Integer quesID;

    // Getters and Setters
    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getQuesID() {
        return quesID;
    }

    public void setQuesID(Integer quesID) {
        this.quesID = quesID;
    }
}
