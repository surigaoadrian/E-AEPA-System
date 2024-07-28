package com.capstone.eapa.DTO;

public class PeerEvaluationDTO {
    private int assignedPeersId;
    private String mergedStatus;
    private int evaluateeId;

    

    public int getAssignedPeersId() {
        return assignedPeersId;
    }

    public void setAssignedPeersId(int assignedPeersId) {
        this.assignedPeersId = assignedPeersId;
    }

    public String getMergedStatus() {
        return mergedStatus;
    }

    public void setMergedStatus(String mergedStatus) {
        this.mergedStatus = mergedStatus;
    }

    public int getEvaluateeId() {
        return evaluateeId;
    }

    public void setEvaluateeId(int evaluateeId) {
        this.evaluateeId = evaluateeId;
    }
}

