package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.UserEntity;


import org.springframework.data.jpa.repository.JpaRepository;

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
}
