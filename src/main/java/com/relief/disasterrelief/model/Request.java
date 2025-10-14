package com.relief.disasterrelief.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Request {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String resourceType;
    private int quantity;
    private String location;
    private String status;
    private LocalDate dueDate;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private User requester;

    @ManyToOne
    @JoinColumn(name = "assigned_volunteer_id")
    private User assignedVolunteer;

    @ManyToOne
    @JoinColumn(name = "ngo_id")
    private User ngo;

    public Request() {
    }

    public Request(String resourceType, int quantity, String location, String status,
                   User requester, User assignedVolunteer, User ngo, LocalDate dueDate) {
        this.resourceType = resourceType;
        this.quantity = quantity;
        this.location = location;
        this.status = status;
        this.requester = requester;
        this.assignedVolunteer = assignedVolunteer;
        this.ngo = ngo;
        this.dueDate = dueDate;
    }

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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public User getRequester() {
        return requester;
    }

    public void setRequester(User requester) {
        this.requester = requester;
    }

    public User getAssignedVolunteer() {
        return assignedVolunteer;
    }

    public void setAssignedVolunteer(User assignedVolunteer) {
        this.assignedVolunteer = assignedVolunteer;
    }

    public User getNgo() {
        return ngo;
    }

    public void setNgo(User ngo) {
        this.ngo = ngo;
    }
}
