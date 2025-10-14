package com.relief.disasterrelief.controller;

import com.relief.disasterrelief.dto.ProviderAssignmentDTO;
import com.relief.disasterrelief.model.Donation;
import com.relief.disasterrelief.model.Request;
import com.relief.disasterrelief.model.User;
import com.relief.disasterrelief.repository.DonationRepository;
import com.relief.disasterrelief.repository.RequestRepository;
import com.relief.disasterrelief.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/volunteer")
@CrossOrigin(origins = "http://localhost:3000")
public class VolunteerController {

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DonationRepository donationRepository;

    @PutMapping("/assign")
    public ResponseEntity<Request> assignVolunteer(@RequestParam Long requestId, @RequestParam Long volunteerId) {
        Request request = requestRepository.findById(requestId).orElse(null);
        User volunteer = userRepository.findById(volunteerId).orElse(null);
        
        if (request == null || volunteer == null) {
            return ResponseEntity.badRequest().build();
        }
        
        request.setAssignedVolunteer(volunteer);
        request.setStatus("ASSIGNED");
        Request updatedRequest = requestRepository.save(request);
        return ResponseEntity.ok(updatedRequest);
    }

    // Fetch donations assigned to the volunteer
    @GetMapping("/donations")
    public List<ProviderAssignmentDTO> getDonationsForVolunteer(Principal principal) {
        User volunteer = userRepository.findByEmail(principal.getName()).orElse(null);
        if (volunteer == null) {
            return List.of();
        }
        List<Donation> donations = donationRepository.findWithDetailsByAssignedVolunteer(volunteer);
        return donations.stream().map(ProviderAssignmentDTO::new).toList();
    }


    // Fetch requests assigned to the volunteer (using logged-in principal)
    @GetMapping("/requests")
    public List<Request> getRequestsByVolunteer(Principal principal) {
        User volunteer = userRepository.findByEmail(principal.getName()).orElse(null);
        return requestRepository.findByAssignedVolunteer(volunteer);
    }
}
