-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 30-05-2020 a las 15:07:15
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `sample-records`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `album`
--

CREATE TABLE `album` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `duration` int(11) DEFAULT NULL,
  `released_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `artist_id` int(11) DEFAULT NULL,
  `image_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_size` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `album`
--

INSERT INTO `album` (`id`, `name`, `price`, `duration`, `released_at`, `created_at`, `updated_at`, `artist_id`, `image_name`, `image_size`) VALUES
(2, 'Un perro andaluz', 10, 887, '2020-04-09 00:00:00', '2020-04-10 00:00:00', '2020-04-10 10:55:45', 6, 'delaossa-unperroandaluz.jpg', 211568),
(3, 'Backstreet Dose', 12, 954, '2020-04-06 00:00:00', '2020-04-10 11:18:13', '2020-05-22 20:53:27', 4, 'jdose-backstreetdose-5ec817327b2e4.jpg', 86919),
(39, 'Son de esas', 12, 0, '2020-05-24 00:00:00', '2020-05-24 15:41:53', '2020-05-24 15:41:53', 2, 'elane-sondeesas-5eca79a1b86de.jpg', 234);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `artist`
--

CREATE TABLE `artist` (
  `id` int(11) NOT NULL,
  `name` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `alias` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(75) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth` date DEFAULT NULL,
  `is_from` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` varchar(750) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `image_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_size` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `artist`
--

INSERT INTO `artist` (`id`, `name`, `alias`, `surname`, `birth`, `is_from`, `bio`, `created_at`, `updated_at`, `image_name`, `image_size`) VALUES
(1, 'Luís', 'Luisaker', NULL, '2015-10-04', 'Alicante', 'Luisaker es originario de Alicante, este Mc no llegó a su punto de triunfo en su trayectoria músical, peró se ve que está por llegar. Tiene 19 años con una enorme classe al rapear, con unas medidas de nivel professional, participante en guerra de gallos, (Freestyle), demostró que tiene un enorme talento peró tiene bastante que sugerir aún.', '2020-04-08 19:15:55', '2020-04-09 20:46:18', 'luisaker.jpg', 33282),
(2, 'Elane', 'Elane', 'Elane Meta', '2015-04-08', 'Barcelona', NULL, '2020-04-08 19:15:55', '2020-04-09 20:46:04', 'elane-artemisa.jpg', 39496),
(3, 'Santa', 'Santa Salut', 'Cebrià', '2015-06-21', 'Sabadell (Cataluña)', 'Va fer la seva primera aparició l\'any 2017. Les lletres de la seva obra són de denuncia social i de temàtica anticapitalista, antifeixista, antiracista, i feminista. Ha fet col·laboracions amb altres cantants de rap com són SWIT EME,[2] Adala, i Las Ninyas del Corro, així com amb la banda de punk oi Kaos Urbano. Su primera aparación fue en 2017. Las letras de su obra son de denuncia social y de temática anticapitalista, antifascista, antiracista y feminista. Ha hecho colaboraciones con otros artistas como Swit EME, Adala, Kaos Urbano.', '2020-04-08 19:44:33', '2020-04-09 20:45:51', 'santasalut.jpeg', 110015),
(4, 'Javi', 'J Dose', NULL, '2020-04-08', 'Salamanca', '', '2020-04-08 19:44:00', '2020-05-23 15:19:25', 'jdose.jpg', 148867),
(5, 'Bárbara', 'Babi', NULL, '1999-07-06', 'Madrid', 'Una de las artistas más emergentes del panorama nacional, la madrileña de 20 años: Babi. Para ella la música es algo terapeutico y quiero transmitir sus sentimiendos a todo el mundo.', '2020-04-09 20:45:30', '2020-04-09 20:58:58', 'babi.png', 909245),
(6, 'Delaossa', 'Delaossa', 'Picasso', '1993-01-01', 'Barrio Pescadores (Málaga)', 'Con 12 años le empezó a interesar la música: después de Cypress Hill vinieron Hablando en Plata y Tote King o Kase-O y tras años rapeando con sus amigos y unos litros sobre bases que sonaban en coches con los maleteros abiertos ha llegado su primer disco, Un perro andaluz.', '2020-04-09 20:53:06', '2020-05-22 21:29:59', 'delaossa-5ec828377339c.jpg', 85458),
(27, 'Sergi', 'Sergi OR', 'Ortolà Rovira', '1999-12-15', 'Ondara', 'Vive desde siempre en Ondara y desde muy joven empezó a componer sus propios temas de rap y poesia', '2020-05-23 21:50:23', '2020-05-23 21:51:16', 'artist-default-5ec97eb46c7a0.png', 123);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `category`
--

INSERT INTO `category` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'camisetas', '2020-04-11 14:28:07', '2020-04-11 14:28:07'),
(2, 'sudaderas', '2020-04-11 14:28:04', '2020-04-11 14:28:04'),
(3, 'fundas de móvil', '2020-04-11 14:28:01', '2020-05-22 21:41:23'),
(4, 'discos', '2020-04-11 14:27:58', '2020-04-11 14:27:58'),
(11, 'mochilas', '2020-05-24 13:37:24', '2020-05-24 13:37:24');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `comment` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `event_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `post_id` int(11) DEFAULT NULL,
  `purchase_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `comment`
--

INSERT INTO `comment` (`id`, `comment`, `created_at`, `updated_at`, `user_id`, `event_id`, `product_id`, `post_id`, `purchase_id`) VALUES
(45, 'Brutal!!', '2020-05-19 12:36:48', '2020-05-19 12:36:48', 39, 14, NULL, NULL, NULL),
(53, 'el segundo piso', '2020-05-21 16:09:44', '2020-05-21 16:09:44', NULL, NULL, NULL, NULL, 36),
(54, 'Muy cómoda, me gusta mucho!!', '2020-05-25 14:03:30', '2020-05-25 14:03:30', 39, NULL, 14, NULL, NULL),
(55, 'La compro!!', '2020-05-26 18:19:04', '2020-05-26 18:19:04', 39, 13, NULL, NULL, NULL),
(56, 'Es el tercer piso, puerta B', '2020-05-26 18:58:31', '2020-05-26 18:58:31', NULL, NULL, NULL, NULL, 39),
(57, 'Es el tercer piso, puerta B', '2020-05-26 18:58:31', '2020-05-26 18:58:31', NULL, NULL, NULL, NULL, 40),
(58, 'Es el tercer piso, puerta B', '2020-05-26 18:58:31', '2020-05-26 18:58:31', NULL, NULL, NULL, NULL, 41);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `event`
--

CREATE TABLE `event` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `place` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `prefix_serial_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `artist_id` int(11) DEFAULT NULL,
  `image_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_size` int(11) NOT NULL,
  `ticket_quantity` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `event`
--

INSERT INTO `event` (`id`, `name`, `place`, `city`, `country`, `date`, `prefix_serial_number`, `created_at`, `updated_at`, `artist_id`, `image_name`, `image_size`, `ticket_quantity`) VALUES
(12, 'Streetback Dose Tour', 'Pabellón La Fonteta Sant Lluís', 'Valencia', 'España', '2020-06-15', 'SDT1', '2020-05-19 12:17:20', '2020-05-20 23:43:00', 4, 'jdose-backstreetdose.jpg', 86919, 48),
(13, 'Un perro andaluz Tour', 'La caja mágica', 'Madrid', 'España', '2020-05-22', 'UPA1', '2020-05-19 12:19:53', '2020-05-22 23:49:09', 6, 'delaossa-event.jpg', 820572, 50),
(14, 'Salut Tour', 'Don Diego López Haro', 'Bilbao', 'España', '2020-06-19', 'SST1', '2020-05-19 12:23:03', '2020-05-26 18:58:31', 3, 'santasalut-event.jpeg', 820572, 48),
(15, 'Babi Tour', 'Palau Sant Jordi', 'Barcelona', 'España', '2020-09-25', 'BT1', '2020-05-23 23:42:30', '2020-05-24 00:02:04', 5, 'babi-5ec99d5c9d7f9.png', 123, 25);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `migration_versions`
--

CREATE TABLE `migration_versions` (
  `version` varchar(14) COLLATE utf8mb4_unicode_ci NOT NULL,
  `executed_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `migration_versions`
--

INSERT INTO `migration_versions` (`version`, `executed_at`) VALUES
('20200408160803', '2020-04-08 16:08:17'),
('20200408161535', '2020-04-08 16:15:44'),
('20200408161633', '2020-04-08 16:16:36'),
('20200408161947', '2020-04-08 16:19:52'),
('20200408162602', '2020-04-08 16:26:06'),
('20200408173603', '2020-04-08 17:36:10'),
('20200408173737', '2020-04-08 17:37:42'),
('20200408174146', '2020-04-08 17:41:49'),
('20200408174336', '2020-04-08 17:43:39'),
('20200408175331', '2020-04-08 17:53:33'),
('20200409091255', '2020-04-09 09:13:04'),
('20200409102308', '2020-04-09 10:23:12'),
('20200409110450', '2020-04-09 11:05:28'),
('20200409145905', '2020-04-09 14:59:14'),
('20200409154515', '2020-04-09 15:45:23'),
('20200409161146', '2020-04-09 16:11:49'),
('20200409165055', '2020-04-09 16:50:59'),
('20200409165137', '2020-04-09 16:51:41'),
('20200410085955', '2020-04-10 09:00:01'),
('20200410120002', '2020-04-10 12:00:07'),
('20200410120309', '2020-04-10 12:03:12'),
('20200411122356', '2020-04-11 12:24:01'),
('20200411144507', '2020-04-11 14:45:13'),
('20200412094235', '2020-04-12 09:42:42'),
('20200416154510', '2020-04-16 15:45:24'),
('20200416155213', '2020-04-16 15:52:18'),
('20200416155329', '2020-04-16 15:53:34'),
('20200418161215', '2020-04-18 16:12:21'),
('20200420085352', '2020-04-20 08:53:59'),
('20200420085639', '2020-04-20 08:56:42'),
('20200510103114', '2020-05-17 21:02:08'),
('20200510103154', '2020-05-17 21:02:08'),
('20200510103257', '2020-05-17 21:02:08'),
('20200510103522', '2020-05-17 21:02:08'),
('20200510103647', '2020-05-17 21:02:09'),
('20200517205838', '2020-05-17 21:02:09'),
('20200517210911', '2020-05-17 21:09:15'),
('20200519082801', '2020-05-19 08:28:12'),
('20200523094502', '2020-05-23 09:45:10'),
('20200523214856', '2020-05-23 21:49:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `post`
--

CREATE TABLE `post` (
  `id` int(11) NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(1200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `artist_id` int(11) DEFAULT NULL,
  `image_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_size` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `post`
--

INSERT INTO `post` (`id`, `title`, `description`, `created_at`, `updated_at`, `artist_id`, `image_name`, `image_size`) VALUES
(2, 'Santa Salut saca su nuevo tema, MORFEO', 'Tras haber superado la barrera de los 100 mil suscriptores en YouTube, Santa Salut quiere celebrarlo con todos ellos y qué mejor forma de hacerlo que liberando nuevo material desde la plataforma.  ‘Morfeo’ es el título de su nuevo videoclip.', '2020-04-10 13:58:26', '2020-04-17 10:22:48', 3, 'santasalut-morfeo.jpg', 44246),
(3, 'Delaossa empieza el tour de su nuevo disco, \"Un perro anzaluz\"', 'El artista malagueño Delaossa, co-creador del colectivo musical Space Hammu, publicó este último año «Un perro andaluz», su primer disco en solitario. Las composiciones del rapero siempre se han caracterizado por hablar sobre la crudeza y la profundidad del día a día y de sus actividades cotidianas.  Con solo un álbum bajo el brazo, Delaossa ya ha girado por Latinoamérica y se ha conseguido colar en las listas de tendencias de YouTube. Al otro lado del charco viajó con Space Hammu, y en YouTube tuvo mucho éxito con el tema “Dicen de mí”, una canción que habla sobre aquella “señora con pañuelo a la que le acaban de dar quimio, sobre los chavales que rondan su barrio, sobre los que se levantan a pulso y curran 12 horas y sobre las calles que le han visto crecen en los últimos años de su vida”.  Pero todo este éxito repentino tiene una explicación y un sentido, y es que el joven de Málaga ya apuntaba maneras desde pequeño. Con 12 años le empezó a interesar el mundo de la música: escuchaba a sus ídolos en casa (Hablando en Plata, Triple X, Kase-O) y rapeaba con sus amigos en la plaza. Con esto Delaossa presenta su Tour empezando por Madrid.', '2020-04-10 14:04:43', '2020-04-11 20:12:32', 6, 'delaossa-event.jpg', 820572),
(4, '¡BackStreet Dose Tour empieza! J Dose sale con todo', 'J Dose vuelve a la carga con un nuevo disco llamado \"Backstreetdose\". El álbum compuesto de un total de 12 cortes en los que aparecen 2 colaboraciones vocales correspondiente a Alber Stewar (su compañero en el grupo Los Chicos de la lluvia) y Fernandocosta. Su primer concierto será en Valencia.', '2020-04-10 14:07:19', '2020-05-23 16:52:17', 4, 'jdose-backstreetdose.jpg', 86919),
(12, '¡Sergi OR firma con Sample Records!', 'El joven ondarense de 20 años ha firmado con Sample Records por 2 años, nos gustó mucho sus letras y lo queríamos con ansias en nuestro equipo, tenemos un FI-CHA-ZO. Échale un vistazo a sus canciones en SR Music o busca algunos de sus videos de Youtube en su perfil de Sample Records. Bienvenido Sergi!', '2020-05-23 22:21:36', '2020-05-24 17:18:23', 27, 'artist-default-5ec985fd891cb.png', 123),
(17, 'Elane saca su primer disco, \"SON DE ESAS\"', 'Elane presenta su primer EP llamado \"Son de esas\". Se espera que esté completado este 2020, ya que constará de 6 tracks que irán saliendo en forma de videoclips cada 2 meses aproximadamente. Se desconoce si habrá colaboraciones o no. De momento ya podemos ver hasta 3 videoclips de adelanto de su nuevo trabajo\n\nsrc: https://www.hhgroups.com/albumes/elane/son-de-esas-53685/', '2020-05-24 16:14:27', '2020-05-24 16:14:28', 2, 'elane-sondeesas-5eca8144b8512.jpg', 123);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `post_tag`
--

CREATE TABLE `post_tag` (
  `post_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `post_tag`
--

INSERT INTO `post_tag` (`post_id`, `tag_id`) VALUES
(2, 2),
(2, 3),
(3, 1),
(12, 11),
(17, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `discount` double DEFAULT NULL,
  `size` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `stock` int(11) NOT NULL,
  `avaiable` tinyint(1) NOT NULL,
  `description` varchar(800) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `artist_id` int(11) DEFAULT NULL,
  `image_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_size` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `product`
--

INSERT INTO `product` (`id`, `name`, `price`, `discount`, `size`, `stock`, `avaiable`, `description`, `created_at`, `updated_at`, `category_id`, `artist_id`, `image_name`, `image_size`) VALUES
(2, 'Sudadera - Babi', 35, 0, 'única', 50, 1, 'Sudadera de Babi con materiales 50% algodón y 50% poliéster de 280g/m2. Diseño con capucha, con cordones a juego y bolsillo frontal.', '2020-04-10 12:52:30', '2020-05-18 10:57:13', 2, 5, 'babi_sweatshirt.png', 34465),
(3, 'Camiseta - Babi', 15, 0, 'unica', 50, 1, 'Camiseta blanca con el logo y nombre de Babi', '2020-04-10 12:56:34', '2020-04-10 12:56:34', 1, 5, 'babi_tshirt.png', 43380),
(4, 'Un perro andaluz', 10, 0, NULL, 45, 1, 'Nuevo disco de Delaossa y J.Moods \"Un Perro Andaluz\"', '2020-04-10 12:58:10', '2020-04-10 12:58:10', 4, 6, 'delaossa-unperroandaluz.jpg', 211568),
(5, 'Backstreet Dose', 10, 0, NULL, 44, 1, 'Nuevo disco del artista J Dose, \"Backstreet Dose\".', '2020-04-10 12:58:53', '2020-05-20 20:44:06', 4, 4, 'jdose-backstreetdose.jpg', 86919),
(6, 'Sudadera - J Dose', 34.99, 0, 'unica', 49, 1, 'Sudadera con Capucha Unisex de J Dose es la tradicional sudadera con capucha y bolsillo canguro. Tejido de poliéster y algodón.', '2020-04-10 13:03:22', '2020-05-20 15:21:37', 2, 4, 'jdose_sweatshirt.png', 58049),
(7, 'Sudadera \"Si tu perro\" - Luisaker', 15, 0, 'unica', 49, 1, 'Sudadera del perreo favorito del rap y de nuestro artista Alicantino Luisaker.', '2020-04-10 13:05:05', '2020-05-26 18:58:31', 2, 1, 'luisaker_sweatshirt.png', 33140),
(8, 'Funda IPhone', 4.99, 0, NULL, 50, 1, 'Funda de IPhone con el logo de Sample Records', '2020-04-10 13:06:07', '2020-04-10 13:06:07', 3, NULL, 'sr_phonecase.png', 18804),
(9, 'Sudadera SR', 27.99, 0, NULL, 50, 1, 'Sudadera Sample Records con capucha y bolsillos.', '2020-04-10 13:07:01', '2020-05-23 16:53:56', 4, NULL, 'sr_sweatshirt.png', 26849),
(10, 'Camiseta SR', 9.99, 0, NULL, 50, 1, 'Camiseta Sample Records', '2020-04-10 13:07:39', '2020-04-10 13:07:39', 1, NULL, 'sr_tshirt.png', 38493),
(14, 'Mochila para portátil SR', 21.99, 0, NULL, 13, 1, 'Mantén tus manos libres y tu portátil seguro gracias a la mochila SR de 17,3\", diseñada para acompañarte a la oficina y sobre la marcha. Está equipada con cremalleras preparadas para candado(1), un bolsillo RFID seguro y espacio para un dispositivo con un tamaño máximo de 17,3\" en diagonal, teléfono, accesorios y mucho más.', '2020-05-24 13:37:07', '2020-05-26 18:58:31', 11, NULL, 'backpack-sr-5eca5c65d1873.png', 1234);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `purchase`
--

CREATE TABLE `purchase` (
  `id` int(11) NOT NULL,
  `serial_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `time` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '(DC2Type:dateinterval)',
  `received` tinyint(1) NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `town` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `final_price` double NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `comment` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `purchase`
--

INSERT INTO `purchase` (`id`, `serial_number`, `date`, `time`, `received`, `address`, `town`, `city`, `country`, `final_price`, `created_at`, `updated_at`, `user_id`, `comment`) VALUES
(27, 'LQK3Y-CM075-A9ZK3-RT48D', '2020-05-21', NULL, 0, 'C/Falsa 123', 'Ondara', 'Alicante', 'España', 26.5905, '2020-05-19 10:08:25', '2020-05-19 10:08:25', 39, NULL),
(28, 'QB75P-7LV88-4H9G9', '2020-05-21', NULL, 0, 'C/Falsa 123', 'Ondara', 'Alicante', 'España', 14.25, '2020-05-19 12:37:06', '2020-05-19 12:37:06', 39, NULL),
(29, 'F0BBS-4ACT5-JS15V', '2020-05-22', NULL, 0, 'C/Falsa 123', 'Ondara', 'Alicante', 'España', 26.5905, '2020-05-20 15:20:34', '2020-05-20 15:20:34', 39, NULL),
(30, 'KV25W-E874A-ZBSQP', '2020-05-22', NULL, 0, 'C/Falsa 123', 'Ondara', 'Alicante', 'España', 26.5905, '2020-05-20 15:20:51', '2020-05-20 15:20:51', 39, NULL),
(31, 'RY288-NNSWQ-TTOFH', '2020-05-22', NULL, 0, 'C/Falsa 123', 'Ondara', 'Alicante', 'España', 26.5905, '2020-05-20 15:21:14', '2020-05-20 15:21:14', 39, NULL),
(32, 'X7SMK-9VZJK-IDZBR', '2020-05-22', NULL, 0, 'C/Falsa 123', 'Ondara', 'Alicante', 'España', 11.4, '2020-05-20 15:21:37', '2020-05-20 15:21:37', 39, NULL),
(33, 'S2SO1-FIMAL-UQV30', '2020-05-22', NULL, 0, 'C/Falsa 123', 'Ondara', 'Alicante', 'España', 33.2405, '2020-05-20 15:21:37', '2020-05-20 15:21:37', 39, NULL),
(35, '9WX40-42GLD-I8LYL', '2020-05-22', NULL, 0, 'C/Falsa 123', 'Ondara', 'Alicante', 'España', 11.4, '2020-05-20 23:43:00', '2020-05-20 23:43:00', 39, 'Es el segundo piso'),
(36, 'MPKPJ-TLLLU-CM46H', '2020-05-23', '+P00Y00M01DT07H50M16S', 1, 'C/Falsa 123', 'Ondara', 'Alicante', 'España', 26.59, '2020-05-21 16:09:44', '2020-05-23 13:26:59', 39, 'el segundo piso'),
(37, 'KR5JC-8OJH0-RCWOU', '2020-05-26', NULL, 0, 'C/Ondara n°16', 'Dénia', 'Alicante', 'España', 21.99, '2020-05-24 13:40:33', '2020-05-24 13:40:33', NULL, NULL),
(38, 'TG9XY-TS3CC-SW1SG', '2020-05-27', NULL, 0, 'C/Falsa 123', 'Ondara', 'Alicante', 'España', 20.8905, '2020-05-25 14:03:08', '2020-05-25 14:03:08', 39, NULL),
(39, 'RDBBX-KAJ0P-8E2RF', '2020-05-28', NULL, 0, 'C/Falsa 123', 'Ondara', 'Alicante', 'España', 20.8905, '2020-05-26 18:58:31', '2020-05-26 18:58:31', 39, 'Es el tercer piso, puerta B'),
(40, 'W8CAU-5JS2Q-OCFMD', '2020-05-28', NULL, 0, 'C/Falsa 123', 'Ondara', 'Alicante', 'España', 14.25, '2020-05-26 18:58:31', '2020-05-26 18:58:31', 39, 'Es el tercer piso, puerta B'),
(41, 'L3VI1-D2GWN-9UP90', '2020-05-28', NULL, 0, 'C/Falsa 123', 'Ondara', 'Alicante', 'España', 14.25, '2020-05-26 18:58:31', '2020-05-26 18:58:31', 39, 'Es el tercer piso, puerta B');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `purchase_product`
--

CREATE TABLE `purchase_product` (
  `purchase_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `purchase_product`
--

INSERT INTO `purchase_product` (`purchase_id`, `product_id`) VALUES
(27, 9),
(29, 9),
(30, 9),
(31, 9),
(33, 6),
(36, 9),
(37, 14),
(38, 14),
(39, 14),
(40, 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `purchase_ticket`
--

CREATE TABLE `purchase_ticket` (
  `purchase_id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `purchase_ticket`
--

INSERT INTO `purchase_ticket` (`purchase_id`, `ticket_id`) VALUES
(28, 132),
(32, 32),
(35, 32),
(41, 132);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `song`
--

CREATE TABLE `song` (
  `id` int(11) NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `duration` int(11) NOT NULL,
  `video_src` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `released_at` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `artist_id` int(11) DEFAULT NULL,
  `album_id` int(11) DEFAULT NULL,
  `song_file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_size` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `song`
--

INSERT INTO `song` (`id`, `name`, `duration`, `video_src`, `released_at`, `created_at`, `updated_at`, `artist_id`, `album_id`, `song_file_name`, `image_name`, `image_size`) VALUES
(3, 'Colegas', 244, 'https://www.youtube.com/embed/zDcBO_RVU58', '2019-09-01 00:00:00', '2020-04-10 10:36:50', '2020-04-10 10:36:50', 5, NULL, 'babi-colegas.mp3', 'babi-colegas.jpg', 30264),
(4, 'Devuélmelo', 242, 'https://www.youtube.com/embed/PeyuymuiPbU', '2019-10-31 00:00:00', '2020-04-10 10:38:34', '2020-04-10 10:38:34', 5, NULL, 'babi-devuelvemelo.mp3', 'babi-devuelvemelo.jpg', 54414),
(5, 'Stressed Out', 233, 'https://www.youtube.com/embed/O85KUSOlST8', '2019-10-03 00:00:00', '2020-04-10 10:40:14', '2020-04-10 10:40:14', 5, NULL, 'babi-ft-ly-raine-stressed-out.mp3', 'babi-stressedout.jpg', 35294),
(6, 'Lo sabia', 197, 'https://www.youtube.com/embed/1uaPOEyeBHU', '2016-01-16 00:00:00', '2020-04-10 10:42:02', '2020-04-10 10:42:02', 5, NULL, 'babi-ft-miranda-lo-sabia.mp3', 'babi-losabia.jpg', 125971),
(7, 'Game Ova', 244, 'https://www.youtube.com/embed/Bi6w8gmDXYM', '2019-12-16 00:00:00', '2020-04-10 10:44:21', '2020-04-10 10:44:21', 5, NULL, 'babi-game-ova.mp3', 'babi-gameova.jpg', 70034),
(8, 'Tommy Hill', 231, 'https://www.youtube.com/embed/aGRyQAaPIHg', '2020-04-27 00:00:00', '2020-04-10 11:20:23', '2020-05-24 16:08:57', 6, 2, 'DELAOSSA-J-MOODS-TOMMY-HILL-ft-EASY-S-UN-PERRO-ANDALUZ.mp3', 'delaossa-unperroandaluz.jpg', 211568),
(9, 'Dicen de mi', 235, 'https://www.youtube.com/embed/PI6xHzUpFOE', '2020-04-09 00:00:00', '2020-04-10 11:22:36', '2020-04-10 11:22:36', 6, 2, 'DELAOSSA-J-MOODS-DICEN-DE-MI-UN-PERRO-ANDALUZ.mp3', 'delaossa-unperroandaluz.jpg', 211568),
(10, 'Pura sangre', 214, 'https://www.youtube.com/embed/Lh3LAGFDGrQ', '2020-04-08 00:00:00', '2020-04-10 11:24:59', '2020-04-10 11:24:59', 6, 2, 'DELAOSSA-J-MOODS-PURA-SANGRE-ft-METRICAS-FRIAS.mp3', 'delaossa-unperroandaluz.jpg', 211568),
(11, 'Artemisa', 169, 'https://www.youtube.com/embed/9V3O4WS9AqM', '2020-02-15 00:00:00', '2020-04-10 11:26:41', '2020-04-10 11:26:41', 3, NULL, 'ELANE-ARTEMISA.mp3', 'elane-artemisa.jpg', 39496),
(12, 'Atomos', 224, 'https://www.youtube.com/embed/QazYB6Oye-M', '2019-11-24 00:00:00', '2020-04-10 11:28:35', '2020-05-24 15:43:31', 2, 39, 'ELANE-ATOMOS-SONDEESAS.mp3', 'elane-atomos.jpg', 90999),
(13, 'Hiprofenia', 157, 'https://www.youtube.com/embed/8Xp6hW3rfV0', '2020-01-29 00:00:00', '2020-04-10 11:31:52', '2020-05-24 15:44:21', 2, 39, 'ELANE-HIPROFENIA-SONDEESAS.mp3', 'elane-hiprofenia.jpg', 82151),
(14, 'Histérica', 91, 'https://www.youtube.com/embed/BkjgiVP4PlE', '2020-04-04 00:00:00', '2020-04-10 11:33:09', '2020-05-23 15:59:13', 2, NULL, 'ELANE-ARTEMISA-5ec92c1d8fe61.mp3', 'elane-histerica-5ec92c312729c.jpg', 53594),
(15, 'Al aire', 223, 'https://www.youtube.com/embed/Kh3qyYJ5CFc', '2019-01-23 00:00:00', '2020-04-10 11:39:56', '2020-04-10 11:39:56', 4, 3, 'JDose-AL-AIRE-BackStreetDose.mp3', 'jdose-backstreetdose.jpg', 86919),
(16, 'Pa\' no hablar contigo', 323, 'https://www.youtube.com/embed/ZgqZKaODgLc', '2020-04-01 00:00:00', '2020-04-10 11:45:53', '2020-04-10 11:45:53', 4, NULL, 'JDose-PA-NO-HABLAR-CONTIGO-5e90405180611.mpga', 'jdose-panohablarcontigo.jpg', 59241),
(17, 'Dale', 277, 'https://www.youtube.com/embed/dtsxNuHyXj8', '2020-03-06 00:00:00', '2020-04-10 11:48:21', '2020-04-10 11:48:21', 4, 3, 'JDOSE-BACKSTREETDOSE-Dale.mp3', 'jdose-backstreetdose.jpg', 86919),
(18, 'Lo quiero', 173, 'https://www.youtube.com/embed/vzkdnNCHZi8', '2019-09-20 00:00:00', '2020-04-10 11:54:45', '2020-04-10 13:55:25', 4, 3, 'JDOSE-BACKSTREETDOSE-Lo-quiero.mp3', 'jdose-backstreetdose.jpg', 86919),
(19, 'Ya vendrá', 171, 'https://www.youtube.com/embed/8AGuX-umfRA', '2019-09-20 00:00:00', '2020-04-10 12:03:07', '2020-04-10 12:03:07', 4, 3, 'JDOSE-BACKSTREETDOSE-Ya-vendre.mp3', 'jdose-backstreetdose.jpg', 86919),
(20, 'De niños querian ser Kase', 225, 'https://www.youtube.com/embed/iD5Mao8ZUuA', '2019-10-07 00:00:00', '2020-04-10 12:05:49', '2020-04-10 12:05:49', 4, 3, 'JDose-DE-NINOS-QUERIAN-SER-KASE-BackStreetDose.mp3', 'jdose-backstreetdose.jpg', 86919),
(21, 'Que cosa fuera', 402, 'https://www.youtube.com/watch?v=az23nRJZGt8', '2020-03-06 00:00:00', '2020-04-10 12:08:22', '2020-04-10 12:08:22', 4, 3, 'JDose-QUE-COSA-FUERA.mp3', 'jdose-backstreetdose.jpg', 86919),
(22, 'Dicen', 124, 'https://www.youtube.com/embed/ilTf3tBFgBs', '2019-10-18 00:00:00', '2020-04-10 12:09:52', '2020-04-10 12:09:52', 1, NULL, 'LUISAKER-DICEN.mp3', 'luisaker-dicen.jpg', 249156),
(23, 'Falta', 154, 'https://www.youtube.com/embed/owd0xzcRozY', '2019-11-30 00:00:00', '2020-04-10 12:11:14', '2020-04-10 12:11:14', 1, NULL, 'LUISAKER-FALTA.mp3', 'luisaker-falta.jpg', 89312),
(24, 'Mamá', 233, 'https://www.youtube.com/embed/SrfPwtlJHYs', '2019-09-23 00:00:00', '2020-04-10 12:13:01', '2020-04-10 12:13:01', 1, NULL, 'LUISAKER-MAMA.mp3', 'luisaker-mama.jpg', 54835),
(25, 'Nítido', 247, 'https://www.youtube.com/embed/Fmpl1TJEC08&t=8s', '2020-03-13 00:00:00', '2020-04-10 12:14:48', '2020-04-10 12:14:48', 1, NULL, 'LUISAKER-NITIDO.mp3', 'luisaker-nitido.jpg', 76360),
(26, 'Quédate', 147, 'https://www.youtube.com/embed/1XjmNWEDigw', '2020-04-01 00:00:00', '2020-04-10 12:23:34', '2020-04-10 12:23:34', 1, NULL, 'LUISAKER-QUEDATE.mp3', 'luisaker-quedate.jpg', 79461),
(27, 'Si tu perro', 148, 'https://www.youtube.com/embed/pWt-DNYDqg4', '2019-08-23 00:00:00', '2020-04-10 12:27:23', '2020-04-10 12:27:23', 1, NULL, 'LUISAKER-SI-TU-PERRO.mp3', 'luisaker-situperro.jpg', 105913),
(28, '90 retro', 123, 'https://www.youtube.com/embed/-IYpsT9cS1k', '2019-01-01 00:00:00', '2020-04-10 12:28:59', '2020-04-10 12:28:59', 3, NULL, 'SANTA-SALUT-90RETRO.mp3', 'santasalut-90retro.jpg', 233900),
(29, 'Bastardas', 220, 'https://www.youtube.com/embed/oxgA5VJrgJw', '2019-01-23 00:00:00', '2020-04-10 12:31:01', '2020-04-10 12:31:01', 3, NULL, 'SANTA-SALUT-BASTARDAS.mp3', 'santasalut-bastardas.jpg', 139555),
(30, 'Herida abierta', 153, 'https://www.youtube.com/embed/XPN92y6lrDI', '2019-08-29 00:00:00', '2020-04-10 12:32:20', '2020-04-10 12:32:20', 3, NULL, 'SANTA-SALUT-HERIDA-ABIERTA.mp3', 'santasalut-heridaabierta.jpg', 56998),
(31, 'Morfeo', 150, 'https://www.youtube.com/embed/50EyNpZNTQE', '2020-04-04 00:00:00', '2020-04-10 12:39:45', '2020-04-10 12:39:45', 3, NULL, 'SANTA-SALUT-MORFEO.mp3', 'santasalut-morfeo.jpg', 44246),
(32, 'Retroexplosivo', 132, 'https://www.youtube.com/embed/CIZ_YimzniE', '2019-06-12 00:00:00', '2020-04-10 12:41:40', '2020-04-10 12:41:40', 3, NULL, 'SANTA-SALUT-RETROEXPLOSIVO.mp3', 'santasalut-retroexplosivo.jpg', 85189),
(36, 'Me sabe mal', 240, 'https://www.youtube.com/embed/QRgtwh6N4UA', '2020-05-16 00:00:00', '2020-05-24 15:34:47', '2020-05-24 15:58:35', 5, NULL, 'babi-me_sabe_mal-5eca7d8b237ff.mp3', 'babi-mesabemal-5eca77f822f7d.jpg', 1234),
(37, 'Let it go', 227, 'https://www.youtube.com/embed/sNHLLTcWh2M', '2020-05-21 00:00:00', '2020-05-24 15:36:50', '2020-05-24 15:56:17', 6, 2, 'DELAOSSA-Let_It_Go-5eca7d012dc0c.mp3', 'delaossa-unperroandaluz-5eca7873c6c72.jpg', 1234),
(38, 'El rap cura', 250, 'https://www.youtube.com/embed/5a802-KHv-U', '2020-05-09 00:00:00', '2020-05-24 15:49:50', '2020-05-24 15:58:55', 2, 39, 'ELANE_&_SANTA_SALUT-EL_RAP_CURA-5eca7d9f468bd.mp3', 'elane-elrapcura-5eca7b7f5f6be.jpg', 1234),
(39, 'Sin mirar atrás', 287, 'https://www.youtube.com/embed/VZubrs4HYCk', '2020-05-21 00:00:00', '2020-05-24 15:54:33', '2020-05-24 15:55:55', 4, NULL, 'JDose-SIN_MIRAR_ATRAS-5eca7ceb72810.mp3', 'jdose-sinmiraratras-5eca7c9ad435a.jpg', 1234),
(40, 'Yo les cantaré', 114, 'https://www.youtube.com/embed/lkfcphcyqcc', '2020-05-22 00:00:00', '2020-05-24 16:00:47', '2020-05-24 16:04:41', 3, NULL, 'SANTA_SALUT-YO_LES_CANTARe-5eca7ef9dba93.mp3', 'Santa_Salut-YOLESCANTARE-5eca7e1010c4a.png', 1234),
(45, 'Mimetizarme', 140, 'https://www.youtube.com/embed/Odv-LTo-Ni0', '2020-05-25 00:00:00', '2020-05-25 11:27:55', '2020-05-25 12:07:19', 27, NULL, 'sergior-mimetizarme-5ecb91e36d6ff.mpeg', 'sergi-ormimetizarme-5ecb8f9caadbb.jpg', 1234),
(46, 'Me mira un gato', 213, '', '2020-05-12 00:00:00', '2020-05-25 11:40:01', '2020-05-25 11:40:03', 27, NULL, 'sergior-memiraungato-5ecb927273348.mpeg', 'sergior-memiraungato-5ecb92730fb35.jpg', 1234);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tag`
--

CREATE TABLE `tag` (
  `id` int(11) NOT NULL,
  `tag` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tag`
--

INSERT INTO `tag` (`id`, `tag`, `created_at`, `updated_at`) VALUES
(1, 'conciertos', '2020-04-11 16:50:34', '2020-04-11 16:50:34'),
(2, 'canciones', '2020-04-11 16:50:29', '2020-05-22 15:56:44'),
(3, 'albums', '2020-04-11 16:50:25', '2020-04-11 16:50:25'),
(11, 'artistas', '2020-05-23 22:29:08', '2020-05-23 22:29:08');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ticket`
--

CREATE TABLE `ticket` (
  `id` int(11) NOT NULL,
  `serial_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` double NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `sold` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ticket`
--

INSERT INTO `ticket` (`id`, `serial_number`, `price`, `created_at`, `updated_at`, `event_id`, `sold`) VALUES
(32, 'SDT1UD7HV-222NC-FQ1CW', 12, '2020-05-19 12:17:20', '2020-05-20 23:43:00', 12, 1),
(33, 'SDT188LQT-EI1MW-2TUHJ', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(34, 'SDT1V2Y04-ALIBS-2LJ1Y', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(35, 'SDT1SPZI4-2UB32-N5Y97', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(36, 'SDT1GXLXB-19DJ4-PSYUL', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(37, 'SDT1CT3Q7-LIXN8-9TQOG', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(38, 'SDT1BVZQ0-3MWSO-CGOAO', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(39, 'SDT1DF7XD-41ZJ5-UBGGQ', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(40, 'SDT1GTSZJ-1TB2Q-551FW', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(41, 'SDT1KKPGZ-E0WS2-QW7HF', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(42, 'SDT1PTKHY-5D7L8-Q93G2', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(43, 'SDT1AGICD-6NCS9-8B4ZU', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(44, 'SDT1MAPAL-JZDCP-LISDW', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(46, 'SDT10MPXT-DIP12-QTCKD', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(47, 'SDT1XG6N2-UWBDK-2SB92', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(48, 'SDT1X40LI-JQA9N-XQ4H7', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(49, 'SDT13P76J-FEJ89-TM4M1', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(50, 'SDT11MID6-1FCDO-KFAR6', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(51, 'SDT17DX9J-53VQS-6Z9E0', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(52, 'SDT1Z75U3-RKXXQ-62V00', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(53, 'SDT1U02E4-J9GHE-6SFBB', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(54, 'SDT1IDVIF-PKXPE-POPIE', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(55, 'SDT1D687H-GS20N-R7TBI', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(56, 'SDT15X8UZ-OCD6V-2EJ9E', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(57, 'SDT1TJOKC-VC9VV-Y6JC1', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(58, 'SDT1PSCN2-ITP6N-X7SPX', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(59, 'SDT1YOB4E-KHS4X-JLRNU', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(60, 'SDT179OG9-P70J4-WE7VB', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(61, 'SDT15S0Q6-5Z4P0-RARGJ', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(62, 'SDT1X1NS2-9W357-K736R', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(63, 'SDT13YTTK-ETHZ0-L9U1S', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(64, 'SDT1KI3MZ-IGOT3-RP0J9', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(65, 'SDT1U2W2E-DQ22N-UJ5SL', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(66, 'SDT1NO66O-VYIKV-B618T', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(67, 'SDT1QN63H-K8235-A19AU', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(68, 'SDT11A934-MYRMU-WACNI', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(69, 'SDT1V6JYS-RSWA0-77YOJ', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(70, 'SDT1V1V3F-4BX1D-OW9PA', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(71, 'SDT1GNPGJ-H7AO6-CEDOA', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(72, 'SDT18HZ08-MBLTL-0DLX2', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(73, 'SDT15TXTS-XP8YI-GOCDW', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(74, 'SDT1R5MNQ-5J3UC-7VM6K', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(75, 'SDT1RBDQT-6NWC0-C87BJ', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(76, 'SDT12EI6L-YC4J1-OUG61', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(77, 'SDT1PBSE4-ANZS7-SCYZL', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(78, 'SDT1B3ROU-7AHJL-0KNLK', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(79, 'SDT1BNGTP-5CDVU-7A62Z', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(80, 'SDT1VTOKX-FXB6Q-VSD3G', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(81, 'SDT1XF6VG-3NZP4-S18JW', 12, '2020-05-19 12:17:20', '2020-05-19 12:17:20', 12, 0),
(82, 'UPA1D83YU-AAUH5-LOLO0', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(83, 'UPA1RVGXM-98V33-FDCXH', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(84, 'UPA13XGNK-YX4RF-KJ88A', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(85, 'UPA1Z99OG-RTZ5G-W6YX4', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(86, 'UPA1NEADH-ZBAWJ-S0K50', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(87, 'UPA1IVGFL-8SE83-AAAE5', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(88, 'UPA1S17R9-4UQ75-NWENI', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(89, 'UPA1Q9D0R-JPDFG-VGPNR', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(90, 'UPA1PIHRU-WPIRU-K6FB7', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(91, 'UPA1ELFSA-R2A7N-AHXLR', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(92, 'UPA1JLJCG-P5X7T-B8Y94', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(93, 'UPA1TX00F-ZM41T-W47PD', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(94, 'UPA1KB8HF-A999B-OA7JE', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(95, 'UPA1IS3E0-24IWT-AEN1K', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(96, 'UPA1D15SV-DF8FS-OS2I9', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(97, 'UPA17LMJ9-B2457-Y632V', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(98, 'UPA1ZB3UX-AQF9C-6XLAW', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(99, 'UPA1CFAKI-O2RDT-0LCZJ', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(100, 'UPA12390H-EBWZS-DI05U', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(101, 'UPA1IW3WI-Y1815-JB487', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(102, 'UPA1OROSF-L5NUM-XRWPZ', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(103, 'UPA172JTP-KC5TU-BSRZU', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(104, 'UPA1ONIUU-M22SL-FR12N', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(105, 'UPA1PYJ4F-UPOIX-L6KSM', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(106, 'UPA1F0UYH-RQH6D-BKSJN', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(107, 'UPA1R95Y4-42TRQ-G9PTS', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(108, 'UPA1WPLBM-FBRLZ-SLAL5', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(109, 'UPA1G2N75-6T1HX-ZU5SQ', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(110, 'UPA17OJ1A-YYD77-99XHJ', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(111, 'UPA1R79YH-UWVED-HOUV7', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(112, 'UPA1YY1TF-KKH3J-C8OYT', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(113, 'UPA1GHW6Y-LEM0A-NE60I', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(114, 'UPA1EIEND-9ICEU-OKXBR', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(115, 'UPA1KKE2V-4JAB4-LCXL6', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(116, 'UPA1W8PSF-VDAH2-QLB2N', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(117, 'UPA1BWI38-UNJH6-3C37R', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(118, 'UPA1N1199-PN4H1-F3FQ1', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(119, 'UPA1P778T-RSHM1-QSG1J', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(120, 'UPA1BW2GS-C22B0-GWTEN', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(121, 'UPA10SACH-37WT6-MFTND', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(122, 'UPA1D8S46-TYIUW-NTMMA', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(123, 'UPA1GIPJL-EX3A1-LSLOG', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(124, 'UPA1M9FEO-UZPQD-QKOSS', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(125, 'UPA1L8DB7-9JGMA-SV9CN', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(126, 'UPA1RSY6G-58G79-3OUXU', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(127, 'UPA1P7OVX-FLYXJ-K0U57', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(128, 'UPA1U81FY-TL0I9-6BCL6', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(129, 'UPA13E9GP-2FC7I-44JHQ', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(130, 'UPA1VYOBH-Z57SB-6TDLL', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(131, 'UPA1RARM2-DUAQK-XUJS7', 15, '2020-05-19 12:19:53', '2020-05-19 12:19:53', 13, 0),
(132, 'SST1KC7B0-NY8NL-6K7FG', 15, '2020-05-19 12:23:03', '2020-05-26 18:58:31', 14, 1),
(133, 'SST1XYMPE-AGKRS-TUR0K', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(134, 'SST1PY8AG-BVFF0-0030V', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(135, 'SST1FID33-CQZH0-SXCX6', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(136, 'SST19VAUR-EIF5C-QADOV', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(137, 'SST10OVJN-FGF4I-LGVSR', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(138, 'SST1M74BU-AECSI-HQPAJ', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(139, 'SST1SEJ18-DI42Q-HU7V7', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(140, 'SST1WTEID-TZIPB-2T0RL', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(141, 'SST12DRIN-FF8WT-XSHVP', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(142, 'SST1YR410-ZTC6A-ZXU44', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(143, 'SST1GJAI6-EK9WG-E1MD7', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(144, 'SST10NU8P-7B33C-CBD2T', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(145, 'SST1IZHT3-PMRRR-17G8G', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(146, 'SST1PO08U-UGATD-4YE9T', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(147, 'SST13ITBK-MFBA3-C6K8R', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(148, 'SST1K1QX5-T4Z4M-06PWD', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(149, 'SST1K38AI-GYJZ6-0JGTQ', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(150, 'SST1RKTAI-IWUEH-RQ02Q', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(151, 'SST1XHX47-W4M90-34HU8', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(153, 'SST164E0Y-4ZHPS-E0IFQ', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(154, 'SST1H1W9F-I7D39-8CQVD', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(155, 'SST1SJUPH-JFPIX-J0NEN', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(156, 'SST1F1RBE-3KWOT-44JYE', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(157, 'SST17OXZV-UBFAD-ZSYNY', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(158, 'SST1JT0EF-VNSTU-1PRDX', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(159, 'SST11F3VK-0UUK3-54E1V', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(160, 'SST1WN85T-SY6BF-Y08Q4', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(161, 'SST158N23-TZ9XM-W1NC2', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(162, 'SST1JHUBB-7JODS-PTP7B', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(163, 'SST1L4PX1-SPBEQ-GKDH0', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(164, 'SST17NVG3-ZOT3X-PD5Y0', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(165, 'SST11LKFS-RDNE7-VNDNF', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(166, 'SST1U483P-9FWLJ-2K5M1', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(167, 'SST11QHBL-G23XB-TNAUK', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(168, 'SST1Y5CRO-HEOCE-SH74R', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(169, 'SST17KT46-NLDZI-E4J7N', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(170, 'SST12TENW-KSUOO-CE13R', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(171, 'SST1CNEF8-CCQXK-SR3JS', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(173, 'SST1C050M-QDI5N-ZNWBY', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(174, 'SST1WMOQ8-RJ4JX-I63S0', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(175, 'SST195CRN-PMKNC-1JQD2', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(176, 'SST122UK2-KTETO-XANFE', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(179, 'SST1KM7Q8-TS2ZL-DO4ME', 15, '2020-05-19 12:23:03', '2020-05-19 12:23:03', 14, 0),
(182, 'BT1V24LJ-IXGPY-M1F2Z', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(183, 'BT1KO5YQ-SRJRF-TSCEI', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(184, 'BT1T2OFR-3THMG-G48G0', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(185, 'BT1UM5CI-23USO-BZ9FW', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(186, 'BT11Z2LS-H81Y2-3GG8J', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(187, 'BT1CNHFI-IG3KT-HRH8F', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(188, 'BT1VPAZZ-UFZR2-QBSTW', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(189, 'BT1NOZ2B-PIRH2-TWMOZ', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(190, 'BT140ELY-1QK3W-X9IGF', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(191, 'BT1I7LSQ-LQ7X5-0F7RI', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(192, 'BT16LM54-GD8MS-MPI7I', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(193, 'BT1IA6C8-360UJ-NLGLK', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(194, 'BT1J9SUP-9W003-D7WQ6', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(195, 'BT1Y7OLN-2RKIS-5E6CV', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(196, 'BT1V5V7R-IMUZ1-HS0OL', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(197, 'BT10XG98-PXW1I-MB5ZU', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(198, 'BT19SZ5E-4FB0M-I27J3', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(199, 'BT1Q6032-WVFNE-UD7ZN', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(200, 'BT1NLF8K-BLI5P-ACSQE', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(201, 'BT1CKR88-AT16F-ZMFFC', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(202, 'BT19JV0R-E8MM7-5467A', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(203, 'BT1J27WS-XEIT3-KICH7', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(204, 'BT1D3DSP-M5Z1D-UYKUY', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(205, 'BT1X85LR-POT9Q-J47MW', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0),
(206, 'BT16YTIK-V2ST4-OGTHX', 15, '2020-05-23 23:42:30', '2020-05-23 23:42:30', 15, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`roles`)),
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `surname` varchar(75) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` int(11) DEFAULT NULL,
  `town` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `credit_card` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `profile_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile_size` int(11) DEFAULT NULL,
  `header_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `header_size` int(11) DEFAULT NULL,
  `name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `email`, `roles`, `password`, `surname`, `address`, `postal_code`, `town`, `city`, `phone`, `credit_card`, `created_at`, `updated_at`, `profile_image`, `profile_size`, `header_image`, `header_size`, `name`) VALUES
(16, 'sample.records11@gmail.com', '[\"ROLE_USER\",\"ROLE_ADMIN\"]', '$2y$13$tsR3sas8VbEQmt2YFDAR6eqrnCVT2.uVzb3tFSHgYOVczidO2RXla', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-05-06 13:13:51', '2020-05-26 17:59:57', 'logo-black-onlylogo-5ecd3cfd7edc0.png', 123, 'header-default.jpg', 123, 'Sample'),
(39, 'guriacb11@gmail.com', '[\"ROLE_USER\"]', '$2y$13$UOco6pRA6xc23POwhNpfHeO1nCIvl.3fAIIKHS90L1gHNP/aR7pD6', 'Gurillo Corral', 'C/Falsa 123', 12345, 'Ondara', 'Alicante', '658947765', 'ASD123456789657', '2020-05-13 12:41:05', '2020-05-26 19:22:54', 'kobe-5ecd4af912355.jpg', 123, 'header-default.jpg', 123, 'Felipe'),
(60, 'usuario@usuario.com', '[\"ROLE_USER\"]', '$2y$13$Cdtk0PHbegF.R1Vgehx51.m8xCHoEL7PFRsCCF4EQNs638IqPq8XO', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-05-30 15:04:04', '2020-05-30 15:04:04', 'user-default.png', 123, 'header-default.jpg', 123, 'usuario');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `album`
--
ALTER TABLE `album`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_39986E43B7970CF8` (`artist_id`);

--
-- Indices de la tabla `artist`
--
ALTER TABLE `artist`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_9474526CA76ED395` (`user_id`),
  ADD KEY `IDX_9474526C71F7E88B` (`event_id`),
  ADD KEY `IDX_9474526C4584665A` (`product_id`),
  ADD KEY `IDX_9474526C4B89032C` (`post_id`),
  ADD KEY `IDX_9474526C558FBEB9` (`purchase_id`);

--
-- Indices de la tabla `event`
--
ALTER TABLE `event`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_3BAE0AA7B7970CF8` (`artist_id`);

--
-- Indices de la tabla `migration_versions`
--
ALTER TABLE `migration_versions`
  ADD PRIMARY KEY (`version`);

--
-- Indices de la tabla `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_5A8A6C8DB7970CF8` (`artist_id`);

--
-- Indices de la tabla `post_tag`
--
ALTER TABLE `post_tag`
  ADD PRIMARY KEY (`post_id`,`tag_id`),
  ADD KEY `IDX_5ACE3AF04B89032C` (`post_id`),
  ADD KEY `IDX_5ACE3AF0BAD26311` (`tag_id`);

--
-- Indices de la tabla `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_D34A04AD12469DE2` (`category_id`),
  ADD KEY `IDX_D34A04ADB7970CF8` (`artist_id`);

--
-- Indices de la tabla `purchase`
--
ALTER TABLE `purchase`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_6117D13BD948EE2` (`serial_number`),
  ADD KEY `IDX_6117D13BA76ED395` (`user_id`);

--
-- Indices de la tabla `purchase_product`
--
ALTER TABLE `purchase_product`
  ADD PRIMARY KEY (`purchase_id`,`product_id`),
  ADD KEY `IDX_C890CED4558FBEB9` (`purchase_id`),
  ADD KEY `IDX_C890CED44584665A` (`product_id`);

--
-- Indices de la tabla `purchase_ticket`
--
ALTER TABLE `purchase_ticket`
  ADD PRIMARY KEY (`purchase_id`,`ticket_id`),
  ADD KEY `IDX_4CCFAFF6558FBEB9` (`purchase_id`),
  ADD KEY `IDX_4CCFAFF6700047D2` (`ticket_id`);

--
-- Indices de la tabla `song`
--
ALTER TABLE `song`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_33EDEEA1B7970CF8` (`artist_id`),
  ADD KEY `IDX_33EDEEA11137ABCF` (`album_id`);

--
-- Indices de la tabla `tag`
--
ALTER TABLE `tag`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `ticket`
--
ALTER TABLE `ticket`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_97A0ADA3D948EE2` (`serial_number`),
  ADD KEY `IDX_97A0ADA371F7E88B` (`event_id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_8D93D649E7927C74` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `album`
--
ALTER TABLE `album`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `artist`
--
ALTER TABLE `artist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT de la tabla `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT de la tabla `post`
--
ALTER TABLE `post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `purchase`
--
ALTER TABLE `purchase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `song`
--
ALTER TABLE `song`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT de la tabla `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `ticket`
--
ALTER TABLE `ticket`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=229;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `album`
--
ALTER TABLE `album`
  ADD CONSTRAINT `FK_39986E43B7970CF8` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`id`);

--
-- Filtros para la tabla `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `FK_9474526C4584665A` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  ADD CONSTRAINT `FK_9474526C4B89032C` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`),
  ADD CONSTRAINT `FK_9474526C558FBEB9` FOREIGN KEY (`purchase_id`) REFERENCES `purchase` (`id`),
  ADD CONSTRAINT `FK_9474526C71F7E88B` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`),
  ADD CONSTRAINT `FK_9474526CA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `event`
--
ALTER TABLE `event`
  ADD CONSTRAINT `FK_3BAE0AA7B7970CF8` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`id`);

--
-- Filtros para la tabla `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `FK_5A8A6C8DB7970CF8` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`id`);

--
-- Filtros para la tabla `post_tag`
--
ALTER TABLE `post_tag`
  ADD CONSTRAINT `FK_5ACE3AF04B89032C` FOREIGN KEY (`post_id`) REFERENCES `post` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_5ACE3AF0BAD26311` FOREIGN KEY (`tag_id`) REFERENCES `tag` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `FK_D34A04AD12469DE2` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  ADD CONSTRAINT `FK_D34A04ADB7970CF8` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`id`);

--
-- Filtros para la tabla `purchase`
--
ALTER TABLE `purchase`
  ADD CONSTRAINT `FK_6117D13BA76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `purchase_product`
--
ALTER TABLE `purchase_product`
  ADD CONSTRAINT `FK_C890CED44584665A` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_C890CED4558FBEB9` FOREIGN KEY (`purchase_id`) REFERENCES `purchase` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `purchase_ticket`
--
ALTER TABLE `purchase_ticket`
  ADD CONSTRAINT `FK_4CCFAFF6558FBEB9` FOREIGN KEY (`purchase_id`) REFERENCES `purchase` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_4CCFAFF6700047D2` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `song`
--
ALTER TABLE `song`
  ADD CONSTRAINT `FK_33EDEEA11137ABCF` FOREIGN KEY (`album_id`) REFERENCES `album` (`id`),
  ADD CONSTRAINT `FK_33EDEEA1B7970CF8` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`id`);

--
-- Filtros para la tabla `ticket`
--
ALTER TABLE `ticket`
  ADD CONSTRAINT `FK_97A0ADA371F7E88B` FOREIGN KEY (`event_id`) REFERENCES `event` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
