package com.arqMicroServ.Integrador.CU.CrearResena;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/crearResena")
public class ControladorCrearResena {

    @Autowired
    protected ExpertoCrearResena experto;

    @PostMapping("/crear")
    public ResponseEntity<?> crear(@RequestBody DTOCrearResena dto) {
        try {
            String ret = experto.crearResena(dto);
            return ResponseEntity.ok(ret);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
