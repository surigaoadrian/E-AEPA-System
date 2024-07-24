package com.capstone.eapa.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "tblquestions")
public class QuestionEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int quesID;
    private String quesText;
    private String quesType; //VALUES, JOB
    private String category; // For VALUES (CULTURE OF EXCELLENCE, INTEGRITY, TEAMWORK, UNIVERSALITY)
    private String kind; //RADIO, FILL

    private String evalType; //SELF PEER HEAD
    private int isDeleted = 0;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResponseEntity> responses;

    public QuestionEntity() {
        super();
    }

    public QuestionEntity(String quesText, String quesType, String category, String kind, int isDeleted, String evalType) {
        this.quesText = quesText;
        this.quesType = quesType;
        this.category = category;
        this.kind = kind;
        this.evalType = evalType;
        this.isDeleted = isDeleted;
    }

    public int getQuesID() {
        return quesID;
    }

    public String getQuesText() {
        return quesText;
    }

    public void setQuesText(String quesText) {
        this.quesText = quesText;
    }

    public String getQuesType() {
        return quesType;
    }

    public void setQuesType(String quesType) {
        this.quesType = quesType;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getKind() {
        return kind;
    }

    public void setKind(String kind) {
        this.kind = kind;
    }

    public String getEvalType() {
        return evalType;
    }

    public void setEvalType(String evalType) {
        this.evalType = evalType;
    }

    public int getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(int isDeleted) {
        this.isDeleted = isDeleted;
    }

}
