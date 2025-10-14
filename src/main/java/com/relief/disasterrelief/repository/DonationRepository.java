package com.relief.disasterrelief.repository;

import com.relief.disasterrelief.model.Donation;
import com.relief.disasterrelief.model.Request;
import com.relief.disasterrelief.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long> {
    
    // Add this method to link donations to requests
    Donation findTopByRequestOrderByIdDesc(Request request);
    List<Donation> findByNgo(User ngo);
    List<Donation> findByProvider(User provider);
    

    @Query("SELECT d FROM Donation d LEFT JOIN FETCH d.provider LEFT JOIN FETCH d.ngo WHERE d.assignedVolunteer = :vol")
    List<Donation> findWithDetailsByAssignedVolunteer(@Param("vol") User volunteer);
	Donation findTopByResourceTypeAndQuantityAndStatusAndAssignedVolunteer(String resourceType, int quantity,
			String status, User volunteer);
}
