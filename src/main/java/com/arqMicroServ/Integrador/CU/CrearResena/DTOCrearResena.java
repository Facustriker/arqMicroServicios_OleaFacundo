package com.arqMicroServ.Integrador.CU.CrearResena;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DTOCrearResena {

    @NotNull(message = "El usuario ID no puede ser nulo")
    private int usuarioID;

    @NotNull(message = "El producto ID no puede ser nulo")
    private int productoID;
}
