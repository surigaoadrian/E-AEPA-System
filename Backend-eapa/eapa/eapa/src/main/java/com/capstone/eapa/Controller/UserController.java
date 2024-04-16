package com.capstone.eapa.Controller;

import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    @Autowired
    private UserService userServ;

    @GetMapping("/print")
    public String print(){
        return "Konichiwa";
    }


    @GetMapping("/getUser/{userID}")
    public ResponseEntity<UserEntity> getUser (@PathVariable int userID){
        UserEntity user = userServ.getUser(userID);

        if(user != null){
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getAllUser")
    public ResponseEntity<List<UserEntity>> getAllUser()
    {
        List<UserEntity> userList = userServ.getAllUser();

        if(userList.isEmpty()){
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(userList);
        }
    }

    @DeleteMapping("/delete/{userID}")
    public ResponseEntity<String> deleteUser(@PathVariable int userID) {
        userServ.deleteUser(userID);
        return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
    }

    @PutMapping("/editUser/{userID}")
    public UserEntity editUserDetails(@PathVariable int userID, @RequestBody UserEntity newDetails) {
        UserEntity user = userServ.editUserDetails(userID, newDetails);
        if(user == null){
            throw new RuntimeException("User not found with id: " + userID);
        }
        return user;
    }
}
