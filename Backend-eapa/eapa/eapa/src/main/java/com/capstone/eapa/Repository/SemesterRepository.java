package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.SemesterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SemesterRepository extends JpaRepository<SemesterEntity, Integer> {
    List<SemesterEntity> findAllByOrderById();
}
