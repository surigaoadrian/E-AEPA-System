package com.capstone.eapa.Entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "tbldepartment")
public class DepartmentEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int deptID;
	
	@Column(name = "DepartmentName")
	private String deptName;
    private String deptOfficeHead;
	private int isDeleted = 0;

	public DepartmentEntity() {
		super();
	}

	public DepartmentEntity(int deptID, String deptName, String deptOfficeHead) {
		super();
		this.deptID = deptID;
		this.deptName = deptName;
        this.deptOfficeHead = deptOfficeHead;
	}

    
	public int getDeptID() {
		return deptID;
	}

    public void setDeptID(int deptID) {
        this.deptID = deptID;
    }
	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
    
    public String getDeptOfficeHead() {
        return deptOfficeHead;
    }

    public void setDeptOfficeHead(String deptOfficeHead) {
        this.deptOfficeHead = deptOfficeHead;
    }

    public int isDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(int deleted) {
        isDeleted = deleted;
    }
    public int getIsDeleted() {
		return isDeleted;
	}
}


