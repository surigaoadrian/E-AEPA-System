package com.capstone.eapa.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.NoSuchElementException;

import com.capstone.eapa.Entity.DepartmentEntity;
import com.capstone.eapa.Repository.DepartmentRepository;
import com.capstone.eapa.Repository.UserRepository;

@Service
public class DepartmentService {
    @Autowired
    DepartmentRepository departmentRepo;
    @Autowired
    UserService userService;
    @Autowired
    UserRepository userRepo;
    //Add Department
    public DepartmentEntity addDepartment(int adminId,DepartmentEntity department) {
        String admin = userRepo.findById(adminId).get().getfName() + " " + userRepo.findById(adminId).get().getlName();
        userService.logActivity(adminId,admin,"Created Department", "Added New Department  : " + department.getDeptName() );
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
    public DepartmentEntity updateDepartment(int adminId,int id, DepartmentEntity newDept){
        DepartmentEntity dept = new DepartmentEntity();

        try{
            //Search user id
            dept = departmentRepo.findById(id).get();
            //assigning new data to the user entity
            dept.setDeptName(newDept.getDeptName());
            dept.setDeptOfficeHead(newDept.getDeptOfficeHead());
            String admin = userRepo.findById(adminId).get().getfName() + " " + userRepo.findById(adminId).get().getlName();
            userService.logActivity(adminId,admin,"Edited Department", "Modified Department Details : " + newDept.getDeptName() );
        } catch (NoSuchElementException ex){
            throw new NoSuchElementException("Department " + id + " not found.");
        } finally {
            return departmentRepo.save(dept);
        }

    }
    //Delete a Department
    public String deleteDepartment(int adminId,int deptID) {
        DepartmentEntity existingDepartment = departmentRepo.findById(deptID).orElse(null);
        existingDepartment.setIsDeleted(1);
        departmentRepo.save(existingDepartment);
        String admin = userRepo.findById(adminId).get().getfName() + " " + userRepo.findById(adminId).get().getlName();
        userService.logActivity(adminId,admin,"Deleted Department", "Deleted Department : " + existingDepartment.getDeptName() );
        return "Department deleted";
    }

}
