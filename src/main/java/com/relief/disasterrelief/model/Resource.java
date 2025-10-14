package com.relief.disasterrelief.model;

import com.relief.disasterrelief.model.User;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;      // Food, Medicine, Shelter, Clothes, etc.
    private int quantity;
    private String location;

    @ManyToOne
    @JoinColumn(name = "ngo_id", nullable = false)
    private User ngo;
}
