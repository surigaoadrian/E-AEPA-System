package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.AssignedPeerEvaluators;
import com.capstone.eapa.Entity.AssignedPeersEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignedPeersRepository extends JpaRepository<AssignedPeersEntity, Integer> {
    @Query(value = "SELECT * FROM tblassignedpeers ap WHERE ap.is_deleted = 0", nativeQuery = true)
    List<AssignedPeersEntity> findAllAssignedPeers();

    @Query(value = "SELECT id FROM assigned_evaluators WHERE evaluator_id = :evaluatorId AND assigned_peers_id = :assignedPeersId", nativeQuery = true)
    Integer findIdByEvaluatorAndAssignedPeers(int evaluatorId, int assignedPeersId);

    @Query(value = "SELECT id FROM tblassignedpeers WHERE period = ?1 AND evaluatee_id = ?2", nativeQuery = true)
    Integer findIdByPeriodAndEvaluateeId(String period, int evaluateeId);

    @Transactional
    @Modifying
    @Query(value = "UPDATE assigned_evaluators SET status = ?2 WHERE id = ?1", nativeQuery = true)
    void updateStatusById(int id, String status);

    @Query(value = "SELECT evaluator_id FROM assigned_evaluators WHERE assigned_peers_id = :assignedPeersId", nativeQuery = true)
    List<Integer> findEvaluatorIdsByAssignedPeersId(int assignedPeersId);

}
