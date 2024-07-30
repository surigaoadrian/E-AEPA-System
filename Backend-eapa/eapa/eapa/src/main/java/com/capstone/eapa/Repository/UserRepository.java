package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.Role;
import com.capstone.eapa.Entity.UserEntity;


import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    boolean existsByUsernameAndIsDeleted(String username, int isDeleted);
    Optional<UserEntity> findByUsername(String username);
    Optional<UserEntity> findByUsernameAndIsDeleted(String username, int isDeleted);
    boolean existsByWorkEmailAndIsDeleted(String email, int isDeleted);
    UserEntity findByWorkEmail(String email);
    Optional<UserEntity> findByUserID(int userID);
    List<UserEntity> findAllByIsDeleted(int isDeleted);
    //Peer randomizer
//    List<UserEntity> findByDeptAndRoleNotAndUserIDNot(String dept, Role role, int userID);
    @Query(value = "SELECT * FROM tbluser WHERE department = :dept AND role <> :role AND userID <> :userID AND LOWER(position) <> 'secretary' AND is_deleted = 0", nativeQuery = true)
    List<UserEntity> findPeersByDeptRoleNotUserIDNotAndPositionNotSecretary(String dept, String role, int userID);

    //Track Employee 
//    List<UserEntity> findByDeptIn(List<String> deptNames);

    @Query("SELECT COUNT(u) FROM UserEntity u WHERE u.empStatus = 'Probationary' OR u.isProbationary = true")
    long countByIsProbationaryTrue();

    //get all employees  | This can be removed only used for visualization.
    @Query("SELECT COUNT(u) FROM UserEntity u WHERE u.isDeleted = 0")
    long countTotalEmployees();

    //count Regular Employees
    @Query("SELECT COUNT(u) FROM UserEntity u WHERE u.empStatus = 'Regular'")
    long countRegularEmployees();


    @Query("SELECT u.userID FROM UserEntity u WHERE u.role = 'HEAD' AND u.dept = :dept AND u.isDeleted = 0")
    Integer findHeadUserIdByDept(@Param("dept") String dept);

    
    // get count users  For 3rd, 5th and Annual Month Eval.

    @Query(value = "SELECT u.userID " +
            "FROM tbluser u " +
            "WHERE u.`Employment Status` = 'Probationary' " +
            "AND DATEDIFF(CURDATE(), STR_TO_DATE(u.`Date Hired`, '%Y-%m-%d')) <= 90",
            nativeQuery = true)
    List<Long> getUsersFor3rdMonthEvaluation();

    @Query(value = "SELECT u.userID " +
            "FROM tbluser u " +
            "WHERE u.`Employment Status` = 'Probationary' " +
            "AND DATEDIFF(CURDATE(), STR_TO_DATE(u.`Date Hired`, '%Y-%m-%d')) BETWEEN 121 AND 150",
            nativeQuery = true)
    List<Long> getUsersFor5thMonthEvaluation();

    @Query(value = "SELECT u.userID " +
            "FROM tbluser u " +
            "WHERE u.`Employment Status` = 'Probationary' " +
            "AND DATEDIFF(CURDATE(), STR_TO_DATE(u.`Date Hired`, '%Y-%m-%d')) BETWEEN 335 AND 395",
            nativeQuery = true)
    List<Long> getUsersForAnnualEvaluation();

// Users Details | Upcoming Evaluators for 3rd and 5th Month
    @Query(value = "SELECT u.* " +
            "FROM tbluser u " +
            "WHERE u.`Employment Status` = 'Probationary' " +
            "AND DATEDIFF(CURDATE(), STR_TO_DATE(u.`Date Hired`, '%Y-%m-%d')) <= 90",
            nativeQuery = true)
    List<UserEntity> getUsersDetailsFor3rdMonthEvaluation();

    @Query(value = "SELECT u.* " +
            "FROM tbluser u " +
            "WHERE u.`Employment Status` = 'Probationary' " +
            "AND DATEDIFF(CURDATE(), STR_TO_DATE(u.`Date Hired`, '%Y-%m-%d')) BETWEEN 121 AND 150",
            nativeQuery = true)
    List<UserEntity> getUsersDetailsFor5thMonthEvaluation();


}
