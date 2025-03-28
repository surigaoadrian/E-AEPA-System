package com.capstone.eapa.Service;

import com.capstone.eapa.DTO.UpdateCommentRequest;
import com.capstone.eapa.Entity.HeadCommentsEntity;
import com.capstone.eapa.Entity.QuestionEntity;
import com.capstone.eapa.Repository.HeadCommentsRepository;
import com.capstone.eapa.Repository.QuestionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class HeadCommentsService {

    @Autowired
    private HeadCommentsRepository headCommentsRepository;

    @Autowired
    private QuestionRepository questionRepository;  

    // Add a new comment
    public HeadCommentsEntity addComment(HeadCommentsEntity comment) {
        return headCommentsRepository.save(comment);
    }

    // Update an existing comment
    public HeadCommentsEntity updateComment(int id, UpdateCommentRequest updateRequest) {
        // Retrieve the existing comment
        HeadCommentsEntity existingComment = headCommentsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found for ID: " + id));

        // Update the comment text
        existingComment.setComment(updateRequest.getComment());

        // Retrieve the question associated with the given quesID
        Integer quesID = updateRequest.getQuesID();
        Optional<QuestionEntity> question = questionRepository.findById(quesID);
        if (question.isEmpty()) {
            throw new RuntimeException("Question not found for quesID: " + quesID);
        }

        // Set the updated question to the comment
        existingComment.setQuestion(question.get());

        // Save the updated comment
        return headCommentsRepository.save(existingComment);
    }



    // Get comments for a specific evaluatee
    public List<HeadCommentsEntity> getCommentsForEvaluatee(int userId) {
        return headCommentsRepository.findByUserID_UserIDAndIsDeleted(userId, 0);
    }

    // Get filtered comments by period, school year, and semester
    public List<HeadCommentsEntity> getFilteredComments(int userID, String period, String schoolYear, String semester) {
        return headCommentsRepository.findByUserID_UserIDAndPeriodAndSchoolYearAndSemesterAndIsDeleted(userID, period, schoolYear, semester, 0);
    }

    // Soft delete a comment
    public void softDeleteComment(int id) {
        HeadCommentsEntity comment = headCommentsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Comment not found for ID: " + id));
        comment.setIsDeleted(1);
        headCommentsRepository.save(comment);
    }
}


