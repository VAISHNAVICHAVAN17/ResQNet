package com.relief.disasterrelief.controller;

import com.relief.disasterrelief.model.Request;
import com.relief.disasterrelief.model.User;
import com.relief.disasterrelief.model.Donation;
import com.relief.disasterrelief.repository.RequestRepository;
import com.relief.disasterrelief.repository.UserRepository;
import com.relief.disasterrelief.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/ngo")
@CrossOrigin(origins = "http://localhost:3000")
public class NgoController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private DonationRepository donationRepository;

    @GetMapping("/all")
    public List<User> getAllNgos(Principal principal) {
        // Optional: add security checks or logging for principal
        return userRepository.findByRole("NGO");
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getNgoById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(ngo -> ResponseEntity.ok().body(ngo))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/requests")
    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }

    @GetMapping("/volunteers")
    public List<User> getVolunteers() {
        return userRepository.findByRole("Volunteer");
    }

    @PostMapping("/requests/{requestId}/assign")
    public ResponseEntity<?> assignVolunteer(
        @PathVariable Long requestId,
        @RequestParam Long volunteerId,
        @RequestParam String dueDate,
        Principal principal
    ) {
        Request request = requestRepository.findById(requestId).orElse(null);
        User volunteer = userRepository.findById(volunteerId).orElse(null);
        User ngo = userRepository.findByEmail(principal.getName()).orElse(null);

        if (request == null || volunteer == null || ngo == null) {
            return ResponseEntity.badRequest().body("Invalid request, volunteer, or NGO");
        }

        LocalDate parsedDueDate;
        try {
            parsedDueDate = LocalDate.parse(dueDate);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid dueDate format");
        }

        request.setAssignedVolunteer(volunteer);
        request.setStatus("ASSIGNED");
        request.setDueDate(parsedDueDate);
        request.setNgo(ngo);

        requestRepository.save(request);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/requests/{requestId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long requestId, @RequestParam String status) {
        Request request = requestRepository.findById(requestId).orElse(null);

        if (request == null) {
            return ResponseEntity.badRequest().body("Invalid request ID");
        }
        // Optional: validate status values here
        request.setStatus(status.toUpperCase());
        requestRepository.save(request);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/donations")
    public List<Donation> getDonationsForNgo(Principal principal) {
      User ngo = userRepository.findByEmail(principal.getName()).orElse(null);
      return donationRepository.findByNgo(ngo);
    }

    @PostMapping("/donations/{donationId}/assign")
    public ResponseEntity<?> assignVolunteerForDonation(
        @PathVariable Long donationId,
        @RequestParam Long volunteerId,
        @RequestParam String dueDate
    ) {
        Donation donation = donationRepository.findById(donationId).orElse(null);
        User volunteer = userRepository.findById(volunteerId).orElse(null);

        if (donation == null || volunteer == null) {
            return ResponseEntity.badRequest().body("Invalid donation or volunteer");
        }

        System.out.println("Received dueDate: " + dueDate); // Log for debug

        LocalDate parsedDueDate;
        try {
            // Accept both formats for extra robustness
            if (dueDate.contains("-") && dueDate.length() == 10) {
                if (Character.isDigit(dueDate.charAt(0))) {
                    // Try ISO first
                    parsedDueDate = LocalDate.parse(dueDate); // 'YYYY-MM-DD'
                } else {
                    // fallback
                    DateTimeFormatter df = DateTimeFormatter.ofPattern("dd-MM-yyyy");
                    parsedDueDate = LocalDate.parse(dueDate, df);
                }
            } else {
                return ResponseEntity.badRequest().body("Invalid dueDate format: " + dueDate);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid dueDate format: " + dueDate);
        }

        donation.setAssignedVolunteer(volunteer);
        donation.setDueDate(parsedDueDate);
        donation.setStatus("ASSIGNED");
        donationRepository.save(donation);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/donations/{donationId}/status")
    public ResponseEntity<?> updateDonationStatus(
        @PathVariable Long donationId,
        @RequestParam String status,
        Principal principal) {

        // Optional: Check if the principal has the "NGO" role...

        Donation donation = donationRepository.findById(donationId).orElse(null);
        if (donation == null) return ResponseEntity.status(404).body("Donation not found");

        if (!"APPROVED".equals(status) && !"REJECTED".equals(status)) {
            return ResponseEntity.badRequest().body("Invalid status");
        }

        donation.setStatus(status);
        donationRepository.save(donation);

        return ResponseEntity.ok(donation);
    }

}
