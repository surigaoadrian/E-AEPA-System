package com.capstone.eapa.DTO;

public class EvalStatusTrackerDTO {
    private int id;
    private boolean isCompleted;
    private String completedAt;
    private boolean isSentResult;



    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    public String getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(String completedAt) {
        this.completedAt = completedAt;
    }

    public boolean isSentResult() {
        return isSentResult;
    }

    public void setSentResult(boolean sentResult) {
        isSentResult = sentResult;
    }
}
