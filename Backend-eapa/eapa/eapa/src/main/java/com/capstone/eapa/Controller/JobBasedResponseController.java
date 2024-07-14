
package com.capstone.eapa.Controller;

import com.capstone.eapa.Entity.JobBasedResponseEntity;
import com.capstone.eapa.Service.JobBasedResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobbasedresponse")
@CrossOrigin(origins = "*")
public class JobBasedResponseController {
    @Autowired
    JobBasedResponseService jbrespServ;

    @PostMapping("/createResponses")
    public List<JobBasedResponseEntity> createResponses (@RequestBody List<JobBasedResponseEntity> responses) {
        return jbrespServ.createResponse(responses);
    }

    @GetMapping("getAllResponses")
    public List<JobBasedResponseEntity> getAllResponses(){
        return jbrespServ.getAllResponse();
    }

    //get responses using userId
    @GetMapping("getAllResponsesByID/{userID}")
    public List<String> getAllResponsesByID(@PathVariable int userID) {
        return jbrespServ.getAllResponseByID(userID);
    }


}
