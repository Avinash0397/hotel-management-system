package com.hotelbooking.hotel.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

@Entity
@Table(name = "amenities")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Amenity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID hotelId;

    @Column(nullable = false)
    private String name; // WiFi, Pool, Gym, Spa, Parking, Restaurant

    @Column
    private String icon; // react-icon name or emoji

    @Column(nullable = false)
    private Boolean available;
}
