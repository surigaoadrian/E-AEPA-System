package com.capstone.eapa.Controller;

import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
    public ResponseEntity<Optional<UserEntity>> getUser (@PathVariable int userID){
        Optional<UserEntity> user = userServ.getUser(userID);

        if(user.isPresent()){
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

    @PatchMapping ("/editUser/{userID}")
    public ResponseEntity<UserEntity> editUserDetails(@PathVariable int userID, @RequestBody UserEntity newDetails) {
        UserEntity updatedUser = userServ.adminUpdatesUser(userID, newDetails);

        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/checkUsername/{username}")
    public ResponseEntity<String> checkUsernameAvailability(@PathVariable String username){
        String result = userServ.checkUsernameAvailability(username);

        if(result.equals("Username taken already")){
            return ResponseEntity.ok(result); //username taken
        }else {
            return ResponseEntity.ok(result); //username avaiable
        }
    }
}
