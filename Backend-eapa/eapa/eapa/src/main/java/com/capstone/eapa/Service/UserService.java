package com.capstone.eapa.Service;

import com.capstone.eapa.Entity.PasswordResetToken;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.PasswordResetTokenRepository;
import com.capstone.eapa.Repository.UserRepository;
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
        return userRepo.findAll();
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
}
