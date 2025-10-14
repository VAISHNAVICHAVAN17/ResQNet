package com.relief.disasterrelief.controller;

import com.relief.disasterrelief.dto.AssignmentDTO;
import com.relief.disasterrelief.model.Request;
import com.relief.disasterrelief.model.User;
import com.relief.disasterrelief.model.Donation;
import com.relief.disasterrelief.repository.RequestRepository;
import com.relief.disasterrelief.repository.UserRepository;
import com.relief.disasterrelief.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/volunteer")
@CrossOrigin(origins = "http://localhost:3000")
public class VolunteerAssignmentController {
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DonationRepository donationRepository;

    @GetMapping("/assignments")
    public List<AssignmentDTO> getAssignmentsForVolunteer(@RequestParam Long volunteerId) {
        User volunteer = userRepository.findById(volunteerId).orElse(null);
        if (volunteer == null) return List.of();

        List<Request> requests = requestRepository.findByAssignedVolunteer(volunteer);

        return requests.stream().map(r -> {
            // Requester, NGO from Request
            User requester = r.getRequester();
            User ngo = r.getNgo(); // <--- This now ALWAYS pulls from Request

            // Provider from related Donation (if available)
            Donation donation = donationRepository.findTopByRequestOrderByIdDesc(r);
            User provider = donation != null ? donation.getProvider() : null;

            return new AssignmentDTO(
                r.getId(),
                r.getResourceType(),
                r.getQuantity(),
                requester != null ? requester.getName() : "-",
                requester != null ? requester.getAddress() : "-",
                requester != null ? requester.getLatitude() : null,
                requester != null ? requester.getLongitude() : null,
                ngo != null ? ngo.getOrgName() : "-",
                ngo != null ? ngo.getAddress() : "-",
                ngo != null ? ngo.getLatitude() : null,
                ngo != null ? ngo.getLongitude() : null,
                provider != null ? provider.getName() : "-",
                provider != null ? provider.getAddress() : "-",
                provider != null ? provider.getLatitude() : null,
                provider != null ? provider.getLongitude() : null,
                r.getStatus(),
                r.getDueDate() == null ? "-" : r.getDueDate().toString()
            );
        }).collect(Collectors.toList());
    }

    @PostMapping("/requests/{requestId}/assign")
    public ResponseEntity<?> assignVolunteer(
        @PathVariable Long requestId,
        @RequestParam Long volunteerId,
        @RequestParam Long ngoId,
        @RequestParam String dueDate
    ) {
        Request request = requestRepository.findById(requestId).orElse(null);
        User volunteer = userRepository.findById(volunteerId).orElse(null);
        User ngo = userRepository.findById(ngoId).orElse(null);

        if (request == null || volunteer == null || ngo == null) {
            return ResponseEntity.badRequest().body("Invalid request, volunteer, or NGO");
        }

        request.setAssignedVolunteer(volunteer);
        request.setStatus("ASSIGNED");
        request.setDueDate(LocalDate.parse(dueDate));
        request.setNgo(ngo); // <--- ENSURE the assigned request always has NGO set!
        requestRepository.save(request);

        return ResponseEntity.ok().build();
    }
}
