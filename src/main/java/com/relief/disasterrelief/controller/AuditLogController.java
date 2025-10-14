package com.relief.disasterrelief.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.relief.disasterrelief.model.AuditLog;
import com.relief.disasterrelief.repository.AuditLogRepository;

@RestController
@RequestMapping("/api/audit")
public class AuditLogController {
    @Autowired
    private AuditLogRepository repo;

    @GetMapping("/user")
    public List<AuditLog> getLogs(@RequestParam Long userId) {
        return repo.findByUserId(userId);
    }
}
