package com.capstone.eapa.DTO;

import java.util.List;

public class AssignedPeersDTO {
    private int id;
    private UserDTO evaluatee;
    private List<EvaluatorDTO> evaluators;
    private String period;
    private String dateAssigned;

    public AssignedPeersDTO() {
    }

    public AssignedPeersDTO(int id, UserDTO evaluatee, List<EvaluatorDTO> evaluators, String period, String dateAssigned) {
        this.id = id;
        this.evaluatee = evaluatee;
        this.evaluators = evaluators;
        this.period = period;
        this.dateAssigned = dateAssigned;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public UserDTO getEvaluatee() {
        return evaluatee;
    }

    public void setEvaluatee(UserDTO evaluatee) {
        this.evaluatee = evaluatee;
    }

    public List<EvaluatorDTO> getEvaluators() {
        return evaluators;
    }

    public void setEvaluators(List<EvaluatorDTO> evaluators) {
        this.evaluators = evaluators;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public String getDateAssigned() {
        return dateAssigned;
    }

    public void setDateAssigned(String dateAssigned) {
        this.dateAssigned = dateAssigned;
    }
}
