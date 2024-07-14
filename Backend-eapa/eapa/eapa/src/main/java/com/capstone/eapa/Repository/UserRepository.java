package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.Role;
import com.capstone.eapa.Entity.UserEntity;


import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.jpa.repository.Query;
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
}
