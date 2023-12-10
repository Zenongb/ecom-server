# Ecommerce Server

Un servidor desarrollado con express.js que administra la lógica de negocio, permanencia de datos y servicio web de un ecommerce. Para la permanencia de los datos utiliza MongoDB, para el manejo de plantillas de views usa handlebars. Y cuenta con un editor de productos 'realtime' sirviendose de websockets para facilidad de testeo de enpoints

# Setup
---
Previo al startup, el servidor verifica que existan las siguientes variables de ambiente:
- `ECOM_DB_URI`: **REQUERIDA**. Url de conexion de mongo, sin contener la base de datos y sin "/" al final.
- `ECOM_DB_USER`: **OPCIONAL** Nombre de usuario de mongoDB, con permisos de read-write a la db **ecommerce**
- `ECOM_DB_PWD`: **OPCIONAL** Contraseña del usuario



## Comandos

- `start`: Inicia la version de producción del servidor
- `dev`: Inicia la version de desarrollo del servidor
- `gen`: genera un listado de `productGenerator.js/AMT` productos en el path especificado en `lib.js/PRODUCTS_PATH`
