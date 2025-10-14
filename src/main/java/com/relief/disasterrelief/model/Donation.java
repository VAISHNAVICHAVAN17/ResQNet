package com.relief.disasterrelief.model;

import jakarta.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;

@Entity
public class Donation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String resourceType;
    private int quantity;
    private String status; // PENDING, VALIDATED, ASSIGNED, DELIVERED

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "donor_id")
    // No @JsonIgnore here if you wish to display donor in frontend, else use @JsonIgnore
    private User donor; // donor can be Provider, Requester, or Volunteer

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "provider_id")
    // No @JsonIgnore here to make provider accessible in dashboard JSON
    private User provider;
    
    @ManyToOne
    @JoinColumn(name = "request_id")
    private Request request;

    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ngo_id")
    @JsonBackReference("ngo-donation") // Add this annotation!
    private User ngo;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_volunteer_id")
    // No @JsonIgnore here if you wish to display assigned volunteer
    private User assignedVolunteer;

    private LocalDate requestDate;
    private LocalDate dueDate;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getResourceType() {
		return resourceType;
	}
	public void setResourceType(String resourceType) {
		this.resourceType = resourceType;
	}
	public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public User getDonor() {
		return donor;
	}
	public void setDonor(User donor) {
		this.donor = donor;
	}
	public User getProvider() {
		return provider;
	}
	public void setProvider(User provider) {
		this.provider = provider;
	}
	public Request getRequest() {
		return request;
	}
	public void setRequest(Request request) {
		this.request = request;
	}
	public User getNgo() {
		return ngo;
	}
	public void setNgo(User ngo) {
		this.ngo = ngo;
	}
	public User getAssignedVolunteer() {
		return assignedVolunteer;
	}
	public void setAssignedVolunteer(User assignedVolunteer) {
		this.assignedVolunteer = assignedVolunteer;
	}
	public LocalDate getRequestDate() {
		return requestDate;
	}
	public void setRequestDate(LocalDate requestDate) {
		this.requestDate = requestDate;
	}
	public LocalDate getDueDate() {
		return dueDate;
	}
	public void setDueDate(LocalDate dueDate) {
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
	public Donation(Long id, String resourceType, int quantity, String status, User donor, User provider,
			Request request, User ngo, User assignedVolunteer, LocalDate requestDate, LocalDate dueDate) {
		super();
		this.id = id;
		this.resourceType = resourceType;
		this.quantity = quantity;
		this.status = status;
		this.donor = donor;
		this.provider = provider;
		this.request = request;
		this.ngo = ngo;
		this.assignedVolunteer = assignedVolunteer;
		this.requestDate = requestDate;
		this.dueDate = dueDate;
	}
	public Donation() {
		super();
		// TODO Auto-generated constructor stub
	}

    // Getters and setters...
    
}
