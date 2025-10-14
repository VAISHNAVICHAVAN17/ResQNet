package com.relief.disasterrelief.controller;

import com.relief.disasterrelief.model.Request;
import com.relief.disasterrelief.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:3000")
public class RequestRestController {

    @Autowired
    private RequestRepository requestRepository;

    // For admin: get all requests in system, not filtered
    @GetMapping
    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }
}
