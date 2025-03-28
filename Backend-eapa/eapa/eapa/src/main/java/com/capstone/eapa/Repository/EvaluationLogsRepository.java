package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.EvaluationEntity;
import com.capstone.eapa.Entity.EvaluationLogsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EvaluationLogsRepository extends JpaRepository<EvaluationLogsEntity, Integer> {
    @Query("SELECT e FROM EvaluationLogsEntity e WHERE e.user.id = :userId")
    List<EvaluationLogsEntity> findByUserID(@Param("userId") int userId);

}
