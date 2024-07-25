package com.capstone.eapa.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "tblschoolyear")
public class SchoolYearEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String year;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<SemesterEntity> semesters;

    public int getId() {
        return id;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public List<SemesterEntity> getSemesters() {
        return semesters;
    }

    public void setSemesters(List<SemesterEntity> semesters) {
        this.semesters = semesters;
    }
}
