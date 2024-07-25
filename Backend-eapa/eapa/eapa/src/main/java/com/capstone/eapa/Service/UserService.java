package com.capstone.eapa.Service;

import com.capstone.eapa.Entity.ActivityLogEntity;
import com.capstone.eapa.Entity.PasswordResetToken;
import com.capstone.eapa.Entity.Role;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.ActivityLogRepository;
import com.capstone.eapa.Repository.PasswordResetTokenRepository;
import com.capstone.eapa.Repository.UserRepository;

import io.jsonwebtoken.io.IOException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Blob;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService implements UserDetailsService {
    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordResetTokenRepository passResetTokenRepo;
    @Autowired
    private EmailService emailService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private ActivityLogRepository activityLogRepo;

    public List<UserEntity> getAllUser() {
        return userRepo.findAllByIsDeleted(0);
    }

    public Optional<UserEntity> getUser(int userID) {
        Optional<UserEntity> user = userRepo.findByUserID(userID);

        if (user.isPresent()) {
            return user;
        }

        throw new RuntimeException("User not found.");
    }

    //forgot password
    @Transactional
    public void generateResetPassTokenForUser(String email) {
        UserEntity user = userRepo.findByWorkEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException("No user found with email: " + email);
        }

        PasswordResetToken existingToken = passResetTokenRepo.findByUser(user);
        String token;

        if (existingToken != null) {
            // Update the existing token if found
            token = UUID.randomUUID().toString(); // Update the token variable here
            existingToken.setToken(token);
            existingToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));
            passResetTokenRepo.save(existingToken);
        } else {
            // Create a new token if none found
            token = UUID.randomUUID().toString();
            PasswordResetToken newToken = new PasswordResetToken();
            newToken.setUser(user);
            newToken.setToken(token);
            newToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));
            passResetTokenRepo.save(newToken);
        }

        emailService.sendSimpleMessage(
                user.getWorkEmail(),
                "Password Reset Request",
                "To reset your password, click the link: " + "http://localhost:5173/resetPassword/" + token);
    }

    public void changeUserPassword(String token, String newPassword) {
        PasswordResetToken resetToken = passResetTokenRepo.findByToken(token);
        if (resetToken == null || resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Token invalid or expired");
        }

        UserEntity user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);
    }

    // find username
    public String checkUsernameAvailability(String username) {
        boolean usernameExist = userRepo.existsByUsernameAndIsDeleted(username, 0);

        if (usernameExist) {
            return "Username already exists";
        } else {
            return "Username is available";
        }
    }

    // Service method to check email availability
    public String checkEmailAvailability(String workEmail) {
        boolean emailExists = userRepo.existsByWorkEmailAndIsDeleted(workEmail, 0);

        if (emailExists) {
            return "Email Address already exists";
        } else {
            return "Email Address is available";
        }
    }

    // this method returns user details
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepo.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    // this method deletes a user account
    public String deleteUser(int adminId,int userID) {
        String msg = "";
        Optional<UserEntity> optionalUser = userRepo.findByUserID(userID);

        if (optionalUser.isPresent()) {
            UserEntity user = optionalUser.get();
            user.setIsDeleted(1);
            userRepo.save(user);

            msg = "User " + user.getfName() + " " + user.getlName() + " is deleted.";
            String admin = userRepo.findById(adminId).get().getfName() + " " + userRepo.findById(adminId).get().getlName();
            logActivity(adminId,admin,"Deleted User Account", "Deleted User Account  : " + user.getfName() + " " + user.getlName());
        } else {
            msg = "User not found";
        }
        return msg;
    }

    private String emptyToNull(String str) {
        return (str == null || str.trim().isEmpty()) ? null : str;
    }

    @Transactional
    public UserEntity editUserDetails(int adminId,int userID, UserEntity newDetails) {
        UserEntity user = userRepo.findById(userID)
                .orElseThrow(() -> new NoSuchElementException("User " + userID + " not found."));
        try {
            if (newDetails.getfName() != null)
                user.setfName(newDetails.getfName());
            if (newDetails.getmName() != null)
                user.setmName(newDetails.getmName());
            if (newDetails.getlName() != null)
                user.setlName(newDetails.getlName());
            if (newDetails.getWorkID() != null)
                user.setWorkID(newDetails.getWorkID());
            if (newDetails.getGender() != null)
                user.setGender(newDetails.getGender());
            if (newDetails.getEmpStatus() != null)
                user.setEmpStatus(newDetails.getEmpStatus());
            if (newDetails.getDateHired() != null)
                user.setDateHired(newDetails.getDateHired());
            if (newDetails.getProbeStatus() != null)
                user.setProbeStatus(newDetails.getProbeStatus());
            if (newDetails.getDateStarted() !=null)
                user.setDateStarted(newDetails.getDateStarted());
            if (newDetails.getPosition() != null)
                user.setPosition(newDetails.getPosition());
            if (newDetails.getDept() != null)
                user.setDept(newDetails.getDept());
            if (newDetails.getWorkEmail() != null)
                user.setWorkEmail(newDetails.getWorkEmail());
            if (newDetails.getUsername() != null)
                user.setUsername(newDetails.getUsername());
            
            String admin = userRepo.findById(adminId).get().getfName() + " " + userRepo.findById(adminId).get().getlName();
            logActivity(adminId,admin,"Edited User Account", "Modified User Details : " + user.getfName() + " " + user.getlName());
            return userRepo.save(user);
        } catch (Exception e) {
            throw e; 
        }
    }

    // for edit employee: personal details
    @Transactional
    public UserEntity editPersonalDetails(int userID, UserEntity newDetails) {
        UserEntity user = userRepo.findById(userID)
                .orElseThrow(() -> new NoSuchElementException("User " + userID + " not found."));
        try {
            if (newDetails.getfName() != null)
                user.setfName(newDetails.getfName());
            if (newDetails.getmName() != null)
                user.setmName(newDetails.getmName());
            if (newDetails.getlName() != null)
                user.setlName(newDetails.getlName());
            if (newDetails.getGender() != null)
                user.setGender(newDetails.getGender());
            if (newDetails.getContactNum() != null)
                user.setContactNum(newDetails.getContactNum());
            return userRepo.save(user);
        } catch (Exception e) {
            throw e; 
        }
    }

    public UserEntity getUserById(int userID) {
        Optional<UserEntity> userOptional = userRepo.findById(userID);
        return userOptional.orElse(null);
    }

    // UPDATE PROFILE IMAGE
    public void updateUserImage(UserEntity userProfile, byte[] imageBytes, String imageFormat) {
        userProfile.setProfilePic(imageBytes);
        userProfile.setImageFormat(imageFormat);
        userRepo.save(userProfile);
    }

    // GET PROFILE IMAGE BY ID
    public byte[] getImageById(int userID) {
        Optional<UserEntity> userOptional = userRepo.findById(userID);
        if (userOptional.isPresent()) {
            UserEntity user = userOptional.get();
            if (user.getProfilePic() != null) {
                return user.getProfilePic();
            } else {
                throw new IllegalStateException("Profile picture is not available for user " + userID);
            }
        } else {
            throw new NoSuchElementException("User " + userID + " not found.");
        }
    }

    //randomize peer
//    public UserEntity getRandomPeer(String dept, int excludedUserID) {
//        List<UserEntity> users = userRepo.findByDeptAndRoleNotAndUserIDNot(dept, Role.HEAD, excludedUserID);
//        if (users.isEmpty()) {
//            throw new NoSuchElementException("No users found in the department excluding heads and the logged-in user.");
//        }
//        Random rand = new Random();
//        return users.get(rand.nextInt(users.size()));
//    }
    public UserEntity getRandomPeer(String dept, int excludedUserID) {
        List<UserEntity> users = userRepo.findPeersByDeptRoleNotUserIDNotAndPositionNotSecretary(dept, Role.HEAD.name(), excludedUserID);
        if (users.isEmpty()) {
            throw new NoSuchElementException("No users found in the department excluding heads and the logged-in user.");
        }
        Random rand = new Random();
        return users.get(rand.nextInt(users.size()));
    }

    public void logActivity(int adminId, String admin,String activity, String details){
        UserEntity user = userRepo.findById(adminId)
                .orElseThrow(() -> new NoSuchElementException("User " + adminId + " not found."));

        ActivityLogEntity activityLog = new ActivityLogEntity();
        activityLog.setUser(user);
        activityLog.setAdmin(admin);
        activityLog.setActivity(activity);
        activityLog.setActDetails(details);
        activityLog.setTimestamp(new Date());
        activityLogRepo.save(activityLog);
    }

    //peer evaluator assigned
//    public List<UserEntity> getAssignedEvaluators(String dept, int excludedUserID) {
//        List<UserEntity> users = userRepo.findPeersByDeptRoleNotUserIDNotAndPositionNotSecretary(dept, Role.HEAD.name(), excludedUserID);
//
//        if (users.isEmpty()) {
//            return Collections.emptyList();
//        }
//
//        // Filter out users with the position 'Secretary'
//        List<UserEntity> filteredUsers = users.stream()
//                .filter(user -> !user.getPosition().equalsIgnoreCase("secretary"))
//                .collect(Collectors.toList());
//
//        // Remove the excluded user ID
//        filteredUsers.removeIf(user -> user.getUserID() == excludedUserID);
//
//        int size = filteredUsers.size();
//        if (size <= 1) {
//            return Collections.emptyList();
//        } else if (size == 2) {
//            return filteredUsers.subList(0, 1);
//        } else if (size == 3) {
//            return filteredUsers.subList(0, 2);
//        } else {
//            Collections.shuffle(filteredUsers);
//            return filteredUsers.subList(0, 3);
//        }
//    }
    public List<Integer> getAssignedEvaluators(String dept, int excludedUserID) {
        List<UserEntity> users = userRepo.findPeersByDeptRoleNotUserIDNotAndPositionNotSecretary(dept, Role.HEAD.name(), excludedUserID);

        if (users.isEmpty()) {
            return Collections.emptyList();
        }

        // Filter out users with the position 'Secretary'
        List<UserEntity> filteredUsers = users.stream()
                .filter(user -> !user.getPosition().equalsIgnoreCase("secretary"))
                .collect(Collectors.toList());

        // Remove the excluded user ID
        filteredUsers.removeIf(user -> user.getUserID() == excludedUserID);

        int size = filteredUsers.size();
        if (size <= 1) {
            return Collections.emptyList();
        } else if (size == 2) {
            return filteredUsers.subList(0, 1).stream()
                    .map(UserEntity::getUserID)
                    .collect(Collectors.toList());
        } else if (size == 3) {
            return filteredUsers.subList(0, 2).stream()
                    .map(UserEntity::getUserID)
                    .collect(Collectors.toList());
        } else {
            Collections.shuffle(filteredUsers);
            return filteredUsers.subList(0, 3).stream()
                    .map(UserEntity::getUserID)
                    .collect(Collectors.toList());
        }
    }

    //Get Employees under Department Head
//    public List<UserEntity> getAllEmployeesFromDepartmentHead(String headName) {
//
//        List<DepartmentEntity> departments = departmentRepository.findByDeptOfficeHead(headName);
//
//        List<String> departmentNames = departments.stream()
//                .map(DepartmentEntity::getDeptName)
//                .collect(Collectors.toList());
//
//
//        return userRepo.findByDeptIn(departmentNames);
//    }
    //added is_probationary
    public long getTotalProbationaryUsers() {
        return userRepo.countByIsProbationaryTrue();
    }

    //
    public long getTotalEmployees(){return userRepo.countTotalEmployees();}

     //count regular Employees
    public long getRegularEmployee(){return userRepo.countRegularEmployees();}

public boolean verifyPassword(int userID, String rawPassword) {
    UserEntity user = userRepo.findByUserID(userID).orElse(null);
    if (user == null) {
        return false;
    }
    return passwordEncoder.matches(rawPassword, user.getPassword());
}
}
