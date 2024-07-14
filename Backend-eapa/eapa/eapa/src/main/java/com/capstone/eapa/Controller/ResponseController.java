
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
    public List<ResponseEntity> createResponses (@RequestBody List<ResponseEntity> responses) {
        return resServ.createResponse(responses);
    }

    @GetMapping("/getAllResponses")
    public List<ResponseEntity> getAllResponses(){
        return resServ.getAllResponse();
    }

}
