package com.capstone.eapa.Controller;

import org.springframework.web.bind.annotation.*;

import com.capstone.eapa.Entity.DepartmentEntity;
import com.capstone.eapa.Service.DepartmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.NoSuchElementException;


@RestController
@RequestMapping("/department")
@CrossOrigin(origins = "*")
public class DepartmentController {
    @Autowired
    DepartmentService departmentServ;

	@PostMapping("/addDept/{adminId}")
	public DepartmentEntity addDept(@PathVariable int adminId,@RequestBody DepartmentEntity dept) {
	    return departmentServ.addDepartment(adminId,dept);
    }

    @GetMapping("/getAllDepts")
	public List<DepartmentEntity> getAllDepts(){
		return departmentServ.getAllDepartments();
	}


	@GetMapping("/getDept/{id}")
	public ResponseEntity<DepartmentEntity> getDepartmentByID(@PathVariable int id){
		DepartmentEntity dept = departmentServ.getDepartmentById(id);

		if(dept != null){
			return ResponseEntity.ok(dept);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

    @PatchMapping("/updateDept/{adminId}")
	public DepartmentEntity updateDept(@PathVariable int adminId,@RequestParam int deptID, @RequestBody DepartmentEntity newDept) {
		return departmentServ.updateDepartment(adminId,deptID, newDept);
	}

	
	@DeleteMapping("/deleteDept/{adminId}/{id}")
	public String deleteDept(@PathVariable int adminId,@PathVariable int id) {
		return departmentServ.deleteDepartment(adminId,id);
	}

	@GetMapping("/getAllDeptNames")
	public List<String> getAllDeptNames() {
		return departmentServ.getAllDepartmentNames();
	}

	//update dept office head

	@PatchMapping("/{id}/office-head")
	public ResponseEntity<String> updateDepartmentOfficeHead(
			@PathVariable("id") int deptId,
			@RequestParam("newOfficeHead") String fullName) {
		try {
			departmentServ.updateDeptOfficeHead(deptId, fullName);
			return ResponseEntity.ok("Department office head updated successfully.");
		} catch (NoSuchElementException e) {
			return ResponseEntity.status(404).body("Department not found.");
		} catch (Exception e) {
			return ResponseEntity.status(500).body("An error occurred: " + e.getMessage());
		}
	}
    
}
