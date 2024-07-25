package com.capstone.eapa.DTO;

public class EvaluatorAssignmentDTO {
    private int id;
    private String dateAssigned;
    private String period;
    private int evaluateeId;
    private int evaluatorId;
    private String status;

    public EvaluatorAssignmentDTO(int id, String dateAssigned, String period, int evaluateeId, int evaluatorId, String status) {
        this.id = id;
        this.dateAssigned = dateAssigned;
        this.period = period;
        this.evaluateeId = evaluateeId;
        this.evaluatorId = evaluatorId;
        this.status = status;
    }

    // Getters and Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDateAssigned() {
        return dateAssigned;
    }

    public void setDateAssigned(String dateAssigned) {
        this.dateAssigned = dateAssigned;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public int getEvaluateeId() {
        return evaluateeId;
    }

    public void setEvaluateeId(int evaluateeId) {
        this.evaluateeId = evaluateeId;
    }

    public int getEvaluatorId() {
        return evaluatorId;
    }

    public void setEvaluatorId(int evaluatorId) {
        this.evaluatorId = evaluatorId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
