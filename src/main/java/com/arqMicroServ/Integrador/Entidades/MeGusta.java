package com.arqMicroServ.Integrador.Entidades;

import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
@Entity
@Table(name = "MeGusta")
public class MeGusta extends BaseEntity{

    @Column(name = "usuarioDesde")
    private String usuarioDesde;

    @Column(name = "usuarioPara")
    private String usuarioPara;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "resena")
    private Resena resena;
}
