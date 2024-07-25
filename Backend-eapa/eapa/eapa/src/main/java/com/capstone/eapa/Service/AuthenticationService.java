package com.capstone.eapa.Service;

import com.capstone.eapa.Entity.AuthenticationResponse;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.UserRepository;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserRepository userRepo;
    @Autowired
    UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository userRepo, PasswordEncoder passwordEncoder, JwtService jwtService,
            AuthenticationManager authenticationManager) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }
   

    // registration (angela)
    public AuthenticationResponse register(int adminId,UserEntity request) {

        // Check if the username already exists, regardless of deletion status
        Optional<UserEntity> existingUserOptional = userRepo.findByUsername(request.getUsername());

        if (existingUserOptional.isPresent()) {
            // Username exists, update the existing record
            UserEntity existingUser = existingUserOptional.get();
            existingUser.setWorkID(request.getWorkID());
            existingUser.setfName(request.getfName());
            existingUser.setmName(request.getmName());
            existingUser.setlName(request.getlName());
            existingUser.setWorkEmail(request.getWorkEmail());
            existingUser.setUsername(request.getUsername());
            existingUser.setGender(request.getGender());
            existingUser.setPassword(passwordEncoder.encode(request.getPassword()));
            existingUser.setPosition(request.getPosition());
            existingUser.setDept(request.getDept());
            existingUser.setRole(request.getRole());
            existingUser.setEmpStatus(request.getEmpStatus());
            existingUser.setDateHired(request.getDateHired());
            existingUser.setProfilePic(request.getProfilePic());
            existingUser.setSignature(request.getSignature());
            existingUser.setDateStarted(request.getDateStarted());
            existingUser.setContactNum(request.getContactNum());
            existingUser.setProbeStatus(request.getProbeStatus());
            existingUser.setProbationary(request.isProbationary());
            existingUser.setIsDeleted(0);

            // Update the existing user record
            existingUser = userRepo.save(existingUser);

            // Generate JWT token for the updated user
            String token = jwtService.generateToken(existingUser);

            String admin = userRepo.findById(adminId).get().getfName() + " " + userRepo.findById(adminId).get().getlName();
            userService.logActivity(adminId,admin,"Created User Account", "Added New User  : " + existingUser.getfName() + " " + existingUser.getlName());
            return new AuthenticationResponse(token,existingUser.getUserID());
        } else {
            // Username does not exist, create a new record
            UserEntity newUser = new UserEntity();
            // newUser.setIsDeleted(0);
            newUser.setWorkID(request.getWorkID());
            newUser.setfName(request.getfName());
            newUser.setmName(request.getmName());
            newUser.setlName(request.getlName());
            newUser.setWorkEmail(request.getWorkEmail());
            newUser.setUsername(request.getUsername());
            newUser.setGender(request.getGender());
            newUser.setPassword(passwordEncoder.encode(request.getPassword()));
            newUser.setPosition(request.getPosition());
            newUser.setDept(request.getDept());
            newUser.setRole(request.getRole());
            newUser.setEmpStatus(request.getEmpStatus());
            newUser.setDateHired(request.getDateHired());
            newUser.setProfilePic(request.getProfilePic());
            newUser.setSignature(request.getSignature());
            newUser.setDateStarted(request.getDateStarted());
            newUser.setContactNum(request.getContactNum());
            newUser.setProbeStatus(request.getProbeStatus());
            newUser.setProbationary(request.isProbationary());

            // Save the new user record
            newUser = userRepo.save(newUser);
            
            // Generate JWT token for the new user
            String token = jwtService.generateToken(newUser);

            String admin = userRepo.findById(adminId).get().getfName() + " " + userRepo.findById(adminId).get().getlName();
            userService.logActivity(adminId,admin,"Created User Account", "Added New User : " + newUser.getfName() + " " + newUser.getlName());
            return new AuthenticationResponse(token,newUser.getUserID());
        }
    }

    // login
    public AuthenticationResponse authenticate(UserEntity request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()));

        UserEntity user = userRepo.findByUsernameAndIsDeleted(request.getUsername(), 0).orElseThrow();
        String token = jwtService.generateToken(user);

        return new AuthenticationResponse(token,user.getUserID());
    }

    public AuthenticationResponse swapAccount(String username, String password) {
        UserEntity user = userRepo.findByUsernameAndIsDeleted(username, 0)
                .orElseThrow(() -> new RuntimeException("User not found"));

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        username,
                        password));

        String token = jwtService.generateToken(user);
        return new AuthenticationResponse(token,user.getUserID());
    }

    public boolean adminAccountExist(String username){
        String adminUsername = "adm_"+username;
        return userRepo.existsByUsernameAndIsDeleted(adminUsername,0);
    }
}
