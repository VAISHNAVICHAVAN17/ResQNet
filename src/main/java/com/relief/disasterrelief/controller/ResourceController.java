package com.relief.disasterrelief.controller;

import com.relief.disasterrelief.model.Resource;
import com.relief.disasterrelief.model.User;
import com.relief.disasterrelief.repository.ResourceRepository;
import com.relief.disasterrelief.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "http://localhost:3000")
public class ResourceController {

    @Autowired
    private ResourceRepository resourceRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<Resource> createResource(@RequestBody Resource resource) {
        if (resource.getNgo() == null || resource.getNgo().getId() == null) {
            return ResponseEntity.badRequest().body(null);
        }
        User ngo = userRepository.findById(resource.getNgo().getId())
                .orElseThrow(() -> new RuntimeException("NGO not found"));
        resource.setNgo(ngo);
        Resource savedResource = resourceRepository.save(resource);
        return ResponseEntity.ok(savedResource);
    }

    @GetMapping
    public List<Resource> getResources() {
        return resourceRepository.findAll();
    }
}
