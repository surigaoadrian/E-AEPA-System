package com.capstone.eapa.Controller;

import com.capstone.eapa.Entity.AssignedPeersEntity;
import com.capstone.eapa.Service.AssignedPeersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/assignedPeers")
@CrossOrigin(origins = "*")
public class AssignedPeersController {
    @Autowired
    AssignedPeersService apServ;

    @PostMapping("/createAssignedPeers")
    public AssignedPeersEntity createAssignedPeers(@RequestBody AssignedPeersEntity assignedPeers) {
        return apServ.createAssignedPeers(assignedPeers);
    }

    @GetMapping("/getAssignedPeers")
    public List<AssignedPeersEntity> getAssignedPeers(){
        return apServ.getAllAssignedPeers();
    }

}
