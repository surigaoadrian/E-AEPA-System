package com.capstone.eapa.Controller;

import com.capstone.eapa.DTO.UpdateCommentRequest;
import com.capstone.eapa.Entity.HeadCommentsEntity;
import com.capstone.eapa.Entity.QuestionEntity;
import com.capstone.eapa.Entity.UserEntity;
import com.capstone.eapa.Service.HeadCommentsService;
import com.capstone.eapa.Repository.QuestionRepository;
import com.capstone.eapa.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.List;

@RestController
@RequestMapping("/headcomments")
@CrossOrigin(origins = "*")
public class HeadCommentsController {

    @Autowired
    private HeadCommentsService headCommentsService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private QuestionRepository questionRepository;

    // Create a new comment
    @PostMapping("/createHeadComment")
    public ResponseEntity<?> addComment(@RequestBody HeadCommentsEntity comment) {
        // Validate and fetch `userID`
        Optional<UserEntity> evaluatee = userRepository.findById(comment.getUserID().getUserID());
        if (evaluatee.isEmpty()) {
            return ResponseEntity.badRequest().body("Evaluatee not found for user_id: " + comment.getUserID().getUserID());
        }

        // Validate and fetch `headID`
        Optional<UserEntity> evaluator = userRepository.findById(comment.getHeadID().getUserID());
        if (evaluator.isEmpty()) {
            return ResponseEntity.badRequest().body("Evaluator not found for head_id: " + comment.getHeadID().getUserID());
        }

        // Validate and fetch `quesID`
        Optional<QuestionEntity> question = questionRepository.findById(comment.getQuestion().getQuesID());
        if (question.isEmpty()) {
            return ResponseEntity.badRequest().body("Question not found for quesID: " + comment.getQuestion().getQuesID());
        }

        // Set the validated entities
        comment.setUserID(evaluatee.get());
        comment.setHeadID(evaluator.get());
        comment.setQuestion(question.get());

        // Save and return the comment
        HeadCommentsEntity savedComment = headCommentsService.addComment(comment);
        return ResponseEntity.ok(savedComment);
    }

    // Update an existing comment
    @PutMapping("/updateHeadComment/{id}")
    public ResponseEntity<HeadCommentsEntity> updateComment(
            @PathVariable int id,
            @RequestBody UpdateCommentRequest updateRequest) {
        HeadCommentsEntity updated = headCommentsService.updateComment(id, updateRequest);
        return ResponseEntity.ok(updated);
    }


    // Retrieve comments for a specific evaluatee
    @GetMapping("/getHeadComments/{userId}")
    public ResponseEntity<List<HeadCommentsEntity>> getCommentsForEvaluatee(@PathVariable int userId) {
        List<HeadCommentsEntity> comments = headCommentsService.getCommentsForEvaluatee(userId);
        return ResponseEntity.ok(comments);
    }

    // Retrieve comments by period, school year, and semester
    @GetMapping("/filteredcomments")
    public ResponseEntity<List<HeadCommentsEntity>> getFilteredComments(
            @RequestParam int userID,
            @RequestParam String period,
            @RequestParam String schoolYear,
            @RequestParam String semester) {
        List<HeadCommentsEntity> comments = headCommentsService.getFilteredComments(userID, period, schoolYear, semester);
        return ResponseEntity.ok(comments);
    }

    // Soft delete a comment
    @DeleteMapping("/deleteHeadComment/{id}")
    public ResponseEntity<Void> softDeleteComment(@PathVariable int id) {
        headCommentsService.softDeleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
