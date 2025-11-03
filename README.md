# LINEAMIENTOS PARA PROYECTO FINAL – ARQUITECTURA DE MICROSERVICIOS - 2025
## Realizado por: Olea, Facundo - 47855

# Casos de Uso

## CU: Crear reseña

**Precondición:** Un producto fue comprado (orden de compra creada)

**Camino normal:** Al crear una orden se crea una reseña vacía que apunta al producto comprado. Esta reseña tiene el ID del producto comprado, el ID del usuario que lo compró y la fechaHora de creación de esta entidad vacía.

**Camino alternativo:** No es la primera compra del producto, ya no se crean más reseñas.

---

## CU: Reseñar producto

**Precondición:** Una reseña completa o vacía debe existir apuntando a este producto.

**Camino normal:** Se busca una reseña vacía con el ID del producto seleccionado y con el usuarioID del usuario actualmente logueado. El usuario escribe la reseña y coloca el puntaje (un entero del 1 al 5). Se actualiza la reseña vacía haciéndola visible (cambiándole el estado a 'Completa') y agregando el contenido que el usuario acaba de ingresar (además se guarda la fecha y hora de esta actualización).

**Camino alternativo:** Actualizar reseña. Se busca la reseña con el ID del producto seleccionado. El usuario escribe la nueva reseña y coloca el nuevo puntaje (un entero del 1 al 5). Se actualiza la reseña (además se guarda la fecha y hora de esta actualización).

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
| productoID | String | ID del producto reseñado |
| usuarioID | String | ID del usuario que realizó la reseña |
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
| usuarioID | String | ID del usuario que dio el like |
| resenaID | int | ID de la reseña a la que pertenece |

**Relación:** Muchos Likes pertenecen a una Reseña (*.1)


## Diagrama de clases

<img width="664" height="682" alt="image" src="https://github.com/user-attachments/assets/0d59742b-9459-4876-882e-61eac4fcdca2" />



---

# Autenticación y Seguridad

Este microservicio utiliza **JWT (JSON Web Token)** para autenticación, validando tokens contra el microservicio de **Auth**.

## Sistema de Caché

- Los tokens validados se almacenan en **caché en memoria** por **30 minutos**
- La primera validación llama al microservicio de Auth
- Las siguientes validaciones usan el token en caché
- El caché se limpia automáticamente cada 5 minutos

## Endpoints Públicos

- `GET /api/resenas/producto/{productoID}` - Ver reseñas de un producto
  - Si se envía token válido, incluye el campo `userLiked` en cada reseña
  - Si NO se envía token, `userLiked` siempre será `false`
    
- `GET /api/resenas/{id}/consultarLikes` - Ver likes de una reseña

## Endpoints Protegidos

Los siguientes endpoints requieren un token JWT válido en el header `Authorization: Bearer {token}`:

- `POST /api/resenas/crear-vacia` - Crear reseña vacía
- `PUT /api/resenas/{id}` - Completar/editar reseña
- `GET /api/resenas/pendientes` - Ver reseñas pendientes del usuario
- `POST /api/resenas/{id}/like` - Dar like a una reseña
- `DELETE /api/resenas/{id}/dislike` - Quitar like de una reseña


---



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
  "productoID": 456
}
```

**Headers**

- Content-Type: application/json
- Authorization: Bearer {token} (usuarioID se extrae del token)

**Response**

`201 CREATED`
```json
{
    "message": "Reseña vacía creada exitosamente",
    "data": {
        "resenaID": 1,
        "usuarioID": 123,
        "productoID": 105,
        "resena": "",
        "rating": 0,
        "fhCreacion": "2025-10-21T19:39:15.779Z",
        "fhResena": null,
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
- Authorization: Bearer {token}

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

`404 NOT FOUND`
```json
{
  "error": "Error, la reseña seleccionada no existe"
}
```

---

### CU: Dar like a reseña
`POST /api/resenas/{id}/like`

**Params path**

*no tiene*

**Params query**

*no tiene*

**Body**

*no tiene*

**Headers**

- Content-Type: application/json
- Authorization: Bearer {token}

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
  "error": "Reseña con ID [resenaID] no encontrada"
}
```

---

### Camino alternativo de CU 'Dar like a reseña' (quitar el like)
`DELETE /api/resenas/{id}/dislike`

**Params path**

*no tiene*

**Params query**

*no tiene*

**Body**

*no tiene*

**Headers**

- Content-Type: application/json
- Authorization: Bearer {token}

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
  "error": "Reseña con ID [resenaID] no encontrada"
}
```

---

### CU: Ordenar reseñas por like
`GET /api/resenas/producto/{productoID}`

**Params path**

- productoID: ID del producto para consultar sus reseñas

**Params query**

*no tiene* (siempre ordenadas de mayor a menor cantidad de likes)

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
      "userLiked": false
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
      "userLiked": true
    }
  ]
}
```

`200 OK (En caso de que no hayan reseñas hechas aun)`
```json
{
    "data": [],
    "cantidad": 0
}
```

---

### CU: Listar productos a reseñar
`GET /api/resenas/pendientes`

**Params path**

*no tiene* (usuarioID se extrae del token)

**Params query**

*no tiene*

**Body**

*no tiene*

**Headers**

- Content-Type: application/json
- Authorization: Bearer {token}

**Response**

`200 OK`
```json
{
  "data": [
        {
            "resenaID": 3,
            "usuarioID": "123",
            "productoID": "4",
            "resena": "",
            "rating": 0,
            "fhCreacion": "2025-10-29T23:03:22.000Z",
            "fhResena": null,
            "estadoResena": "Vacia",
            "likes": 0
        },
        {
            "resenaID": 4,
            "usuarioID": "123",
            "productoID": "7",
            "resena": "",
            "rating": 0,
            "fhCreacion": "2025-10-29T23:04:01.000Z",
            "fhResena": null,
            "estadoResena": "Vacia",
            "likes": 0
        }
    ],
    "cantidad": 2
}
```

`200 OK (En caso de que no hayan reseñas pendientes)`
```json
{
    "data": [],
    "cantidad": 0
}
```
---

### CU: Consultar likes de una reseña
`GET /api/resenas/{id}/consultarLikes`

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
  "likes": 2,
  "likesArray": [
    {
      "likeID": 1,
      "usuarioID": "68a125eb61cef14c63f559ea"
    },
    {
      "likeID": 2,
      "usuarioID": "68fe851ad4dce00902a4f02e"
    }
  ]
}
```

`200 OK (En caso de que no hayan likes aun)`
```json
{
    "resenaID": 3,
    "likes": 0,
    "likesArray": []
}
```

`404 NOT FOUND`
```json
{
  "error": "Reseña con ID [resenaID] no encontrada"
}
```
---

## Interfaz asincrónica (RabbitMQ)

### Crear reseña vacía al crear una orden de compra

**Exchange:** `order_placed` (tipo fanout)
**Queue:** `reviews_order_placed`

**Acción:** El microservicio escucha eventos de órdenes creadas y crea reseñas vacías automáticamente.

**Body recibido**
```json
{
  "correlation_id": "...",
  "exchange": "",
  "routing_key": "",
  "message": {
    "orderId": "49b07f3b-56ab-4ce0-a3d2-8329cc983a5a",
    "cartId": "68fe7c1791050db297aa23f6",
    "userId": "68a125eb61cef14c63f559ea",
    "articles": [
      {
        "articleId": "68fe7484d4dce00902a4f008",
        "quantity": 2
      }
    ]
  }
}
```

**Workflow**

Para cada artículo en la orden:
1. Extrae el mensaje del wrapper (campo `message`)
2. Verifica si ya existe una reseña para ese usuario-producto
3. Si no existe, crea una reseña vacía en estado "Vacia"
4. Si ya existe, ignora y continúa con el siguiente artículo

**Resultado**

Se crean reseñas vacías automáticamente cuando el usuario realiza una compra, listas para que las complete cuando desee.
