package com.capstone.eapa.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "tblevalstatustracker")
public class EvalStatusTrackerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "userID")
    @JsonIgnore
    private UserEntity user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "academic_year_id", referencedColumnName = "id")
    @JsonIgnore
    private AcademicYearEntity academicYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "semester_id", referencedColumnName = "id")
    @JsonIgnore
    private SemesterEntity semester;

    @Column(name = "is_completed")
    private boolean isCompleted = false;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public EvalStatusTrackerEntity() {
    }

    public EvalStatusTrackerEntity(UserEntity user, AcademicYearEntity academicYear, SemesterEntity semester, boolean isCompleted, LocalDateTime completedAt) {
        this.user = user;
        this.academicYear = academicYear;
        this.semester = semester;
        this.isCompleted = isCompleted;
        this.completedAt = completedAt;
    }

    public int getId() {
        return id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public AcademicYearEntity getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(AcademicYearEntity academicYear) {
        this.academicYear = academicYear;
    }

    public SemesterEntity getSemester() {
        return semester;
    }

    public void setSemester(SemesterEntity semester) {
        this.semester = semester;
    }

    public boolean isCompleted() {
        return isCompleted;
    }

    public void setCompleted(boolean completed) {
        isCompleted = completed;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
