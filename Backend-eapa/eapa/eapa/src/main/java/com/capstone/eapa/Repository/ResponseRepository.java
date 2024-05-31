package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.QuestionEntity;
import com.capstone.eapa.Entity.ResponseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResponseRepository extends JpaRepository<ResponseEntity, Integer> {

    @Query(value = "SELECT * FROM tblresponse resp WHERE resp.is_deleted = 0", nativeQuery = true)
    List<ResponseEntity> findAllResponse();
}
