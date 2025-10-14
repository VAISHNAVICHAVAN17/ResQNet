package com.relief.disasterrelief.model;

import jakarta.persistence.*;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "user", uniqueConstraints = @UniqueConstraint(columnNames = "aadhar_number"))
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "org_name")
    private String orgName;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "role")
    private String role;

    @Column(name = "dob")
    private String dob;

    @Column(name = "address")
    private String address;

    @Column(name = "aadhar_number", unique = true)
    private String aadharNumber;

    @Column(name = "pan_number")
    private String panNumber;

    @Column
    private Double latitude;

    @Column
    private Double longitude;

    // ADD THIS: Cascade/remove all user-related donations
    @OneToMany(mappedBy = "ngo", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @JsonManagedReference("ngo-donation")
    private List<Donation> donations;
    @OneToMany(mappedBy = "provider", cascade = CascadeType.REMOVE, orphanRemoval = true)
    private List<Donation> providedDonations;


    // Constructors, getters/setters (donations included)
    public List<Donation> getDonations() {
        return donations;
    }
    public void setDonations(List<Donation> donations) {
        this.donations = donations;
    }
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getOrgName() {
		return orgName;
	}
	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}
	public String getDob() {
		return dob;
	}
	public void setDob(String dob) {
		this.dob = dob;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getAadharNumber() {
		return aadharNumber;
	}
	public void setAadharNumber(String aadharNumber) {
		this.aadharNumber = aadharNumber;
	}
	public String getPanNumber() {
		return panNumber;
	}
	public void setPanNumber(String panNumber) {
		this.panNumber = panNumber;
	}
	public Double getLatitude() {
		return latitude;
	}
	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}
	public Double getLongitude() {
		return longitude;
	}
	public void setLongitude(Double longitude) {
		this.longitude = longitude;
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
	public User(Long id, String name, String orgName, String email, String password, String role, String dob,
			String address, String aadharNumber, String panNumber, Double latitude, Double longitude,
			List<Donation> donations) {
		super();
		this.id = id;
		this.name = name;
		this.orgName = orgName;
		this.email = email;
		this.password = password;
		this.role = role;
		this.dob = dob;
		this.address = address;
		this.aadharNumber = aadharNumber;
		this.panNumber = panNumber;
		this.latitude = latitude;
		this.longitude = longitude;
		this.donations = donations;
	}
	public User() {
		super();
		// TODO Auto-generated constructor stub
	}
     
    // Remaining getters and setters...
    // ... existing code ...
}
