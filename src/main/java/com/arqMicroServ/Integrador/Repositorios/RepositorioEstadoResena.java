package com.arqMicroServ.Integrador.Repositorios;

import com.arqMicroServ.Integrador.Entidades.EstadoResena;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RepositorioEstadoResena extends BaseRepository<EstadoResena, Long>{

    @Query("SELECT e " +
            "FROM EstadoResena e " +
            "WHERE nombreEstadoResena = :nombreEstado " +
            "AND (fhBajaEstadoResena IS NULL OR fhBajaEstadoResena > CURRENT_TIMESTAMP)")
    Optional<EstadoResena> obtenerEstadoVigentePorNombre(@Param("nombreEstado") String nombreEstado);
}
