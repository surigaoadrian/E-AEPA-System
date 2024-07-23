package com.capstone.eapa.Service;



import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import com.capstone.eapa.Entity.ActivityLogEntity;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.ActivityLogRepository;
import com.capstone.eapa.Repository.UserRepository;

@Service
public class ActivityLogService {
        @Autowired
    private ActivityLogRepository activityLogRepo;
    @Autowired
    private UserRepository userRepo;

    public List<ActivityLogEntity> getAllActivityLogs() {
        return activityLogRepo.findAll();
    }
    
    public List<ActivityLogEntity> getAllActivityLogsByAdmin(int adminId) {
        UserEntity admin = userRepo.findByUserID(adminId).orElseThrow(() -> new RuntimeException("User not found"));
        return activityLogRepo.findAllByUser(admin);
    }

}
