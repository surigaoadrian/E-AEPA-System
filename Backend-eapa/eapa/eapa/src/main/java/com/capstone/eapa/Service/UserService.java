package com.capstone.eapa.Service;

import com.capstone.eapa.Entity.PasswordResetToken;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.PasswordResetTokenRepository;
import com.capstone.eapa.Repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepo;
    @Autowired
    private PasswordResetTokenRepository passResetTokenRepo;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<UserEntity> getAllUser(){
        return userRepo.findAllByIsDeleted(0);
    }

    public UserEntity getUser(int userID){
        UserEntity user = userRepo.findByUserID(userID);

        if(user != null){
            return user;
        }

        throw new RuntimeException("User not found.");
    }

    @Transactional
    public void generateResetPassTokenForUser(String email){
        UserEntity user = userRepo.findByWorkEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException("No user found with email: " + email);
        }

        PasswordResetToken existingToken = passResetTokenRepo.findByUser(user);
        String token;

        if(existingToken != null) {
            // Update the existing token if found
            token = UUID.randomUUID().toString();  // Update the token variable here
            existingToken.setToken(token);
            existingToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));
            passResetTokenRepo.save(existingToken);
        } else {
            // Create a new token if none found
            token = UUID.randomUUID().toString();
            PasswordResetToken newToken = new PasswordResetToken();
            newToken.setUser(user);
            newToken.setToken(token);
            newToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));
            passResetTokenRepo.save(newToken);
        }

        emailService.sendSimpleMessage(
                user.getWorkEmail(),
                "Password Reset Request",
                "To reset your password, click the link: " + "http://localhost:5173/resetPassword/" + token
        );
    }

    public void changeUserPassword(String token, String newPassword){
        PasswordResetToken resetToken = passResetTokenRepo.findByToken(token);
        if(resetToken == null || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Token invalid or expired");
        }

        UserEntity user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
    }



    //this method returns user details
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    //this method deletes a user account
    public void deleteUser(int userID) {
        UserEntity user = userRepo.findByUserID(userID);
        if (user == null) {
            throw new EntityNotFoundException("User not found with id: " + userID);
        }
        // Mark the user as deleted
        user.setIsDeleted(1);
        userRepo.save(user);
    }

    //this method edits user details
    public UserEntity editUserDetails(int userID, UserEntity newUserDetails){
        UserEntity user = userRepo.findByUserID(userID);
        if(user != null){

            if(!newUserDetails.getUsername().equals(user.getUsername())){
                if(userRepo.existsByUsernameAndIsDeleted(newUserDetails.getUsername(),0)){
                    throw new RuntimeException("Username already exists");
                }
            }
            user.setEmpStatus(newUserDetails.getEmpStatus());
            user.setProbeStatus(newUserDetails.getProbeStatus());
            user.setDateStarted(newUserDetails.getDateStarted());
            user.setfName(newUserDetails.getfName());
            user.setmName(newUserDetails.getmName());
            user.setlName(newUserDetails.getlName());
            user.setPassword(newUserDetails.getPassword());
            user.setWorkEmail(newUserDetails.getEmpStatus());
            user.setUsername(newUserDetails.getUsername());

            return userRepo.save(user);
        }else{
            throw new RuntimeException("User not found");
        }
    }
}
