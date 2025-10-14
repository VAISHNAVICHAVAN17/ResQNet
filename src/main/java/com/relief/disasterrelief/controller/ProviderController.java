package com.relief.disasterrelief.controller;

import com.relief.disasterrelief.model.Donation;
import com.relief.disasterrelief.model.User;
import com.relief.disasterrelief.repository.DonationRepository;
import com.relief.disasterrelief.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/provider")
@CrossOrigin(origins = "http://localhost:3000")
public class ProviderController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DonationRepository donationRepository;

    @PostMapping("/donations")
    public ResponseEntity<?> submitDonation(@RequestBody Map<String, Object> payload, Principal principal) {
        User provider = userRepository.findByEmail(principal.getName()).orElse(null);
        if (provider == null) return ResponseEntity.badRequest().body("Provider not found");

        Donation donation = new Donation();
        donation.setProvider(provider);
        donation.setStatus("PENDING");
        donation.setRequestDate(LocalDate.now());
        donation.setResourceType((String) payload.get("resourceType"));
        donation.setQuantity(((Number) payload.get("quantity")).intValue());

        // Assign NGO by ID received in 'ngoId'
        Object ngoIdObj = payload.get("ngoId");
        if (ngoIdObj != null) {
            Long ngoId = null;
            if (ngoIdObj instanceof Number) {
                ngoId = ((Number) ngoIdObj).longValue();
            } else {
                try {
                    ngoId = Long.parseLong(ngoIdObj.toString());
                } catch (Exception ignore) {}
            }
            if (ngoId != null) {
                User ngo = userRepository.findById(ngoId).orElse(null);
                if (ngo != null) {
                    donation.setNgo(ngo);
                    System.out.println("NGO SET: " + ngo.getId() + " - " + ngo.getOrgName());
                }
            }
        }

        donationRepository.save(donation);
        return ResponseEntity.ok(donation);
    }

    @GetMapping("/donations")
    public List<Donation> getMyDonations(Principal principal) {
        User provider = userRepository.findByEmail(principal.getName()).orElse(null);
        return donationRepository.findByProvider(provider);
    }

    // NEW: Update donation status (Approve/Reject)
    @PostMapping("/donations/{donationId}/status")
    public ResponseEntity<?> updateDonationStatus(
        @PathVariable Long donationId,
        @RequestBody Map<String, String> payload,
        Principal principal) {
        String status = payload.get("status");
        User provider = userRepository.findByEmail(principal.getName()).orElse(null);
        if (provider == null) return ResponseEntity.status(403).body("Forbidden: Provider not found");

        Donation donation = donationRepository.findById(donationId).orElse(null);
        if (donation == null || !donation.getProvider().getId().equals(provider.getId())) {
            return ResponseEntity.status(404).body("Donation not found for this provider");
        }

      
        if (status == null || (!status.equals("APPROVED") && !status.equals("REJECTED"))) {
            return ResponseEntity.badRequest().body("Invalid status");
        }
        donation.setStatus(status);
        donationRepository.save(donation);
        return ResponseEntity.ok(donation);
    }
}
