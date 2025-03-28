package com.capstone.eapa.DTO;

public class AsssignedEvaluatorStatusDTO {
    private int evaluatorId;
    private String status;

    public AsssignedEvaluatorStatusDTO(int evaluatorId, String status) {
        this.evaluatorId = evaluatorId;
        this.status = status;
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
