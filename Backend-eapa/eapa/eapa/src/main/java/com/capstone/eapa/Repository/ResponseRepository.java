
package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.QuestionEntity;
import com.capstone.eapa.Entity.ResponseEntity;
import com.capstone.eapa.Entity.UserEntity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResponseRepository extends JpaRepository<ResponseEntity, Integer> {

    @Query(value = "SELECT * FROM tblresponse resp WHERE resp.is_deleted = 0", nativeQuery = true)
    List<ResponseEntity> findAllResponse();

    List<ResponseEntity> findByEvaluation_EvalID(int evaluationID);

    Optional<ResponseEntity> findByUser_UserIDAndQuestion_QuesID(int userID, int quesID);
     
    List<ResponseEntity> findByUser_UserID(int userID);


}
