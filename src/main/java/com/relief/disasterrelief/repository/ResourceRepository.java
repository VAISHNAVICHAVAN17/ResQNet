package com.relief.disasterrelief.repository;

import com.relief.disasterrelief.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResourceRepository extends JpaRepository<Resource, Long> {

    @Query("""
        SELECT r FROM Resource r
        WHERE (:type IS NULL OR LOWER(r.type) = LOWER(:type))
          AND (:location IS NULL OR LOWER(r.location) = LOWER(:location))
          AND (:ngoId IS NULL OR r.ngo.id = :ngoId)
        """)
    List<Resource> searchResources(
            @Param("type") String type,
            @Param("location") String location,
            @Param("ngoId") Long ngoId
    );
}
