package com.capstone.eapa.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "tblsemester")
public class SemesterEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String name;
    @ElementCollection(fetch = FetchType.EAGER)
    private List<String> months;

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getMonths() {
        return months;
    }

    public void setMonths(List<String> months) {
        this.months = months;
    }
}
