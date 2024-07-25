package com.capstone.eapa.DTO;

public class EvaluationStatusDTO {
    private long completed;
    private long notCompleted;

    public EvaluationStatusDTO(long completed, long notCompleted) {
        this.completed = completed;
        this.notCompleted = notCompleted;
    }

    public long getCompleted() {
        return completed;
    }

    public void setCompleted(long completed) {
        this.completed = completed;
    }

    public long getNotCompleted() {
        return notCompleted;
    }

    public void setNotCompleted(long notCompleted) {
        this.notCompleted = notCompleted;
    }
}
