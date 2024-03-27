package com.capstoneproject.eaepa_backend.Entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class UserEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private int userID;

    @Column(name = "employeeWorkID")
    private int employeeWorkID;

    @Column (name = "role")
    private String role;

    @Column (name = "firstname")
    private String firstname;

    @Column (name = "middlename")
    private String middlename;

    @Column (name = "lastname")
    private String lastname;

    @Column (name = "gender")
    private String gender;

    @Column (name = "birthdate")
    private String birthdate;

    @Column (name = "contactNumber")
    private String contactNumber;

    @Column (name = "institutionalEmail")
    private String institutionalEmail;

    @Column (name = "password")
    private String password;

    @Column (name = "department")
    private String department;

    @Column (name = "position")
    private String position;    

    @Column (name = "dateHired")
    private String dateHired;

    @Column (name = "isProbationary")
    private boolean isProbationary;

    @Column (name = "dateStarted")
    private String dateStarted;

    @Column(name = "signature")
    private String signature;

    public UserEntity() {
    }

    public UserEntity(int userID, int employeeWorkID, String role, String firstname, String middlename,
                        String lastname, String gender, String birthdate, String contactNumber, String institutionalEmail,
                        String password, String department, String position, String dateHired, boolean isProbationary,
                        String dateStarted, String signature) {
        this.userID = userID;
        this.employeeWorkID = employeeWorkID;
        this.role = role;
        if ("Admin".equals(role)) {
        this.firstname = "";
        this.middlename = "";
        this.lastname = "";
        this.gender = "";
        this.birthdate = "";
        this.contactNumber = "";
        this.department = "";
        this.position = "";
        this.dateHired = "";
        this.isProbationary = false;
        this.dateStarted = "";
        this.signature = "";
        } else {
        this.firstname = firstname;
        this.middlename = middlename;
        this.lastname = lastname;
        this.gender = gender;
        this.birthdate = birthdate;
        this.contactNumber = contactNumber;
        this.department = department;
        this.position = position;
        this.dateHired = dateHired;
        this.isProbationary = isProbationary;
        if (isProbationary) {
        this.dateStarted = dateStarted;
        } else {
        this.dateStarted = "";
        }
        this.signature = signature;
        }
        this.institutionalEmail = institutionalEmail;
        this.password = password;
        }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public int getEmployeeWorkID() {
        return employeeWorkID;
    }

    public void setEmployeeWorkID(int employeeWorkID) {
        this.employeeWorkID = employeeWorkID;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getMiddlename() {
        return middlename;
    }

    public void setMiddlename(String middlename) {
        this.middlename = middlename;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(String birthdate) {
        this.birthdate = birthdate;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public String getInstitutionalEmail() {
        return institutionalEmail;
    }

    public void setInstitutionalEmail(String institutionalEmail) {
        this.institutionalEmail = institutionalEmail;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getDateHired() {
        return dateHired;
    }

    public void setDateHired(String dateHired) {
        this.dateHired = dateHired;
    }

    public boolean isProbationary() {
        return isProbationary;
    }

    public void setProbationary(boolean isProbationary) {
        this.isProbationary = isProbationary;
    }

    public String getDateStarted() {
        return dateStarted;
    }

    public void setDateStarted(String dateStarted) {
        this.dateStarted = dateStarted;
    }

    public String getSignature() {
        return signature;
    }

    public void setSignature(String signature) {
        this.signature = signature;
    }
}