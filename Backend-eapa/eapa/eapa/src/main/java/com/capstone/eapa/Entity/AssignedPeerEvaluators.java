package com.capstone.eapa.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "assigned_evaluators")
public class AssignedPeerEvaluators {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_peers_id", nullable = false)
    private AssignedPeersEntity assignedPeers;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "evaluator_id", nullable = false)
    private UserEntity evaluator;

    @Column(name = "status")
    private String status;

    public AssignedPeerEvaluators() {
        super();
    }

    public AssignedPeerEvaluators(AssignedPeersEntity assignedPeers, UserEntity evaluator, String status) {
        this.assignedPeers = assignedPeers;
        this.evaluator = evaluator;
        this.status = status;
    }

    public int getId() {
        return id;
    }

    public AssignedPeersEntity getAssignedPeers() {
        return assignedPeers;
    }

    public void setAssignedPeers(AssignedPeersEntity assignedPeers) {
        this.assignedPeers = assignedPeers;
    }

    public UserEntity getEvaluator() {
        return evaluator;
    }

    public void setEvaluator(UserEntity evaluator) {
        this.evaluator = evaluator;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

}
