package com.capstone.eapa.Service;

import com.capstone.eapa.Entity.AssignedPeersEntity;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Repository.AssignedPeersRepository;
import com.capstone.eapa.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AssignedPeersService {
    @Autowired
    AssignedPeersRepository apRepo;

    @Autowired
    UserRepository userRepo;

    //create asssigned peers
    public AssignedPeersEntity createAssignedPeers(AssignedPeersEntity assignedPeers){
        Optional<UserEntity> evaluatee = userRepo.findByUserID(assignedPeers.getEvaluatee().getUserID());
        //for peers

        if(evaluatee.isPresent()){
            assignedPeers.setEvaluatee(evaluatee.get());
        } else {
            throw new RuntimeException("User not found with id: " + assignedPeers.getEvaluatee().getUserID());
        }

        // Fetch and set peers
        List<UserEntity> peers = assignedPeers.getPeers();

        for (int i = 0; i < peers.size(); i++) {
            Optional<UserEntity> peer = userRepo.findById(peers.get(i).getUserID());
            if (peer.isPresent()) {
                peers.set(i, peer.get());
            } else {
                throw new RuntimeException("Peer not found with id: " + peers.get(i).getUserID());
            }
        }
        assignedPeers.setPeers(peers);

        return apRepo.save(assignedPeers);
    }

    //get all assigned peers
    public List<AssignedPeersEntity> getAllAssignedPeers() {
        return apRepo.findAllAssignedPeers();
    }
}
