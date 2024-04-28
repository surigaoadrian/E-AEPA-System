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
import java.util.NoSuchElementException;
import java.util.Optional;
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

    public Optional<UserEntity> getUser(int userID){
        Optional<UserEntity> user = userRepo.findByUserID(userID);

        if(user.isPresent()){
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

    //find username
    public String checkUsernameAvailability(String username){
        Optional<UserEntity> user = userRepo.findByUsername(username);

        if(user.isPresent()){
            return "Username already taken";
        } else {
            return "Username available";
        }
    }


    //this method returns user details
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

//    this method deletes a user account
    public String deleteUser(int userID) {
        String msg = "";
        Optional<UserEntity> optionalUser = userRepo.findByUserID(userID);

        if(optionalUser.isPresent()){
            UserEntity user = optionalUser.get();
            user.setIsDeleted(1);
            userRepo.save(user);

            msg = "User " + user.getfName() + " " + user.getlName() + " is deleted.";
        }else {
            msg = "User not found";
        }
        return msg;
    }

    private String emptyToNull(String str) {
        return (str == null || str.trim().isEmpty()) ? null : str;
    }

    //adi edit user
    @Transactional
    public UserEntity adminUpdatesUser(int userID, UserEntity newUserDetails){
        UserEntity user = userRepo.findById(userID)
                .orElseThrow(() -> new NoSuchElementException("User " + userID + " not found."));
        try {
            if (newUserDetails.getWorkID() != null) user.setWorkID(newUserDetails.getWorkID());
            if (newUserDetails.getfName() != null) user.setfName(newUserDetails.getfName());
            if (newUserDetails.getmName() != null) user.setmName(newUserDetails.getmName());
            if (newUserDetails.getlName() != null) user.setlName(newUserDetails.getlName());
            if (newUserDetails.getWorkEmail() != null) user.setWorkEmail(newUserDetails.getWorkEmail());
            if (newUserDetails.getUsername() != null) user.setUsername(newUserDetails.getUsername());
            if (newUserDetails.getPosition() != null) user.setPosition(newUserDetails.getPosition());
            if (newUserDetails.getGender() != null) user.setGender(newUserDetails.getGender());
            if (newUserDetails.getDept() != null) user.setDept(newUserDetails.getDept());
            if (newUserDetails.getContactNum() != null) user.setContactNum(newUserDetails.getContactNum());
            if (newUserDetails.getEmpStatus() != null) user.setEmpStatus(newUserDetails.getEmpStatus());
            if (newUserDetails.getProbeStatus() != null) user.setProbeStatus(newUserDetails.getProbeStatus());
            if (newUserDetails.getDateStarted() != null) user.setDateStarted(newUserDetails.getDateStarted());
            return userRepo.save(user);
        } catch (Exception e) {
            // Log the exception along with some context
            System.out.println("Error updating user: " + e.getMessage());
            throw e; // rethrow or handle as appropriate
        }
    }

}
