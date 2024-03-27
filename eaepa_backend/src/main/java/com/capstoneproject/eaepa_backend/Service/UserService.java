package com.capstoneproject.eaepa_backend.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.capstoneproject.eaepa_backend.Entity.UserEntity;
import com.capstoneproject.eaepa_backend.Repository.UserRepository;

@Service
public class UserService {
        @Autowired
    private UserRepository userRepository;

    public UserEntity registerUser(UserEntity user) {
        // Check if user with the same email, employeeWorkID, or password already exists
        if (userRepository.existsByInstitutionalEmail(user.getInstitutionalEmail()) ||
            userRepository.existsByEmployeeWorkID(user.getEmployeeWorkID()) ||
            userRepository.existsByPassword(user.getPassword())) {
            throw new RuntimeException("User with the same email, employeeWorkID, or password already exists");
        }
        
        // If user doesn't exist, save the new user
        return userRepository.save(user);
    }

    public UserEntity loginUser(String institutionalEmail, String password) {
        UserEntity user = userRepository.findByInstitutionalEmailAndPassword(institutionalEmail, password);
        if (user == null) {
            throw new RuntimeException("Invalid email or password");
        }
        return user;
    }
}
