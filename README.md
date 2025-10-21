# LINEAMIENTOS PARA PROYECTO FINAL – ARQUITECTURA DE MICROSERVICIOS - 2025
## Realizado por: Olea, Facundo - 47855

# Casos de Uso

## CU: Crear reseña

**Precondición:** Un producto fue comprado exitosamente (orden de compra en estado confirmada)

**Camino normal:** Al confirmar una orden se crea una reseña vacía que apunta al producto comprado. Esta reseña tiene el ID del producto comprado, el ID del usuario que lo compró y la fechaHora de creación de esta entidad vacía.

**Camino alternativo:** No es la primera compra del producto, ya no se crean más reseñas.

---

## CU: Reseñar producto

**Precondición:** Una reseña completa o vacía debe existir apuntando a este producto.

**Camino normal:** Se busca una reseña vacía con el ID del producto seleccionado y con el usuarioID del usuario actualmente logueado. El usuario escribe la reseña y coloca el puntaje (un entero del 1 al 5). Se actualiza la reseña vacía haciéndola visible y agregando el contenido que el usuario acaba de ingresar (además se guarda la fecha y hora de esta actualización).

**Camino alternativo:** Editar reseña. Se busca la reseña con el ID del producto seleccionado. El usuario escribe la nueva reseña y coloca el nuevo puntaje (un entero del 1 al 5). Se actualiza la reseña (además se guarda la fecha y hora de esta actualización).

---

## CU: Dar like a reseña

**Precondición:** Una reseña completa debe existir.

**Camino normal:** Se busca la reseña con el ID de la reseña seleccionada. Verificar que no existe un Like del usuario actual asociado a la reseña. Crear entidad "Like" con 'usuarioID' igual al usuario actual que dio el like y asociarla a la reseña. Modificar el atributo "likes" de la reseña, incrementando su valor en 1.

**Camino alternativo:** Quitar like. Buscar una entidad "Like" con 'usuarioID' igual al del usuario actual. Eliminar la entidad "Like". Modificar el atributo "likes" de la reseña, decrementando su valor en 1.

---

## CU: Ordenar reseñas por like

**Precondición:** Que exista el producto para el que se pide la reseña.

**Camino normal:** Se buscan todas las reseñas vinculadas al ID del producto seleccionado y se las mete en un array. La cantidad de likes que tiene cada reseña viene en la respuesta, luego a partir de ese número se ordena de mayor a menor.

**Camino alternativo:** No hay reseñas para ese producto. No falla el CU, solo devuelve vacío.

---

## CU: Listar productos a reseñar

**Precondición:** El usuario quiere saber si tiene reseñas por completar.

**Camino normal:** El usuario llama al backend con usuarioID perteneciente a la cuenta logueada actualmente. Se buscan todas las reseñas en estado "Vacía" donde el atributo usuarioID de la reseña coincide con el que acaba de enviar el usuario. Se agrupan en un array y el usuario puede elegir cuál quiere reseñar primero. Las reseñas son ordenadas por antigüedad, mostrando primero las más antiguas.

**Camino alternativo:** No hay reseñas pendientes. No falla el CU, solo devuelve vacío.

---

## CU: Consultar likes de una reseña

**Precondición:** Debe existir la reseña a la cual se le consultan los likes.

**Camino normal:** Se busca una reseña con un productoID igual al del producto seleccionado y se lee el atributo "likes". Se repite por cada reseña que tenga un producto.

**Camino alternativo:** La reseña no tiene likes. No falla el CU, solo devuelve vacío.

---

# Modelo de Datos

## Entidad: Reseña

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| resenaID | int | Identificador único de la reseña |
| fhCreacion | DateTime | Fecha y hora de creación (momento de compra) |
| fhResena | DateTime | Fecha y hora en que se completó la reseña |
| productoID | int | ID del producto reseñado |
| usuarioID | int | ID del usuario que realizó la reseña |
| rating | int | Calificación del 1 al 5 |
| resena | String | Texto de la reseña |
| estadoResena | String | Estado: "Vacia" o "Completa" |
| likes | int | Cantidad total de likes |

**Relación:** Una Reseña tiene muchos Likes (0..*)

---

## Entidad: Like

| Atributo | Tipo | Descripción |
|----------|------|-------------|
| likeID | int | Identificador único del like |
| usuarioID | int | ID del usuario que dio el like |
| resenaID | int | ID de la reseña a la que pertenece |

**Relación:** Muchos Likes pertenecen a una Reseña (*.1)




## Interfaz REST

### CU: Crear reseña
`POST /api/resenas/crear-vacia`

**Params path**

*no tiene*

**Params query**

*no tiene*

**Body**
```json
{
  "usuarioID": 123,
  "productoID": 456
}
```

**Headers**

- Content-Type: application/json

**Response**

`201 CREATED`
```json
{
    "message": "Reseña vacía creada exitosamente",
    "data": {
        "resenaID": 1,
        "usuarioID": 123,
        "productoID": 105,
        "rating": 0,
        "fhCreacion": "2025-10-21T19:39:15.779Z",
        "estadoResena": "Vacia",
        "likes": 0,
        "likesArray": []
    }
}
```

`200 OK` (cuando compra más de una vez un mismo artículo)
```json
{
  "message": "Ya existe una reseña para usuario 123 y producto 456",
  "alreadyExists": true
}
```

`500 INTERNAL SERVER ERROR`
```json
{
  "error": "Error interno del servidor"
}
```

---

### CU: Reseñar producto
`PUT /api/resenas/{id}/completar`

**Params path**

- id: ID de la reseña a completar

**Params query**

*no tiene*

**Body**
```json
{
  "texto": "Excelente producto, muy recomendable",
  "rating": 5
}
```

**Headers**

- Content-Type: application/json

**Response**

`200 OK`
```json
{
  "message": "Reseña completada exitosamente",
  "data": {
    "resenaID": 1,
    "usuarioID": 123,
    "productoID": 456,
    "resena": "Excelente producto, muy recomendable",
    "rating": 5,
    "fhCreacion": "2025-10-19T10:30:00Z",
    "fhResena": "2025-10-19T15:45:00Z",
    "estadoResena": "Completa",
    "likes": 0
  }
}
```

`400 BAD REQUEST`
```json
{
  "error": "Error, la reseña ya está completa"
}
```

`404 NOT FOUND`
```json
{
  "error": "Error, la reseña seleccionada no existe"
}
```

---

### CU: Dar like a reseña
`POST /api/likes/dar`

**Params path**

*no tiene*

**Params query**

*no tiene*

**Body**
```json
{
  "resenaID": 1,
  "usuarioID": 456
}
```

**Headers**

- Content-Type: application/json

**Response**

`200 OK`
```json
{
  "message": "Like agregado exitosamente"
}
```

`400 BAD REQUEST`
```json
{
  "error": "Este usuario ya dio like a esta reseña"
}
```

`404 NOT FOUND`
```json
{
  "error": "Reseña no encontrada"
}
```

---

### CU: Quitar like de reseña
`DELETE /api/likes/quitar`

**Params path**

*no tiene*

**Params query**

*no tiene*

**Body**
```json
{
  "resenaID": 1,
  "usuarioID": 456
}
```

**Headers**

- Content-Type: application/json

**Response**

`200 OK`
```json
{
  "message": "Like eliminado exitosamente"
}
```

`400 BAD REQUEST`
```json
{
  "error": "Este usuario no ha dado like a esta reseña"
}
```

`404 NOT FOUND`
```json
{
  "error": "Reseña no encontrada"
}
```

---

### CU: Ordenar reseñas por like
`GET /api/resenas/producto/{productoID}`

**Params path**

- productoID: ID del producto para consultar sus reseñas

**Params query**

*no tiene* (siempre ordenadas de mayor a menor likes)

**Body**

*no tiene*

**Headers**

*no tiene*

**Response**

`200 OK`
```json
{
  "data": [
    {
      "resenaID": 5,
      "usuarioID": 789,
      "productoID": 456,
      "resena": "Increíble calidad",
      "rating": 5,
      "fhCreacion": "2025-10-15T08:20:00Z",
      "fhResena": "2025-10-15T12:00:00Z",
      "estadoResena": "Completa",
      "likes": 25
    },
    {
      "resenaID": 3,
      "usuarioID": 234,
      "productoID": 456,
      "resena": "Muy bueno",
      "rating": 4,
      "fhCreacion": "2025-10-18T14:30:00Z",
      "fhResena": "2025-10-18T16:00:00Z",
      "estadoResena": "Completa",
      "likes": 12
    }
  ]
}
```

---

### CU: Listar productos a reseñar
`GET /api/resenas/pendientes/{usuarioID}`

**Params path**

- usuarioID: ID del usuario que consulta sus reseñas pendientes

**Params query**

*no tiene*

**Body**

*no tiene*

**Headers**

*no tiene*

**Response**

`200 OK`
```json
{
  "data": [
    {
      "resenaID": 1,
      "usuarioID": 123,
      "productoID": 456,
      "fhCreacion": "2025-10-10T10:30:00Z",
      "estadoResena": "Vacia",
      "rating": 0,
      "likes": 0
    },
    {
      "resenaID": 8,
      "usuarioID": 123,
      "productoID": 789,
      "fhCreacion": "2025-10-15T14:20:00Z",
      "estadoResena": "Vacia",
      "rating": 0,
      "likes": 0
    }
  ],
  "cantidad": 2
}
```

---

### CU: Consultar likes de una reseña
`GET /api/likes/resena/{resenaID}`

**Params path**

- resenaID: ID de la reseña para consultar sus likes

**Params query**

*no tiene*

**Body**

*no tiene*

**Headers**

*no tiene*

**Response**

`200 OK`
```json
{
  "resenaID": 1,
  "likes": 15
}
```

`404 NOT FOUND`
```json
{
  "error": "Reseña no encontrada"
}
```

---

## Interfaz asincrónica (RabbitMQ)

### Crear reseña vacía al confirmar orden

**Queue:** `order-completed`

**Acción:** El microservicio escucha eventos de órdenes completadas y crea reseñas vacías automáticamente.

**Body recibido**
```json
{
  "orderID": "ORD-12345",
  "usuarioID": 123,
  "productos": [
    {
      "productoID": 456,
      "cantidad": 1
    },
    {
      "productoID": 789,
      "cantidad": 2
    }
  ],
  "timestamp": "2025-10-19T10:30:00Z"
}
```

**Workflow**

Para cada producto en la orden:
1. Verifica si ya existe una reseña para ese usuario-producto
2. Si no existe, crea una reseña vacía
3. Si ya existe, no hace nada (el usuario ya compró ese producto antes)

**Resultado**

Se crean reseñas vacías en estado "Vacia" listas para que el usuario las complete cuando desee.
