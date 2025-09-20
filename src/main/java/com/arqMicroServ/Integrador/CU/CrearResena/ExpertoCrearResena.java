package com.arqMicroServ.Integrador.CU.CrearResena;

import com.arqMicroServ.Integrador.Config.CustomException;
import com.arqMicroServ.Integrador.Entidades.EstadoResena;
import com.arqMicroServ.Integrador.Entidades.Resena;
import com.arqMicroServ.Integrador.Repositorios.RepositorioEstadoResena;
import com.arqMicroServ.Integrador.Repositorios.RepositorioResena;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ExpertoCrearResena {

    @Autowired
    private final RepositorioEstadoResena repositorioEstadoResena;

    @Autowired
    private final RepositorioResena repositorioResena;

    public String crearResena(DTOCrearResena dto){

        //Validar que el estado exista
        Optional<EstadoResena> estadoResena = repositorioEstadoResena.obtenerEstadoVigentePorNombre("Vacia");

        if(estadoResena.isEmpty()){
            throw new CustomException("No existe estado 'Vacia' para crear la reseña");
        }

        // Validar que no existe ya una reseña para este usuario-producto
        if (repositorioResena.existsByUsuarioIDAndProductoID(dto.getUsuarioID(), dto.getProductoID())) {
            throw new CustomException("Ya existe una reseña para este usuario y producto");
        }

        Resena resena = Resena.builder()
                .fhCreacion(new Date())
                .productoID(dto.getProductoID())
                .usuarioID(dto.getUsuarioID())
                .estadoResena(estadoResena.get())
                .build();

        repositorioResena.save(resena);

        return "Reseña creada exitosamente";
    }
}
