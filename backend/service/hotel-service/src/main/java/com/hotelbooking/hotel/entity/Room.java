package com.hotelbooking.hotel.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private UUID hotelId;   // 🔗 link to hotel

    @Column(nullable = false)
    private String roomNumber;

    @Column(nullable = false)
    private String type;   // SINGLE, DOUBLE, DELUXE

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer capacity;


    @Column(nullable = false)
    private Boolean available;
}
