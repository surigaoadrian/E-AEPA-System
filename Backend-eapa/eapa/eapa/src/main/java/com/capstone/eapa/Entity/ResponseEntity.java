package com.capstone.eapa.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tblresponse")
public class ResponseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int responseID;
    @ManyToOne
    @JoinColumn(name = "evaluation_id", nullable = true)
    private EvaluationEntity evaluation;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private QuestionEntity question;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;
    private String comments;
    private int score;

    private String answers;
    private int isDeleted = 0;


    public ResponseEntity() {
        super();
    }

    public ResponseEntity(EvaluationEntity evaluation, QuestionEntity question, UserEntity user, String comments, int score, String answers, int isDeleted) {
        this.evaluation = evaluation;
        this.question = question;
        this.user = user;
        this.comments = comments;
        this.score = score;
        this.answers = answers;
        this.isDeleted = isDeleted;
    }

    public int getResponseID() {
        return responseID;
    }

    public EvaluationEntity getEvaluation() {
        return evaluation;
    }

    public void setEvaluation(EvaluationEntity evaluation) {
        this.evaluation = evaluation;
    }

    public QuestionEntity getQuestion() {
        return question;
    }

    public void setQuestion(QuestionEntity question) {
        this.question = question;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public String getAnswers() {
        return answers;
    }

    public void setAnswers(String answers) {
        this.answers = answers;
    }

    public int getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(int isDeleted) {
        this.isDeleted = isDeleted;
    }

}
