
package com.capstone.eapa.Entity;

import jakarta.persistence.*;
import org.apache.catalina.User;

@Entity
@Table(name = "tbljobbasedresponse")
public class JobBasedResponseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @ManyToOne
    @JoinColumn(name = "evaluation_id", nullable = false)
    EvaluationEntity evaluation;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    UserEntity user;
    private String responsibility;
    private int score;
    private int isDeleted = 0;

    public JobBasedResponseEntity() {
        super();
    }

    public JobBasedResponseEntity(EvaluationEntity evaluation, UserEntity user, String responsibility, int score, int isDeleted) {
        this.evaluation = evaluation;
        this.user = user;
        this.responsibility = responsibility;
        this.score = score;
        this.isDeleted = isDeleted;
    }

    public int getId() {
        return id;
    }

    public EvaluationEntity getEvaluation() {
        return evaluation;
    }

    public void setEvaluation(EvaluationEntity evaluation) {
        this.evaluation = evaluation;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public String getResponsibility() {
        return responsibility;
    }

    public void setResponsibility(String responsibility) {
        this.responsibility = responsibility;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public int getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(int isDeleted) {
        this.isDeleted = isDeleted;
    }

}
