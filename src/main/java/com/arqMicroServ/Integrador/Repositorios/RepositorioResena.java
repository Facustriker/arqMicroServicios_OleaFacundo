package com.arqMicroServ.Integrador.Repositorios;

import com.arqMicroServ.Integrador.Entidades.Resena;
import org.springframework.stereotype.Repository;

@Repository
public interface RepositorioResena extends BaseRepository<Resena, Long>{

    boolean existsByUsuarioIDAndProductoID(int usuarioID, int productoID);
}
