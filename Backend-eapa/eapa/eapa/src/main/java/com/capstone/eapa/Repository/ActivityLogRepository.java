package com.capstone.eapa.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.capstone.eapa.Entity.ActivityLogEntity;
import com.capstone.eapa.Entity.UserEntity;
import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLogEntity, Integer> {
    List<ActivityLogEntity> findAllByUser(UserEntity user);
}
