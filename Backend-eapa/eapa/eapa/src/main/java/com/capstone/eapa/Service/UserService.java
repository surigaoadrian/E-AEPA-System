package com.capstone.eapa.Service;

import com.capstone.eapa.DTO.ThirdAndFifthProbeDTO;
import com.capstone.eapa.DTO.UserCountDTO;
import com.capstone.eapa.Entity.ActivityLogEntity;
import com.capstone.eapa.Entity.PasswordResetToken;
import com.capstone.eapa.Entity.Role;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.ActivityLogRepository;
import com.capstone.eapa.Repository.PasswordResetTokenRepository;
import com.capstone.eapa.Repository.UserRepository;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

            user.setIs3rdEvalComplete(newDetails.getIs3rdEvalComplete());
            user.setIs5thEvalComplete(newDetails.getIs5thEvalComplete());

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
//    public List<Integer> getAssignedEvaluators(String dept, int excludedUserID) {
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
//            return filteredUsers.subList(0, 1).stream()
//                    .map(UserEntity::getUserID)
//                    .collect(Collectors.toList());
//        } else if (size == 3) {
//            return filteredUsers.subList(0, 2).stream()
//                    .map(UserEntity::getUserID)
//                    .collect(Collectors.toList());
//        } else {
//            Collections.shuffle(filteredUsers);
//            return filteredUsers.subList(0, 3).stream()
//                    .map(UserEntity::getUserID)
//                    .collect(Collectors.toList());
//        }
//    }
    public List<Integer> getAssignedEvaluators(String dept, int excludedUserID) {
        // Step 1: Get all peers excluding heads, secretaries, and the excluded user
        List<UserEntity> allUsers = userRepo.findPeersByDeptRoleNotUserIDNotAndPositionNotSecretary(dept, Role.HEAD.name(), excludedUserID);

        // Step 2: Filter out "Regular" employees first
        List<UserEntity> regularUsers = allUsers.stream()
                .filter(user -> "Regular".equalsIgnoreCase(user.getEmpStatus()))
                .collect(Collectors.toList());

        // Step 3: If there are not enough "Regular" employees, include probationary employees (3rd or 5th)
        if (regularUsers.size() < 3) {
            List<UserEntity> probationaryUsers = allUsers.stream()
                    .filter(user -> "3rd Probationary".equalsIgnoreCase(user.getProbeStatus())
                            || "5th Probationary".equalsIgnoreCase(user.getProbeStatus()))
                    .collect(Collectors.toList());
            regularUsers.addAll(probationaryUsers);
        }

        // Step 4: Exclude the user with the `excludedUserID`
        regularUsers.removeIf(user -> user.getUserID() == excludedUserID);

        // Step 5: Handle the size and randomization logic
        int size = regularUsers.size();

        if (size == 0) {
            return Collections.emptyList(); // No users to return
        } else if (size <= 3) {
            // Return all users if the size is 1, 2, or 3
            return regularUsers.stream()
                    .map(UserEntity::getUserID)
                    .collect(Collectors.toList());
        } else {
            // If more than 3 users are available, shuffle and return only 3
            Collections.shuffle(regularUsers);
            return regularUsers.subList(0, 3).stream()
                    .map(UserEntity::getUserID)
                    .collect(Collectors.toList());
        }
    }


    //get assigned evaluators for 5th month
//    public List<Integer> get5thMonthAssignedEvaluators(String dept, int excludedUserID, List<Integer> excludedPeerIds) {
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
//        // Filter out the excluded peer IDs
//        List<UserEntity> finalFilteredUsers = filteredUsers.stream()
//                .filter(user -> !excludedPeerIds.contains(user.getUserID()))
//                .collect(Collectors.toList());
//
//        // If after filtering, the list is too small, re-add some of the excludedPeerIds
//        if (finalFilteredUsers.size() < 3 && !excludedPeerIds.isEmpty()) {
//            finalFilteredUsers = new ArrayList<>(filteredUsers); // Reset to the original filtered list without `excludedUserID`
//        }
//
//        int size = finalFilteredUsers.size();
//        if (size <= 1) {
//            return Collections.emptyList();
//        } else if (size == 2) {
//            return finalFilteredUsers.subList(0, 1).stream()
//                    .map(UserEntity::getUserID)
//                    .collect(Collectors.toList());
//        } else if (size == 3) {
//            return finalFilteredUsers.subList(0, 2).stream()
//                    .map(UserEntity::getUserID)
//                    .collect(Collectors.toList());
//        } else {
//            Collections.shuffle(finalFilteredUsers);
//            return finalFilteredUsers.subList(0, 3).stream()
//                    .map(UserEntity::getUserID)
//                    .collect(Collectors.toList());
//        }
//    }
    public List<Integer> get5thMonthAssignedEvaluators(String dept, int excludedUserID, List<Integer> excludedPeerIds) {
        // Step 1: Fetch users excluding heads, secretaries, and the excluded user
        List<UserEntity> users = userRepo.findPeersByDeptRoleNotUserIDNotAndPositionNotSecretary(dept, Role.HEAD.name(), excludedUserID);

        if (users.isEmpty()) {
            return Collections.emptyList(); // No users to return
        }

        // Step 2: Filter out users with the position 'Secretary'
        List<UserEntity> filteredUsers = users.stream()
                .filter(user -> !user.getPosition().equalsIgnoreCase("secretary"))
                .collect(Collectors.toList());

        // Step 3: Remove the excluded user ID
        filteredUsers.removeIf(user -> user.getUserID() == excludedUserID);

        // Step 4: Filter out the excluded peer IDs
        List<UserEntity> finalFilteredUsers = filteredUsers.stream()
                .filter(user -> !excludedPeerIds.contains(user.getUserID()))
                .collect(Collectors.toList());

        // Step 5: If after filtering the list is too small, re-add some of the excludedPeerIds
        if (finalFilteredUsers.size() < 3 && !excludedPeerIds.isEmpty()) {
            finalFilteredUsers = new ArrayList<>(filteredUsers); // Reset to the original filtered list without `excludedUserID`
        }

        // Step 6: Handle the size and randomization logic
        int size = finalFilteredUsers.size();

        if (size == 0) {
            return Collections.emptyList(); // No users to return
        } else if (size <= 3) {
            // If the size is 1, 2, or 3, return all available users
            return finalFilteredUsers.stream()
                    .map(UserEntity::getUserID)
                    .collect(Collectors.toList());
        } else {
            // If more than 3 users are available, shuffle and return only 3
            Collections.shuffle(finalFilteredUsers);
            return finalFilteredUsers.subList(0, 3).stream()
                    .map(UserEntity::getUserID)
                    .collect(Collectors.toList());
        }
    }


    //get assigned evaluators for annual first sem
    public List<Integer> get1stAnnualAssignedEvaluators(String dept, int excludedUserID) {
        // Fetch users who are not the excluded user, are not secretaries, and have empStatus = 'Regular'
        List<UserEntity> users = userRepo.findPeersByDeptRoleNotUserIDNotAndPositionNotSecretary(dept, Role.HEAD.name(), excludedUserID);


        if (users.isEmpty()) {
            return Collections.emptyList();
        }

        // Filter out users who are not "Regular" and exclude the given user
        List<UserEntity> regularUsers = users.stream()
                .filter(user -> "Regular".equalsIgnoreCase(user.getEmpStatus()) && user.getUserID() != excludedUserID)
                .collect(Collectors.toList());

        // Log the filtered regular users
        //System.out.println("Filtered Regular Users: " + regularUsers);


        // Handle cases based on the size of the remaining list after filtering
        int size = regularUsers.size();
        if (size == 0) {
            // If no users left after filtering, return an empty list
            return Collections.emptyList();
        } else if (size == 1) {
            // If only 1 user remains, return that user
            return regularUsers.stream()
                    .map(UserEntity::getUserID)
                    .collect(Collectors.toList());
        } else if (size == 2) {
            // If 2 users remain, return both users
            return regularUsers.stream()
                    .map(UserEntity::getUserID)
                    .collect(Collectors.toList());
        } else if (size == 3) {
            // If 3 users remain, return all three users
            return regularUsers.stream()
                    .map(UserEntity::getUserID)
                    .collect(Collectors.toList());
        } else {
            // If more than 3 users remain, shuffle and return the first 3 users
            Collections.shuffle(regularUsers);
            return regularUsers.subList(0, 3).stream()
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

    public Integer getHeadUserIdByDept(String dept) {
        return userRepo.findHeadUserIdByDept(dept);
    }
      // Evaluators for 3rd and 5th Month Details

//    public List<UserEntity> getEligibleEvaluatorsDetailsFor3rdMonth() {
//        return userRepo.getUsersDetailsFor3rdMonthEvaluation();
//    }
//    public List<UserEntity> getEligibleEvaluatorsDetailsFor5thMonth() {
//        return userRepo.getUsersDetailsFor5thMonthEvaluation();
//    }



    //adi dashboard methods
    //get 3rd month emp count
    public Integer getThirdMonthEmpCount(){
        return userRepo.countThirdMonthEmployees();
    }
    //get 5th month emp count
    public Integer getFifthMonthEmpCount(){
        return userRepo.countFifthMonthEmployees();
    }
    //get regular emp count
    public Integer getRegularEmpCount(){
        return userRepo.countRegularEmployees();
    }
    //get list of users who are 3rd probationary
    public List<ThirdAndFifthProbeDTO> getAll3rdMonthProbeEmp (String probeStatus){
        List<UserEntity> userList = userRepo.findAllByProbeStatusAndIsDeleted(probeStatus, 0);
        List<ThirdAndFifthProbeDTO> userDTOList = new ArrayList<>();

        for(UserEntity user : userList){
            ThirdAndFifthProbeDTO dto = new ThirdAndFifthProbeDTO(
                    user.getUserID(),
                    user.getfName(),
                    user.getlName(),
                    user.getDept(),
                    user.getPosition(),
                    user.getDateHired()
            );
            userDTOList.add(dto);
        }
        return userDTOList;
    }

    public List<ThirdAndFifthProbeDTO> getAll5thMonthProbeEmp (String probeStatus){
        List<UserEntity> userList = userRepo.findAllByProbeStatusAndIsDeleted(probeStatus, 0);
        List<ThirdAndFifthProbeDTO> userDTOList = new ArrayList<>();

        for(UserEntity user : userList){
            ThirdAndFifthProbeDTO dto = new ThirdAndFifthProbeDTO(
                    user.getUserID(),
                    user.getfName(),
                    user.getlName(),
                    user.getDept(),
                    user.getPosition(),
                    user.getDateHired()
            );
            userDTOList.add(dto);
        }
        return userDTOList;
    }

    public UserCountDTO getUserCountsByDept(String department){
        int countOf3MonthProbe = userRepo.countByProbeStatusAndDept("3rd Probationary", department);
        int countOf5MonthProbe = userRepo.countByProbeStatusAndDept("5th Probationary", department);
        int countOfRegEmp = userRepo.countByEmpStatusAndDept("Regular", department);

        return new UserCountDTO(department, countOf3MonthProbe, countOf5MonthProbe, countOfRegEmp);
    }

    public List<UserCountDTO> getEmployeeCountsByDepartments(String[] departmentNames) {
        List<UserCountDTO> userCounts = new ArrayList<>();

        for (String deptName : departmentNames) {
            int countOf3MonthProbe = userRepo.countByProbeStatusAndDept("3rd Probationary", deptName);
        int countOf5MonthProbe = userRepo.countByProbeStatusAndDept("5th Probationary", deptName);
        int countOfRegEmp = userRepo.countByEmpStatusAndDept("Regular", deptName);

            userCounts.add(new UserCountDTO(deptName, countOf3MonthProbe, countOf5MonthProbe, countOfRegEmp));
        }

        return userCounts;
    }


    //Check if 3rd Results is sent checkinn...
    public void update3rdEvaluationStatus(int userId, boolean status) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new NoSuchElementException("User " + userId + " not found."));
        user.setIs3rdEvalComplete(status);
        userRepo.save(user);
    }

    //Check if 5th Results is sent
    public void update5thEvaluationStatus(int userId, boolean status) {
        UserEntity user = userRepo.findById(userId).orElseThrow(() -> new NoSuchElementException("User " + userId + " not found."));
        user.setIs5thEvalComplete(status);
        userRepo.save(user);
    }

    public void promoteTo5thProbationary(int userId) {
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new NoSuchElementException("User " + userId + " not found."));

        // Check if the user is currently in 3rd Probationary
        if ("3rd Probationary".equals(user.getProbeStatus())) {
            // Update the probe status to 5th Probationary
            user.setProbeStatus("5th Probationary");

            // Save the updated user entity to the database
            userRepo.save(user);
        } else {
            throw new IllegalStateException("User is not in 3rd Probationary status.");
        }

    }

}
