package com.capstone.eapa.Repository;

import com.capstone.eapa.Entity.QuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<QuestionEntity, Integer> {
    @Query(value = "SELECT * FROM tblquestions ques WHERE ques.is_deleted = 0", nativeQuery = true)
    List<QuestionEntity> findAllQuestions();
}
