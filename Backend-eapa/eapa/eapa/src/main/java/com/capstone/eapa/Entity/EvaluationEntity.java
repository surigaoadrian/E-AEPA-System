
package com.capstone.eapa.Entity;

import jakarta.persistence.*;
import org.apache.catalina.User;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "tblevaluation")
public class EvaluationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int evalID;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    @ManyToOne
    @JoinColumn(name = "peer_id", nullable = true)
    private UserEntity peer;
    private String evalType; //SELF, PEER, HEAD
    private String stage; //VALUES, JOB
    private String period; //3rd Month, 5th Month, Annual
    private String status; //OPEN, COMPLETED
    private LocalDate dateTaken; //YYYY-MM-DD
    private int isDeleted = 0;

    @OneToMany(mappedBy = "evaluation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResponseEntity> responses;

    public int getUserId() {
        return user.getUserID();
    }
    public String getWorkID() {
        return user.getWorkID();
    }

    public Role getRole() {
        return user.getRole();
    }
    public String getPosition() {
        return user.getPosition();
    }

    public String getfName() {
        return user.getfName();
    }

    public String getlName() {
        return user.getlName();
    }
    
    public String getEmpStatus() {
        return user.getEmpStatus();
    }

    public EvaluationEntity() {
        super();
    }

    public EvaluationEntity(UserEntity user, UserEntity peer, String evalType, String stage, String period, String status, LocalDate dateTaken, int isDeleted) {
        this.user = user;
        this.peer = peer;
        this.evalType = evalType;
        this.stage = stage;
        this.period = period;
        this.status = status;
        this.dateTaken = dateTaken;
        this.isDeleted = isDeleted;
    }

    public int getEvalID() {
        return evalID;
    }


    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public UserEntity getPeer() {
        return peer;
    }

    public void setPeer(UserEntity peer) {
        this.peer = peer;
    }

    public String getEvalType() {
        return evalType;
    }

    public void setEvalType(String evalType) {
        this.evalType = evalType;
    }

    public String getStage() {
        return stage;
    }

    public void setStage(String stage) {
        this.stage = stage;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getDateTaken() {
        return dateTaken;
    }

    public void setDateTaken(LocalDate dateTaken) {
        this.dateTaken = dateTaken;
    }

    public int getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(int isDeleted) {
        this.isDeleted = isDeleted;
    }

}
