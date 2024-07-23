package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.AssignedPeersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignedPeersRepository extends JpaRepository<AssignedPeersEntity, Integer> {
    @Query(value = "SELECT * FROM tblassignedpeers ap WHERE ap.is_deleted = 0", nativeQuery = true)
    List<AssignedPeersEntity> findAllAssignedPeers();
}
