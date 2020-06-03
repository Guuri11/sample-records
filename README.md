# sample-records
Proyecto Symfony y React JS simulando la web de una discográfica

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
