package com.relief.disasterrelief.controller;

import com.relief.disasterrelief.model.Request;
import com.relief.disasterrelief.model.User;
import com.relief.disasterrelief.repository.RequestRepository;
import com.relief.disasterrelief.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requester")
@CrossOrigin(origins = "http://localhost:3000")
public class RequesterController {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    // Updated consumes to application/json for media type support
    @PostMapping(value = "/requests", consumes = { "application/json", "application/json;charset=UTF-8" })
    public ResponseEntity<Request> createRequest(@RequestParam Long requesterId, @RequestBody Request request) {
        User requester = userRepository.findById(requesterId).orElse(null);
        if (requester == null) {
            return ResponseEntity.badRequest().build();
        }
        // If no location is provided, set it from the user's address
        if (request.getLocation() == null || request.getLocation().trim().isEmpty()) {
            request.setLocation(requester.getAddress());
        }
        request.setRequester(requester);
        request.setStatus("PENDING"); // Set default status if needed
        Request savedRequest = requestRepository.save(request);
        return ResponseEntity.ok(savedRequest);
    }


    @GetMapping("/requests")
    public ResponseEntity<List<Request>> getRequestsByRequester(@RequestParam Long requesterId) {
        return ResponseEntity.ok(requestRepository.findByRequester_Id(requesterId));
    }
}
