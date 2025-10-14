package com.relief.disasterrelief.dto;

public class AssignmentDTO {
    private Long requestId;
    private String resourceType;
    private int quantity;
    private String requesterName;
    private String requesterAddress;
    private Double requesterLat;
    private Double requesterLng;
    private String ngoName;
    private String ngoAddress;
    private Double ngoLat;
    private Double ngoLng;
    private String providerName;
    private String providerAddress;
    private Double providerLat;
    private Double providerLng;
    private String status;
    private String dueDate;

    // Default constructor
    public AssignmentDTO() {
    }

    // Main constructor - matches the order used in VolunteerAssignmentController
    public AssignmentDTO(
        Long requestId, String resourceType, int quantity,
        String requesterName, String requesterAddress, Double requesterLat, Double requesterLng,
        String ngoName, String ngoAddress, Double ngoLat, Double ngoLng,
        String providerName, String providerAddress, Double providerLat, Double providerLng,
        String status, String dueDate
    ) {
        this.requestId = requestId;
        this.resourceType = resourceType;
        this.quantity = quantity;
        this.requesterName = requesterName;
        this.requesterAddress = requesterAddress;
        this.requesterLat = requesterLat;
        this.requesterLng = requesterLng;
        this.ngoName = ngoName;
        this.ngoAddress = ngoAddress;
        this.ngoLat = ngoLat;
        this.ngoLng = ngoLng;
        this.providerName = providerName;
        this.providerAddress = providerAddress;
        this.providerLat = providerLat;
        this.providerLng = providerLng;
        this.status = status;
        this.dueDate = dueDate;
    }

    // Getters and setters
    public Long getRequestId() { return requestId; }
    public void setRequestId(Long requestId) { this.requestId = requestId; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }

    public String getRequesterAddress() { return requesterAddress; }
    public void setRequesterAddress(String requesterAddress) { this.requesterAddress = requesterAddress; }

    public Double getRequesterLat() { return requesterLat; }
    public void setRequesterLat(Double requesterLat) { this.requesterLat = requesterLat; }

    public Double getRequesterLng() { return requesterLng; }
    public void setRequesterLng(Double requesterLng) { this.requesterLng = requesterLng; }

    public String getNgoName() { return ngoName; }
    public void setNgoName(String ngoName) { this.ngoName = ngoName; }

    public String getNgoAddress() { return ngoAddress; }
    public void setNgoAddress(String ngoAddress) { this.ngoAddress = ngoAddress; }

    public Double getNgoLat() { return ngoLat; }
    public void setNgoLat(Double ngoLat) { this.ngoLat = ngoLat; }

    public Double getNgoLng() { return ngoLng; }
    public void setNgoLng(Double ngoLng) { this.ngoLng = ngoLng; }

    public String getProviderName() { return providerName; }
    public void setProviderName(String providerName) { this.providerName = providerName; }

    public String getProviderAddress() { return providerAddress; }
    public void setProviderAddress(String providerAddress) { this.providerAddress = providerAddress; }

    public Double getProviderLat() { return providerLat; }
    public void setProviderLat(Double providerLat) { this.providerLat = providerLat; }

    public Double getProviderLng() { return providerLng; }
    public void setProviderLng(Double providerLng) { this.providerLng = providerLng; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
}
