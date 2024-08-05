package com.sgma.esignature.models;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(name = "data")
    private byte[] data;

    @Column(name = "name", nullable = false)
    private String name;

    @Lob
    @Column(name = "signature", nullable = false, columnDefinition="BLOB")
    private byte[] signature;
}
