package com.relief.disasterrelief.controller;

import com.relief.disasterrelief.model.*;
import com.relief.disasterrelief.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/allocations")
public class AllocationController {

    @Autowired
    private AllocationRepository allocationRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private ResourceRepository resourceRepository;

    // ➕ Allocate resource to request
    @PostMapping
    public Allocation allocate(@RequestParam Long requestId,
                               @RequestParam Long resourceId,
                               @RequestParam int quantity) {

        Request req = requestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        Resource res = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        if (res.getQuantity() < quantity) {
            throw new RuntimeException("Not enough resource available");
        }

        // Deduct from resource stock
        res.setQuantity(res.getQuantity() - quantity);
        resourceRepository.save(res);

        // Create allocation
        Allocation alloc = new Allocation(resourceId, req, res, quantity, null);
        alloc.setRequest(req);
        alloc.setResource(res);
        alloc.setAllocatedQuantity(quantity);
        alloc.setStatus("ALLOCATED");

        // Update request status
        req.setStatus("APPROVED");
        requestRepository.save(req);

        return allocationRepository.save(alloc);
    }

    // 📋 Get all allocations
    @GetMapping
    public List<Allocation> getAllAllocations() {
        return allocationRepository.findAll();
    }
}
