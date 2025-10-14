package com.relief.disasterrelief.repository;

import com.relief.disasterrelief.model.Allocation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AllocationRepository extends JpaRepository<Allocation, Long> {
}
