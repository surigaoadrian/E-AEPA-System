package com.capstone.eapa.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;

import com.capstone.eapa.Entity.DepartmentEntity;
import com.capstone.eapa.Repository.DepartmentRepository;

@Service
public class DepartmentService {
    @Autowired
    DepartmentRepository departmentRepo;

    //Add Department
    public DepartmentEntity addDepartment(DepartmentEntity department) {
        return departmentRepo.save(department);
    }

    //Get All Departments
    public List<DepartmentEntity> getAllDepartments() {
        return departmentRepo.findAllDepts();
    }

    //Get Department by ID
    public DepartmentEntity getDepartmentById(int deptID) {
        return departmentRepo.findById(deptID).orElse(null);
    }

    //Update a Department
    @SuppressWarnings("finally")
    public DepartmentEntity updateDepartment(int id, DepartmentEntity newDept){
        DepartmentEntity dept = new DepartmentEntity();

        try{
            //Search user id
            dept = departmentRepo.findById(id).get();
            //assigning new data to the user entity
            dept.setDeptName(newDept.getDeptName());
            dept.setDeptOfficeHead(newDept.getDeptOfficeHead());
        } catch (NoSuchElementException ex){
            throw new NoSuchElementException("Department " + id + " not found.");
        } finally {
            return departmentRepo.save(dept);
        }

    }
    //Delete a Department
    public String deleteDepartment(int deptID) {
        DepartmentEntity existingDepartment = departmentRepo.findById(deptID).orElse(null);
        existingDepartment.setIsDeleted(1);
        departmentRepo.save(existingDepartment);
        return "Department deleted";
    }

}
