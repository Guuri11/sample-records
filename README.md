# Sample Records
Proyecto Symfony y React JS simulando la web de una discográfica

# Introducción
Proyecto final del grado superior de DAW 2019-2020. Se trata de una aplicación que simula la gestión total de una discográfica con Symfony 5 en el Backend y React JS en el Frontend. 

Los servicios que ofrece son:
- Gestión de usuarios
- Gestión de noticias
- Gestión de ventas y productos
- Gestión de ventas de tickets de los eventos de los artistas
- Una plataforma de música inspirada en Spotify

# Requisitos
- Composer
- Node JS +v10
- NPM
- Yarn
- Symfony 5

# Instalación
- Descarga el repositorio en tu equipo
- Instalar las dependencias con:

`$ composer install`

`$ npm install`

`$ yarn install`

En caso de fallar la instalación puede ser por falta de alguna extensión de PHP
- Ejecutar Webpack para generar los "assets"

`$ yarn encore dev`
- Importar *sample-records.sql* en una base de datos vacia.
- Crear un usuario para la base de datos
- Configurar el fichero .env con los datos de configuración de la base de datos, el entorno de la aplicación y la configuración del correo (sino no funcionará SwiftMailer y la página de contacto)
- Arrancar el servidor de Symfony
