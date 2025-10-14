package com.relief.disasterrelief.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.relief.disasterrelief.model.AuditLog;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByUserId(Long userId);
}
