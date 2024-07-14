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


    //values based
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
                evaluation.getPeer(),
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
                evaluation.getPeer(),
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

//    //calculate values based average
//    private double calculateAverage(List<ResponseEntity> responses, String category) {
//        List<ResponseEntity> filteredResponses = responses.stream()
//                .filter(response -> {
//                    Optional<QuestionEntity> questionOpt = quesRepo.findById(response.getQuestion().getQuesID());
//                    return questionOpt.isPresent() && category.equals(questionOpt.get().getCategory());
//                })
//                .collect(Collectors.toList());
//
//        return filteredResponses.stream().mapToInt(ResponseEntity::getScore).average().orElse(0.0);
//    }
//
//    //calculate job based response average
//    private double calculateJobAverage(List<JobBasedResponseEntity> jobResponses) {
//        int totalScore = 0;
//        int count = 0;
//        for (JobBasedResponseEntity response : jobResponses) {
//            totalScore += response.getScore();
//            count++;
//        }
//        return count > 0 ? (double) totalScore / count : 0;
//    }
//
//    // Method to get averages
//    public ResultsEntity getAverages(int userId, String evalType, String stage, String period) {
//        return resultRepo.findByUser_UserIDAndEvalTypeAndStageAndPeriod(userId, evalType, stage, period);
//    }
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

    // Method to get averages for SELF (VALUES and JOB)
    public ResultsEntity getAverages(int userId, String evalType, String stage, String period) {
        return resultRepo.findByUser_UserIDAndEvalTypeAndStageAndPeriod(userId, evalType, stage, period);
    }

    // Method to get jobRespAverage where emp_id, evalType = "HEAD", and stage = "JOB"
    public double getJobRespAverageByEmpIdAndEvalType(int empId) {
        ResultsEntity result = resultRepo.findByEmp_UserIDAndEvalTypeAndStage(empId, "HEAD", "JOB");
        if (result != null) {
            return result.getJobRespAverage();
        } else {
            throw new RuntimeException("No result found for emp_id: " + empId + " with evalType: HEAD and stage: JOB");
        }
    }

    // Method to get cultureOfExcellenceAverage, integrityAverage, teamworkAverage, universalityAverage
    // where emp_id, evalType = "HEAD", and stage = "VALUES"
    public ResultsEntity getValuesAveragesByEmpIdAndEvalType(int empId) {
        ResultsEntity result = resultRepo.findByEmp_UserIDAndEvalTypeAndStage(empId, "HEAD", "VALUES");
        if (result != null) {
            return result;
        } else {
            throw new RuntimeException("No result found for emp_id: " + empId + " with evalType: HEAD and stage: VALUES");
        }
    }

//    // Method to get cultureOfExcellenceAverage, integrityAverage, teamworkAverage, universalityAverage
//    // where emp_id, evalType = "PEER", and stage = "VALUES"
//    public ResultsEntity getValuesAveragesForPeer(int empId) {
//        ResultsEntity result = resultRepo.findByEmp_UserIDAndEvalTypeAndStage(empId, "PEER", "VALUES");
//        if (result != null) {
//            return result;
//        } else {
//            throw new RuntimeException("No result found for emp_id: " + empId + " with evalType: PEER and stage: VALUES");
//        }
//    }

    // Method to get a list of results where evalType = "PEER", stage = "VALUES", and emp_id
    public List<ResultsEntity> getAllPeerResponsesByEmpID(int empId) {
        return resultRepo.findAllByEmp_UserIDAndEvalTypeAndStage(empId, "PEER", "VALUES");
    }




}
