package com.relief.disasterrelief.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.relief.disasterrelief.model.Request;
import com.relief.disasterrelief.model.User;

public interface RequestRepository extends JpaRepository<Request, Long> {
    // Add this method to find requests by requester id
    List<Request> findByRequester_Id(Long requesterId);
 // In RequestRepository.java
    List<Request> findByAssignedVolunteerId(Long volunteerId);
    List<Request> findByAssignedVolunteer(User volunteer);


}
