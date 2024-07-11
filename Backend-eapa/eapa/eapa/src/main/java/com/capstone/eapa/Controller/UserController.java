package com.capstone.eapa.Controller;

import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "*")
public class UserController {
    @Autowired
    private UserService userServ;


    @GetMapping("/getUser/{userID}")
    public ResponseEntity<Optional<UserEntity>> getUser(@PathVariable int userID){
        Optional<UserEntity> user = userServ.getUser(userID);

        if(user.isPresent()) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/getAllUser")
    public ResponseEntity<List<UserEntity>> getAllUser() {
        List<UserEntity> userList = userServ.getAllUser();

        if (userList.isEmpty()) {
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

    @PatchMapping("/editUser/{userID}")
    public ResponseEntity<UserEntity> editUserDetails(@PathVariable int userID, @RequestBody UserEntity newDetails) {
        UserEntity updatedUser = userServ.editUserDetails(userID, newDetails);

        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/checkUsername/{username}")
    public ResponseEntity<String> checkUsernameAvailability(@PathVariable String username) {
        String result = userServ.checkUsernameAvailability(username);

        if (result.equals("Username already exists")) {
            return ResponseEntity.ok(result); // username taken
        } else {
            return ResponseEntity.ok(result); // username avaiable
        }
    }

    @PutMapping("/checkEmail/{workEmail}")
    public ResponseEntity<String> checkEmailAvailability(@PathVariable String workEmail) {
        String result = userServ.checkEmailAvailability(workEmail);

        if (result.equals("Email Address already exists")) {
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(result);
        }
    }


    // for edit employee: personal details
    @PatchMapping("/editPersonalDetails/{userID}")
    public ResponseEntity<UserEntity> editPersonalDetails(@PathVariable int userID,
            @RequestBody UserEntity newDetails) {
        UserEntity updatedUser = userServ.editPersonalDetails(userID, newDetails);

        return ResponseEntity.ok(updatedUser);
    }

    // UPLOAD PROFILE IMAGE BY ID
    @PostMapping("/uploadImage/{userID}")
    public ResponseEntity<String> uploadImageById(@RequestParam("image") MultipartFile file, @PathVariable int userID) {
        try {
            String mimeType = file.getContentType();
            String imageFormat = mimeType != null && mimeType.split("/")[1].equalsIgnoreCase("png") ? "png" : "jpeg";

            UserEntity user = userServ.getUserById(userID);
            if (user == null) {
                return ResponseEntity.notFound().build();
            }

            userServ.updateUserImage(user, file.getBytes(), imageFormat);
            return ResponseEntity.ok("Image uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error occurred while uploading the image");
        }
    }

    @GetMapping(value = "/image/{userID}", produces = { MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE, })
    public ResponseEntity<byte[]> getResidentImageById(@PathVariable int userID) {
        UserEntity user = userServ.getUserById(userID);
        if (user == null || user.getProfilePic() == null) {
            return ResponseEntity.notFound().build();
        }

        String imageFormat = user.getImageFormat();
        MediaType mediaType = MediaType.IMAGE_JPEG; // default to JPEG
        if ("png".equalsIgnoreCase(imageFormat)) {
            mediaType = MediaType.IMAGE_PNG;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .body(user.getProfilePic());
    }

    //randomize peer
    @GetMapping("/randomPeer")
    public ResponseEntity<UserEntity> getRandomPeer(@RequestParam String dept, @RequestParam int excludedUserID) {
        try {
            UserEntity randomPeer = userServ.getRandomPeer(dept, excludedUserID);
            return ResponseEntity.ok(randomPeer);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    //random assigned peers
    @GetMapping("/getAssignedEvaluators")
    public ResponseEntity<List<Integer>> getAssignedEvaluators(@RequestParam String dept, @RequestParam int excludedUserID) {
        try {
            List<Integer> assignedEvaluators = userServ.getAssignedEvaluators(dept, excludedUserID);
            if (assignedEvaluators.isEmpty()) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.ok(assignedEvaluators);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    //get the employees' data with the corresponding department head - Track Employee
    //  @GetMapping("/employees-with-head")
    // public ResponseEntity<List<UserEntity>> getAllEmployeesFromDepartmentHead(@RequestParam String headName) {
    //     List<UserEntity> employees = userServ.getAllEmployeesFromDepartmentHead(headName);
    //     return ResponseEntity.ok(employees);
    // }


}
