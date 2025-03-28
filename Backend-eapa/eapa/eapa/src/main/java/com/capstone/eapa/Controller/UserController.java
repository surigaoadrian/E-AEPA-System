package com.capstone.eapa.Controller;

import com.capstone.eapa.DTO.ThirdAndFifthProbeDTO;
import com.capstone.eapa.DTO.UserCountDTO;
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

    @DeleteMapping("/delete/{adminId}/{userID}")
    public ResponseEntity<String> deleteUser(@PathVariable int adminId,@PathVariable int userID) {
        userServ.deleteUser(adminId,userID);
        return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
    }

    @PatchMapping("/editUser/{adminId}/{userID}")
    public ResponseEntity<UserEntity> editUserDetails(@PathVariable int adminId,@PathVariable int userID, @RequestBody UserEntity newDetails) {
        UserEntity updatedUser = userServ.editUserDetails(adminId,userID, newDetails);

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

    
    //random assigned peers for 3rd month
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

    //random assigned peers for 5th month
    @GetMapping("/get5thMonthAssignedEvaluators")
    public ResponseEntity<List<Integer>> get5thMonthAssignedEvaluators(
            @RequestParam String dept,
            @RequestParam int excludedUserID,
            @RequestParam List<Integer> excludedPeerIds) {
        List<Integer> evaluatorIds = userServ.get5thMonthAssignedEvaluators(dept, excludedUserID, excludedPeerIds);
        return ResponseEntity.ok(evaluatorIds);
    }

    //random assigned peers for Annual 1st Sem
    @GetMapping("/get1stAnnualAssignedEvaluators")
    public ResponseEntity<List<Integer>> get1stAnnualAssignedEvaluators(@RequestParam String dept, @RequestParam int excludedUserID) {
        try {
            List<Integer> assignedEvaluators = userServ.get1stAnnualAssignedEvaluators(dept, excludedUserID);
            if (assignedEvaluators.isEmpty()) {
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.ok(assignedEvaluators);
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    //total probationary employees
    @GetMapping("/countProbationaryUsers")
    public ResponseEntity<Long> countProbationaryUsers() {
        long count = userServ.getTotalProbationaryUsers();
        return ResponseEntity.ok(count);
    }
    //for total Employees
    @GetMapping("/countTotalEmployees")
    public ResponseEntity<Long> countTotalEmployees() {
        long count = userServ.getTotalEmployees();
        return ResponseEntity.ok(count);
    }

    @GetMapping("/getRegularEmployees")
    public ResponseEntity<Long> getRegularEmployees(){
        long count = userServ.getRegularEmployee();
        return ResponseEntity.ok(count);
    }

    @PatchMapping("/{userId}/3rdEval")
    public ResponseEntity<?> update3rdEvaluationStatus(@PathVariable int userId, @RequestParam boolean status) {
        userServ.update3rdEvaluationStatus(userId, status);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{userId}/5thEval")
    public ResponseEntity<?> update5thEvaluationStatus(@PathVariable int userId, @RequestParam boolean status) {
        userServ.update5thEvaluationStatus(userId, status);
        return ResponseEntity.ok().build();
    }



    @PatchMapping("/{userId}/promote")
    public ResponseEntity<String> promoteTo5thProbationary(@PathVariable int userId) {
        try {
            userServ.promoteTo5thProbationary(userId);
            return ResponseEntity.ok("User promoted to 5th Probationary successfully.");
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    //get the employees' data with the corresponding department head - Track Employee
    //  @GetMapping("/employees-with-head")
    // public ResponseEntity<List<UserEntity>> getAllEmployeesFromDepartmentHead(@RequestParam String headName) {
    //     List<UserEntity> employees = userServ.getAllEmployeesFromDepartmentHead(headName);
    //     return ResponseEntity.ok(employees);
    // }


    @GetMapping("/getHeadUserIdByDept")
    public ResponseEntity<Integer> getHeadUserIdByDept(@RequestParam String dept) {
        Integer userId = userServ.getHeadUserIdByDept(dept);
        return ResponseEntity.ok(userId);
    }

    //dashboard adi
    @GetMapping("/getThirdMonthEmpCount")
    public ResponseEntity<Integer> getThirdMonthEmpCount(){
        Integer thirdMonthEmpCount = userServ.getThirdMonthEmpCount();
        return ResponseEntity.ok(thirdMonthEmpCount);
    }
    @GetMapping("/getFifthMonthEmpCount")
    public ResponseEntity<Integer> getFifthMonthEmpCount(){
        Integer fifthMonthEmpCount = userServ.getFifthMonthEmpCount();
        return ResponseEntity.ok(fifthMonthEmpCount);
    }
    @GetMapping("/getRegularEmpCount")
    public ResponseEntity<Integer> getRegularEmpCount(){
        Integer regularEmpCount = userServ.getRegularEmpCount();
        return ResponseEntity.ok(regularEmpCount);
    }

    @GetMapping("/get3rdMonthProbeEmp")
    public ResponseEntity<List<ThirdAndFifthProbeDTO>> get3rdMonthProbeEmp(){
        System.out.println("Fetching 3rd-month probationary employees...");
        List<ThirdAndFifthProbeDTO> userList = userServ.getAll3rdMonthProbeEmp("3rd Probationary");
        System.out.println("User list size: " + userList.size());
//
//        if (userList.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        } else {
//            return ResponseEntity.ok(userList);
//        }
        return ResponseEntity.ok(userList);
    }

    @GetMapping("/get5thMonthProbeEmp")
    public ResponseEntity<List<ThirdAndFifthProbeDTO>> get5thMonthProbeEmp(){
        System.out.println("Fetching 5th-month probationary employees...");
        List<ThirdAndFifthProbeDTO> userList = userServ.getAll5thMonthProbeEmp("5th Probationary");
        System.out.println("User list size: " + userList.size());

//        if (userList.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        } else {
//            return ResponseEntity.ok(userList);
//        }
        return ResponseEntity.ok(userList);
    }

    //return user counts by dept
    @GetMapping("/userCounts/{department}")
    public ResponseEntity<UserCountDTO> getUserCounts(@PathVariable String department) {
        UserCountDTO counts = userServ.getUserCountsByDept(department);
        return ResponseEntity.ok(counts);
    }

    //return user counts by array of depts
    @GetMapping("/counts-by-departments")
    public List<UserCountDTO> getCountsByDepartments(@RequestParam String[] departments) {
        return userServ.getEmployeeCountsByDepartments(departments);
    }

}

