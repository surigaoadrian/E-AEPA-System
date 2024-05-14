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
import java.util.List;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {
    @Autowired
    private UserService userServ;

    @GetMapping("/print")
    public String print() {
        return "Konichiwa";
    }

    @GetMapping("/getUser/{userID}")
    public ResponseEntity<Optional<UserEntity>> getUser(@PathVariable int userID) {
        Optional<UserEntity> user = userServ.getUser(userID);

        if (user.isPresent()) {
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
        UserEntity updatedUser = userServ.adminUpdatesUser(userID, newDetails);

        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/checkUsername/{username}")
    public ResponseEntity<String> checkUsernameAvailability(@PathVariable String username) {
        String result = userServ.checkUsernameAvailability(username);

        if (result.equals("Username taken already")) {
            return ResponseEntity.ok(result); // username taken
        } else {
            return ResponseEntity.ok(result); // username avaiable
        }
        return user;
    }

    @PutMapping("/checkEmail/{workEmail}")
    public ResponseEntity<String> checkEmailAvailability(@PathVariable String workEmail) {
        String result = userServ.checkEmailAvailability(workEmail);

        if (result.equals("Email Address is already taken")) {
            return ResponseEntity.status(HttpStatus.OK).body(result);
        } else {
            return ResponseEntity.status(HttpStatus.OK).body(result);
        }
    }

    // for edit employee: account details
    @PatchMapping("/editAccountUsername/{userID}")
    public ResponseEntity<UserEntity> editAccountUsername(@PathVariable int userID,
            @RequestBody UserEntity newDetails) {
        UserEntity updatedUser = userServ.editAccountUnameDetails(userID, newDetails);

        return ResponseEntity.ok(updatedUser);
    }

    @PatchMapping("/changeAccountPassword/{userID}")
    public ResponseEntity<UserEntity> changeAccountPassword(@PathVariable int userID,
            @RequestBody UserEntity newDetails) {
        UserEntity updatedUser = userServ.changeAccountPassDetails(userID, newDetails);

        return ResponseEntity.ok(updatedUser);
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

}
