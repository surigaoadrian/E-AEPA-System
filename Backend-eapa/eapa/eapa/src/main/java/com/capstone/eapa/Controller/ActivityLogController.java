package com.capstone.eapa.Controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.capstone.eapa.Entity.ActivityLogEntity;
import org.springframework.http.ResponseEntity;
import com.capstone.eapa.Service.ActivityLogService;

@RestController
@RequestMapping("/activityLog")
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityLogController {
        @Autowired
    private ActivityLogService activityLogService;

    @GetMapping("/ActivityLog")
    public ResponseEntity<List<ActivityLogEntity>> getAllActivityLogs() {
        List<ActivityLogEntity> logs = activityLogService.getAllActivityLogs();
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/ActivityLogByAdmin/{adminId}")
    public ResponseEntity<List<ActivityLogEntity>> getAllActivityLogsByAdmin(@PathVariable int adminId) {
        List<ActivityLogEntity> logs = activityLogService.getAllActivityLogsByAdmin(adminId);
        return ResponseEntity.ok(logs);
    }
    
}
