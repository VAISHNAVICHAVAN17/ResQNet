package com.relief.disasterrelief.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/verify")
@CrossOrigin(origins = "http://localhost:3000")
public class VerificationController {
    @GetMapping("/aadhar/{number}")
    public ResponseEntity<?> verifyAadhar(@PathVariable String number) {
        Map<String, Object> data = new HashMap<>();
        data.put("name", "Aadhar User");
        data.put("dob", "1995-07-15");
        data.put("address", "Bihar, India");
        return ResponseEntity.ok(data);
    }

    @GetMapping("/pan/{number}")
    public ResponseEntity<?> verifyPan(@PathVariable String number) {
        Map<String, Object> data = new HashMap<>();
        data.put("orgName", "NGO Org Pvt Ltd");
        data.put("address", "Delhi, India");
        return ResponseEntity.ok(data);
    }
}
