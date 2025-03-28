package com.capstone.eapa.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import org.springframework.boot.autoconfigure.security.SecurityProperties.User;

@Entity
@Table(name = "head_comments")
public class HeadCommentsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "quesID", referencedColumnName = "quesID", nullable = false)
    private QuestionEntity question; // Question reference 

    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "userID", nullable = false)
    private UserEntity userID; // Evaluatee ID

    @ManyToOne
    @JoinColumn(name = "head_id", referencedColumnName = "userID", nullable = false)
    private UserEntity headID; // Evaluator (Head) ID

    @Column(name = "comment", nullable = false, columnDefinition = "TEXT")
    private String comment;

    private String period; //3rd Month, 5th Month, Annual
    private String schoolYear; //2024-2025
    private String semester;
    private int isDeleted = 0;

    // Constructors
    public HeadCommentsEntity() {}

    public HeadCommentsEntity(QuestionEntity question, UserEntity userID, UserEntity headID, String comment, String period, String schoolYear, String semester) {
        this.userID = userID;
        this.question = question;
        this.headID = headID;
        this.comment = comment;
        this.period = period;
        this.schoolYear = schoolYear;
        this.semester = semester;
    }
    // Getters and Setters
    
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public UserEntity getUserID() {
        return userID;
    }

    public void setUserID(UserEntity userID) {
        this.userID = userID;
    }
    
    public UserEntity getHeadID() {
        return headID;
    }

    public void setHeadID(UserEntity headID) {
        this.headID = headID;
    }

    public QuestionEntity getQuestion() {
        return question;
    }

    public void setQuestion(QuestionEntity question) {
        this.question = question;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }
    public String getSchoolYear() {
        return schoolYear;
    }

    public void setSchoolYear(String schoolYear) {
        this.schoolYear = schoolYear;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public int getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(int isDeleted) {
        this.isDeleted = isDeleted;
    }
}
