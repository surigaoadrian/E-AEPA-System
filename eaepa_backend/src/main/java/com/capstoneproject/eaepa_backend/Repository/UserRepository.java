package com.capstoneproject.eaepa_backend.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.capstoneproject.eaepa_backend.Entity.UserEntity;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer>{
        boolean existsByInstitutionalEmail(String institutionalEmail);
    boolean existsByEmployeeWorkID(int employeeWorkID);
    boolean existsByPassword(String password);

    //para pangita sa email ug password if same or dili
    UserEntity findByInstitutionalEmailAndPassword(String institutionalEmail, String password);
}
