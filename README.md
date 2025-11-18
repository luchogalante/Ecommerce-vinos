Ecommerce de Vinos – Entrega  Final Backend 1 

Este proyecto implementa un backend con Node.js, Express y MongoDB para gestionar productos y carritos de compra. Incluye paginación, filtros, ordenamientos, manejo completo de carritos y vistas con Handlebars.

Funcionalidades principales
Productos

Listado con paginación, filtros y ordenamiento.

Filtro por categoría o disponibilidad mediante el parámetro query.

Ordenamiento ascendente o descendente por precio con sort.

Soporte para limit y page.

Endpoints CRUD completos para productos.

Vista /products con paginación.

Carritos

Crear carrito.

Agregar productos.

Eliminar productos específicos.

Actualizar cantidad de un producto.

Reemplazar el contenido completo del carrito.

Vaciar carrito.

Vista /carts/:cid que muestra el carrito con productos poblados mediante populate.

Vistas (Handlebars)

home: listado inicial de productos.

products: productos paginados con botón para agregar al carrito.

cart: visualización detallada de un carrito.

realTimeProducts: actualización de productos en tiempo real (socket).

Tecnologías utilizadas

Node.js

Express

MongoDB + Mongoose

Handlebars

Mongoose Paginate

WebSockets (para la vista de productos en tiempo real)

Instalación

Clonar el repositorio.

Instalar dependencias:

npm install


Configurar la conexión a MongoDB en app.js.

Iniciar el servidor:

npm start


Acceder a las vistas:

http://localhost:8080/products

http://localhost:8080/carts/:cid

