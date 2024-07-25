package com.capstone.eapa.Controller;

import com.capstone.eapa.DTO.PasswordRequest;
import com.capstone.eapa.DTO.SwapAccountRequest;
import com.capstone.eapa.Entity.AuthenticationResponse;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.UserRepository;
import com.capstone.eapa.Service.AuthenticationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;


@RestController
@CrossOrigin(origins = "*")
public class AuthenticationController {

    private final AuthenticationService authService;
    @Autowired
    private UserRepository userRepo;

    public AuthenticationController(AuthenticationService authService) {
        this.authService = authService;
    }


    @PostMapping("/register/{adminId}")
    public ResponseEntity<AuthenticationResponse> register(@PathVariable int adminId,@RequestBody UserEntity request){
        return ResponseEntity.ok(authService.register(adminId,request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody UserEntity request){
        return ResponseEntity.ok(authService.authenticate(request));
    }

     @PostMapping("/swapAccount")
    public ResponseEntity<AuthenticationResponse> swapAccount(@RequestBody SwapAccountRequest request) {
        try {
            AuthenticationResponse response = authService.swapAccount(request.getUsername(), request.getPassword());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @GetMapping("/checkAdminAccount/{username}")
    public ResponseEntity<Boolean> checkAdminAccount(@PathVariable String username) {
        String adminUsername = "adm_" + username;
        boolean exists = userRepo.existsByUsernameAndIsDeleted(adminUsername,0);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/checkEmpAccount/{username}")
    public ResponseEntity<Boolean> checkEmpUsername(@PathVariable String username) {
        String empUsername = username.replace("adm_", "");
        boolean exists = userRepo.existsByUsernameAndIsDeleted(empUsername,0);
        return ResponseEntity.ok(exists);
    }

    @PostMapping("/verifyPassword")
    public ResponseEntity<Boolean> verifyPassword(@RequestBody PasswordRequest request) {
        boolean isValid = authService.verifyPassword(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(isValid);
    }
    
}
