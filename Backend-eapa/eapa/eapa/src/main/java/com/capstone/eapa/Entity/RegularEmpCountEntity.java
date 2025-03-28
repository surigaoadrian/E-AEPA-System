package com.capstone.eapa.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tblregularempcount")
public class RegularEmpCountEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String month;
    private int year;
    private int regularEmpCount;

    public RegularEmpCountEntity() {
    }

    public RegularEmpCountEntity(String month, int year, int regularEmpCount) {
        this.month = month;
        this.year = year;
        this.regularEmpCount = regularEmpCount;
    }

    public int getId() {
        return id;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public int getRegularEmpCount() {
        return regularEmpCount;
    }

    public void setRegularEmpCount(int regularEmpCount) {
        this.regularEmpCount = regularEmpCount;
    }
}
