package com.arqMicroServ.Integrador.Entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.Date;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "EstadoResena")
public class EstadoResena extends BaseEntity{

    @Column(name = "fhBajaEstadoResena")
    private Date fhBajaEstadoResena;

    @Column(name = "nombreEstadoResena")
    private String nombreEstadoResena;
}
