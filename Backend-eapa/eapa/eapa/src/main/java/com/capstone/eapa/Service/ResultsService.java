package com.capstone.eapa.Service;

import com.capstone.eapa.Entity.*;
import com.capstone.eapa.Repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ResultsService {
    @Autowired
    private ResultsRepository resultRepo;
    @Autowired
    private ResponseRepository respRepo;
    @Autowired
    private JobBasedResponseRepository jobRespRepo;
    @Autowired
    private QuestionRepository quesRepo;
    @Autowired
    private EvaluationRepository evalRepo;


    //creating results
    public ResultsEntity calculateAndSaveResults(int evaluationID) {
        Optional<EvaluationEntity> evaluationOpt = evalRepo.findById(evaluationID);
        if (!evaluationOpt.isPresent()) {
            throw new RuntimeException("Evaluation not found with id: " + evaluationID);
        }

        EvaluationEntity evaluation = evaluationOpt.get();
        List<ResponseEntity> responses = respRepo.findByEvaluation_EvalID(evaluationID);

        double cultureOfExcellenceAverage = calculateAverage(responses, "CULTURE OF EXCELLENCE");
        double integrityAverage = calculateAverage(responses, "INTEGRITY");
        double teamworkAverage = calculateAverage(responses, "TEAMWORK");
        double universalityAverage = calculateAverage(responses, "UNIVERSALITY");

        ResultsEntity result = new ResultsEntity(
                evaluation.getUser(),
                cultureOfExcellenceAverage,
                integrityAverage,
                teamworkAverage,
                universalityAverage,
                0, // jobRespAverage
                evaluation.getEvalType(),
                evaluation.getPeriod(),
                evaluation.getStage(),
                0
        );

        return resultRepo.save(result);
    }

    // Method for calculating and saving results based on job responses
    public ResultsEntity calculateAndSaveJobResults(int evaluationID) {
        Optional<EvaluationEntity> evaluationOpt = evalRepo.findById(evaluationID);
        if (!evaluationOpt.isPresent()) {
            throw new RuntimeException("Evaluation not found with id: " + evaluationID);
        }

        EvaluationEntity evaluation = evaluationOpt.get();
        List<JobBasedResponseEntity> jobResponses = jobRespRepo.findByEvaluation_EvalID(evaluationID);

        double jobRespAverage = calculateJobAverage(jobResponses);

        ResultsEntity result = new ResultsEntity(
                evaluation.getUser(),
                0, // cultureOfExcellenceAverage
                0, // integrityAverage
                0, // teamworkAverage
                0, // universalityAverage
                jobRespAverage,
                evaluation.getEvalType(),
                evaluation.getPeriod(),
                evaluation.getStage(),
                0
        );

        return resultRepo.save(result);
    }

    //calculate values based average
    private double calculateAverage(List<ResponseEntity> responses, String category) {
        List<ResponseEntity> filteredResponses = responses.stream()
                .filter(response -> {
                    Optional<QuestionEntity> questionOpt = quesRepo.findById(response.getQuestion().getQuesID());
                    return questionOpt.isPresent() && category.equals(questionOpt.get().getCategory());
                })
                .collect(Collectors.toList());

        return filteredResponses.stream().mapToInt(ResponseEntity::getScore).average().orElse(0.0);
    }

    //calculate job based response average
    private double calculateJobAverage(List<JobBasedResponseEntity> jobResponses) {
        int totalScore = 0;
        int count = 0;
        for (JobBasedResponseEntity response : jobResponses) {
            totalScore += response.getScore();
            count++;
        }
        return count > 0 ? (double) totalScore / count : 0;
    }


}
