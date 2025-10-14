package com.relief.disasterrelief.dto;

import com.relief.disasterrelief.model.Donation;

public class ProviderAssignmentDTO {
    private Long id;
    private String providerName;
    private String providerAddress;
    private Double providerLat;
    private Double providerLng;
    private String ngoName;
    private String ngoAddress;
    private Double ngoLat;
    private Double ngoLng;
    private String resourceType;
    private Integer quantity;
    private String status;
    private String dueDate;

    public ProviderAssignmentDTO(Donation d) {
        this.id = d.getId();
        this.providerName = d.getProvider() != null ? d.getProvider().getName() : "-";
        this.providerAddress = d.getProvider() != null ? d.getProvider().getAddress() : "-";
        this.providerLat = d.getProvider() != null ? d.getProvider().getLatitude() : null;
        this.providerLng = d.getProvider() != null ? d.getProvider().getLongitude() : null;
        this.ngoName = d.getNgo() != null ? d.getNgo().getOrgName() : "-";
        this.ngoAddress = d.getNgo() != null ? d.getNgo().getAddress() : "-";
        this.ngoLat = d.getNgo() != null ? d.getNgo().getLatitude() : null;
        this.ngoLng = d.getNgo() != null ? d.getNgo().getLongitude() : null;
        this.resourceType = d.getResourceType();
        this.quantity = d.getQuantity();
        this.status = d.getStatus();
        this.dueDate = d.getDueDate() != null ? d.getDueDate().toString() : "-";
    }

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getProviderName() {
		return providerName;
	}

	public void setProviderName(String providerName) {
		this.providerName = providerName;
	}

	public String getProviderAddress() {
		return providerAddress;
	}

	public void setProviderAddress(String providerAddress) {
		this.providerAddress = providerAddress;
	}

	public Double getProviderLat() {
		return providerLat;
	}

	public void setProviderLat(Double providerLat) {
		this.providerLat = providerLat;
	}

	public Double getProviderLng() {
		return providerLng;
	}

	public void setProviderLng(Double providerLng) {
		this.providerLng = providerLng;
	}

	public String getNgoName() {
		return ngoName;
	}

	public void setNgoName(String ngoName) {
		this.ngoName = ngoName;
	}

	public String getNgoAddress() {
		return ngoAddress;
	}

	public void setNgoAddress(String ngoAddress) {
		this.ngoAddress = ngoAddress;
	}

	public Double getNgoLat() {
		return ngoLat;
	}

	public void setNgoLat(Double ngoLat) {
		this.ngoLat = ngoLat;
	}

	public Double getNgoLng() {
		return ngoLng;
	}

	public void setNgoLng(Double ngoLng) {
		this.ngoLng = ngoLng;
	}

	public String getResourceType() {
		return resourceType;
	}

	public void setResourceType(String resourceType) {
		this.resourceType = resourceType;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getDueDate() {
		return dueDate;
	}

	public void setDueDate(String dueDate) {
		this.dueDate = dueDate;
	}

	@Override
	public int hashCode() {
		// TODO Auto-generated method stub
		return super.hashCode();
	}

	@Override
	public boolean equals(Object obj) {
		// TODO Auto-generated method stub
		return super.equals(obj);
	}

	@Override
	protected Object clone() throws CloneNotSupportedException {
		// TODO Auto-generated method stub
		return super.clone();
	}

	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return super.toString();
	}

	@Override
	protected void finalize() throws Throwable {
		// TODO Auto-generated method stub
		super.finalize();
	}

	public ProviderAssignmentDTO(Long id, String providerName, String providerAddress, Double providerLat,
			Double providerLng, String ngoName, String ngoAddress, Double ngoLat, Double ngoLng, String resourceType,
			Integer quantity, String status, String dueDate) {
		super();
		this.id = id;
		this.providerName = providerName;
		this.providerAddress = providerAddress;
		this.providerLat = providerLat;
		this.providerLng = providerLng;
		this.ngoName = ngoName;
		this.ngoAddress = ngoAddress;
		this.ngoLat = ngoLat;
		this.ngoLng = ngoLng;
		this.resourceType = resourceType;
		this.quantity = quantity;
		this.status = status;
		this.dueDate = dueDate;
	}

	public ProviderAssignmentDTO() {
		super();
		// TODO Auto-generated constructor stub
	}

    // Getters & setters omitted for brevity
    
}
