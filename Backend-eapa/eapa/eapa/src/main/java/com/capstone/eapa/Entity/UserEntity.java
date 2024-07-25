package com.capstone.eapa.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Blob;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "tbluser")
public class UserEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userID;
    @Column(name = "ID Number")
    private String workID;
    @Column(name = "First name")
    private String fName;
    @Column(name = "Middle name")
    private String mName;
    @Column(name = "Last name")
    private String lName;
    @Column(name = "Institutional Email")
    private String workEmail;
    private String username;
    private String gender;
    private String password;
    private String position;
    @Column(name = "Department")
    private String dept;
    @Column(name = "Contact Number")
    private String contactNum;
    @Enumerated(value = EnumType.STRING)
    private Role role;
    @Column(name = "Employment Status")
    private String empStatus;
    @Column(name = "Date Hired")
    private String dateHired;
    @Column(name = "Date Started")
    private String dateStarted;
    @JsonIgnore
    @Lob
    @Column(name = "Profile Picture", columnDefinition = "LONGBLOB")
    private byte[] profilePic;
    @Column(name = "image_format")
    private String imageFormat;
    @Lob
    private Blob signature;
    //changes made: Added mapping
    @Column(name = "is_probationary")
    private boolean isProbationary;
//    private boolean isProbationary;
    @Column(name = "Probationary Status")
    private String probeStatus;
    
    private int isDeleted = 0;

    public UserEntity() {
    }

    public int getUserID() {
        return userID;
    }

    public String getWorkID() {
        return workID;
    }

    public void setWorkID(String workID) {
        this.workID = workID;
    }

    public String getfName() {
        return fName;
    }

    public void setfName(String fName) {
        this.fName = fName;
    }

    public String getmName() {
        return mName;
    }

    public void setmName(String mName) {
        this.mName = mName;
    }

    public String getlName() {
        return lName;
    }

    public void setlName(String lName) {
        this.lName = lName;
    }

    public String getWorkEmail() {
        return workEmail;
    }

    public void setWorkEmail(String workEmail) {
        this.workEmail = workEmail;
    }

    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true; // make this true by default
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // make this true by default
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // make this true by default
    }

    @Override
    public boolean isEnabled() {
        return true; // make this true by default
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name())); // return list of roles our user have
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getDept() {
        return dept;
    }

    public void setDept(String dept) {
        this.dept = dept;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getEmpStatus() {
        return empStatus;
    }

    public void setEmpStatus(String empStatus) {
        this.empStatus = empStatus;
    }
     public byte[] getProfilePic() {
        return profilePic;
     }
    public void setProfilePic(byte[] profilePic) {
        this.profilePic = profilePic;
    }

    public int getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(int isDeleted) {
        this.isDeleted = isDeleted;
    }

    public String getContactNum() {
        return contactNum;
    }

    public void setContactNum(String contactNum) {
        this.contactNum = contactNum;
    }

    public Blob getSignature() {
        return signature;
    }

    public void setSignature(Blob signature) {
        this.signature = signature;
    }

    public boolean isProbationary() {
        return isProbationary;
    }

    public void setProbationary(boolean probationary) {
        isProbationary = probationary;
    }

    public String getProbeStatus() {
        return probeStatus;
    }

    public void setProbeStatus(String probeStatus) {
        this.probeStatus = probeStatus;
    }

    public String getDateHired() {
        return dateHired;
    }

    public void setDateHired(String dateHired) {
        this.dateHired = dateHired;
    }

    public String getDateStarted() {
        return dateStarted;
    }

    public void setDateStarted(String dateStarted) {
        this.dateStarted = dateStarted;
    }

    public String getImageFormat() {
        return imageFormat;
    }

    public void setImageFormat(String imageFormat) {
        this.imageFormat = imageFormat;
    }

    
}
