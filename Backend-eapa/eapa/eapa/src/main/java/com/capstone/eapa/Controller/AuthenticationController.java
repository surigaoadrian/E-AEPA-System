package com.capstone.eapa.Controller;

import com.capstone.eapa.Entity.AuthenticationResponse;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Service.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class AuthenticationController {

    private final AuthenticationService authService;

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
}
