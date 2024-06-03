package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.ResultsEntity;

import org.hibernate.mapping.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResultsRepository extends JpaRepository<ResultsEntity, Integer> {
    
}
