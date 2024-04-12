package com.capstone.eapa.Service;

import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepo;

    public List<UserEntity> getAllUser(){
        return userRepo.findAll();
    }

    public UserEntity getUser(int userID){
        UserEntity user = userRepo.findByUserID(userID);

        if(user != null){
            return user;
        }

        throw new RuntimeException("User not found.");
    }

    //this method returns user details
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
