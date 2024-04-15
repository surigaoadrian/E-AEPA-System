package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.PasswordResetToken;
import com.capstone.eapa.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    PasswordResetToken findByToken(String token);
    PasswordResetToken findByUser(UserEntity user);
}
