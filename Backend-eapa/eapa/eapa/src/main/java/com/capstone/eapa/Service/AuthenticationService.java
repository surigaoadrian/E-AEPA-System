package com.capstone.eapa.Service;

import com.capstone.eapa.Entity.AuthenticationResponse;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository userRepo, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    //registration
    public AuthenticationResponse register(UserEntity request) {
        UserEntity user = new UserEntity();
        user.setWorkID(request.getWorkID());
        user.setfName(request.getfName());
        user.setmName(request.getmName());
        user.setlName(request.getlName());
        user.setWorkEmail(request.getWorkEmail());
        user.setUsername(request.getUsername());
        user.setGender(request.getGender());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPosition(request.getPosition());
        user.setDept(request.getDept());
        user.setRole(request.getRole());
        user.setEmpStatus(request.getEmpStatus());
        user.setDateHired(request.getDateHired());
        user.setProfilePic(request.getProfilePic());
        user.setSignature((request.getSignature()));
        user.setDateStarted(request.getDateStarted());
        user.setContactNum(request.getContactNum());
        user.setProbationary(request.isProbationary());

        user = userRepo.save(user);

        String token = jwtService.generateToken(user);

        return new AuthenticationResponse(token);

    }

    //login
    public AuthenticationResponse authenticate(UserEntity request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        UserEntity user = userRepo.findByUsername(request.getUsername()).orElseThrow();
        String token = jwtService.generateToken(user);

        return new AuthenticationResponse(token);
    }
}
