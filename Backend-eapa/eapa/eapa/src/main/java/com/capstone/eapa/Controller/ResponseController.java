package com.capstone.eapa.Controller;

import com.capstone.eapa.Entity.ResponseEntity;
import com.capstone.eapa.Service.ResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/response")
@CrossOrigin(origins = "*")
public class ResponseController {
    @Autowired
    ResponseService resServ;

    @PostMapping("/createResponses")
    public List<ResponseEntity> createResponses(@RequestBody List<ResponseEntity> responses) {
        return resServ.createResponse(responses);
    }

    @GetMapping("/getAllResponses")
    public List<ResponseEntity> getAllResponses() {
        return resServ.getAllResponse();
    }

    @PostMapping("/createHeadComment")
    public ResponseEntity createHeadComment(@RequestBody ResponseEntity newComment) {
        return resServ.createHeadComment(newComment);
    }

    @PutMapping("/updateHeadComment/{responseID}")
    public ResponseEntity updateHeadComment(@PathVariable int responseID, @RequestBody ResponseEntity updatedComment) {
        return resServ.updateHeadComment(responseID, updatedComment);
    }

    @GetMapping("/getHeadComments/{userID}")
    public List<ResponseEntity> getHeadComments(@PathVariable int userID) {
        return resServ.getHeadComments(userID);
    }

    @DeleteMapping("/deleteHeadComment/{responseID}")
    public void deleteHeadComment(@PathVariable int responseID) {
        resServ.deleteHeadComment(responseID);
    }


}
