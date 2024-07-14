package com.capstone.eapa.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tblassignedpeers")
public class AssignedPeersEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "evaluatee_id", nullable = false)
    private UserEntity evaluatee;

    @ManyToMany
    @JoinTable(
            name = "assigned_peers_evaluators",
            joinColumns = @JoinColumn(name = "assigned_peers_id"),
            inverseJoinColumns = @JoinColumn(name = "evaluator_id")
    )
    private List<UserEntity> peers;
    private String period; //3rd Month, 5th Month, Annual
    private LocalDate dateAssigned; //YYYY-MM-DD

    public AssignedPeersEntity() {
        super();
    }

    public AssignedPeersEntity(UserEntity evaluatee, List<UserEntity> peers, String period, LocalDate dateAssigned) {
        this.evaluatee = evaluatee;
        this.peers = peers;
        this.period = period;
        this.dateAssigned = dateAssigned;
    }

    public int getId() {
        return id;
    }

    public UserEntity getEvaluatee() {
        return evaluatee;
    }

    public void setEvaluatee(UserEntity evaluatee) {
        this.evaluatee = evaluatee;
    }

    public List<UserEntity> getPeers() {
        return peers;
    }

    public void setPeers(List<UserEntity> peers) {
        this.peers = peers;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public LocalDate getDateAssigned() {
        return dateAssigned;
    }

    public void setDateAssigned(LocalDate dateAssigned) {
        this.dateAssigned = dateAssigned;
    }
}
