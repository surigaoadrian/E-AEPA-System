package com.capstone.eapa.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.capstone.eapa.Entity.DepartmentEntity;
import java.util.List;

@Repository
public interface DepartmentRepository extends JpaRepository<DepartmentEntity, Integer>{

    @Query(value = "SELECT * FROM tbldepartment dept WHERE dept.is_deleted = 0", nativeQuery = true)
    List<DepartmentEntity> findAllDepts();
    //Track Employee - finds the departments under the department head using the name
    List<DepartmentEntity> findByDeptOfficeHead(String headName);
}
