# Ecommerce Server

Un servidor desarrollado con express.js que administra la lógica de negocio, permanencia de datos y servicio web de un ecommerce. Para la permanencia de los datos utiliza MongoDB, para el manejo de plantillas de views usa handlebars. Y cuenta con un editor de productos 'realtime' sirviendose de websockets para facilidad de testeo de enpoints

# Setup
---
Previo al startup, el servidor verifica que existan las siguientes variables de ambiente
- `ECOM_DB_URI`: **REQUERIDA**. Url de conexion de mongo, sin contener la base de datos y sin "/" al final.
- `ECOM_DB_USER`: **OPCIONAL** Nombre de usuario de mongoDB, con permisos de read-write a la db **ecommerce**
- `ECOM_DB_PWD`: **OPCIONAL** Contraseña del usuario

## Comandos npm

- `start`: Inicia la version de producción del servidor
- `dev`: Inicia la version de desarrollo del servidor
- `gen`: genera un listado de `productGenerator.js/AMT` productos en el path especificado en `lib.js/PRODUCTS_PATH`

# Endpoints
---

## Web
- `GET /`: Visualizador de productos estatico.
- `GET /realtimeProducts`: Visualizador y editor de productos en tiempo real utilizando websockets.

## Api
Estructurados siguendo el formato de apis RESTful. 

>**NOTA**
>La URI base es `/api`, todos los links de la API se preceden con este texto

Para resolver la funcionalidad requerida por un e-commerce el sistema cuenta con dos estructuras principales, *carts y products*. Que son servidas al cliente con las siguientes URIs:
### Carts
- `POST /carts` Request que crea un carrito en la base de datos y devuelve su id
- `GET /carts/:cid` Request que devuelve el carrito de id `cid`
- `PUT /carts/:cid/products/:pid` Request que añade una unidad del producto de id `pid` al array `products` del carrito de id `cid`.
- `DELETE /carts/:cid/products/:pid` Request que remueve una unidad del producto de id `pid` del array `products` del carrito de id `cid`.

### Products
- `POST /products` Request que crea un producto en la base de datos y devuelve su id
- `GET /products/?limit=[Number]` Request que devuelve los productos desde el primero hasta limit.
- `GET /products/:pid` Request que devuelve el producto de id `pid`
- `PUT /products/:pid` Request que modifica el producto de id `pid`, con los campos especificados en formato JSON en el cuerpo de la request
- `DELETE /products/:pid` Request que elimina el producto de id `pid` de la base de datos
