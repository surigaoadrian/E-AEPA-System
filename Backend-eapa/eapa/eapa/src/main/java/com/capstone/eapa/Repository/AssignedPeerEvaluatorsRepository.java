package com.capstone.eapa.Repository;

import org.springframework.data.jpa.repository.JpaRepository;


import com.capstone.eapa.Entity.AssignedPeerEvaluators;

import java.util.List;

public interface AssignedPeerEvaluatorsRepository extends JpaRepository<AssignedPeerEvaluators, Integer>{
     List<AssignedPeerEvaluators> findAll();


}
