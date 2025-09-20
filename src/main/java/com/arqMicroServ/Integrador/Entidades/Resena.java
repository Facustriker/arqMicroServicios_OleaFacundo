package com.arqMicroServ.Integrador.Entidades;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "Resena")
public class Resena extends BaseEntity{

    @Column(name = "fhCreacion")
    private Date fhCreacion;

    @Column(name = "fhResena")
    private Date fhResena;

    @Column(name = "productoID")
    private int productoID;

    @Column(name = "usuarioID")
    private int usuarioID;

    @Column(name = "rating")
    private int rating;

    @Column(name = "resena")
    private String resena;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "estadoResena")
    private EstadoResena estadoResena;
}
