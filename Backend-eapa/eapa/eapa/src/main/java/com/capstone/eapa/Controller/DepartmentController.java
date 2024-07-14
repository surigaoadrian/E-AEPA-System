package com.capstone.eapa.Controller;

import org.springframework.web.bind.annotation.RestController;

import com.capstone.eapa.Entity.DepartmentEntity;
import com.capstone.eapa.Service.DepartmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;



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

    @PutMapping("/updateDept/{adminId}/")
	public DepartmentEntity updateDept(@PathVariable int adminId,@RequestParam int deptID, @RequestBody DepartmentEntity newDept) {
		return departmentServ.updateDepartment(adminId,deptID, newDept);
	}
	
	@DeleteMapping("/deleteDept/{adminId}/{id}")
	public String deleteDept(@PathVariable int adminId,@PathVariable int id) {
		return departmentServ.deleteDepartment(adminId,id);
	}
    
}
