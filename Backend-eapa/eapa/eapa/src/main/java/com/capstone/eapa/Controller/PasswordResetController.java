package com.capstone.eapa.Controller;

import com.capstone.eapa.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class PasswordResetController {
    @Autowired
    private UserService userServ;

    @PostMapping("/forgotPassword")
    public ResponseEntity<?> forgotPassword(@RequestParam String email){
        userServ.generateResetPassTokenForUser(email);
        return ResponseEntity.ok("Password reset link has been sent to your email");
    }

    @PostMapping("/resetPassword")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword){
        userServ.changeUserPassword(token, newPassword);
        return ResponseEntity.ok("Your password has been updated");
    }
}
