package com.capstone.eapa.DTO;

public class UserCountDTO {
    private String deptName;
    private int countOf3MonthProbe;
    private int countOf5MonthProbe;
    private int countOfRegEmp;

    // Constructor
    public UserCountDTO(String deptName, int countOf3MonthProbe, int countOf5MonthProbe, int countOfRegEmp) {
        this.deptName = deptName;
        this.countOf3MonthProbe = countOf3MonthProbe;
        this.countOf5MonthProbe = countOf5MonthProbe;
        this.countOfRegEmp = countOfRegEmp;
    }


    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }

    public int getCountOf3MonthProbe() {
        return countOf3MonthProbe;
    }

    public void setCountOf3MonthProbe(int countOf3MonthProbe) {
        this.countOf3MonthProbe = countOf3MonthProbe;
    }

    public int getCountOf5MonthProbe() {
        return countOf5MonthProbe;
    }

    public void setCountOf5MonthProbe(int countOf5MonthProbe) {
        this.countOf5MonthProbe = countOf5MonthProbe;
    }

    public int getCountOfRegEmp() {
        return countOfRegEmp;
    }

    public void setCountOfRegEmp(int countOfRegEmp) {
        this.countOfRegEmp = countOfRegEmp;
    }
}
