-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 22-04-2020 a las 22:34:01
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
(3, 'Backstreet Dose', 12.5, NULL, '2020-04-06 00:00:00', '2020-04-10 11:18:13', '2020-04-10 11:18:13', 4, 'jdose-backstreetdose.jpg', 86919);

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
(4, 'Javi', 'J Dose', NULL, '2020-04-08', 'Salamanca', NULL, '2020-04-08 19:44:00', '2020-04-09 12:23:35', 'jdose.jpg', 148867),
(5, 'Bárbara', 'Babi', NULL, '1999-07-06', 'Madrid', 'una de las artistas más emergentes del panorama nacional, la madrileña de 20 años: Babi. Para ella la música es algo terapeutico y quiero transmitir sus sentimiendos a todo el mundo.', '2020-04-09 20:45:30', '2020-04-09 20:58:58', 'babi.png', 909245),
(6, 'Delaossa', 'Delaossa', 'Picasso', '1993-01-01', 'Barrio Pescadores (Málaga)', 'Con 12 años le empezó a interesar la música: después de Cypress Hill vinieron Hablando en Plata y Tote King o Kase-O y tras años rapeando con sus amigos y unos litros sobre bases que sonaban en coches con los maleteros abiertos ha llegado su primer disco, Un perro andaluz.', '2020-04-09 20:53:06', '2020-04-09 21:04:50', 'delaossa.jpg', 85458),
(13, 'Guri', 'J Dose', NULL, '2020-04-08', 'Salamanca', 'asdfasdfasdfkjasdfklasdkfj', '2020-04-17 09:33:04', '2020-04-17 09:33:04', 'babi.png', 23);

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
(3, 'fundas de móvil', '2020-04-11 14:28:01', '2020-04-11 14:28:01'),
(4, 'discos', '2020-04-11 14:27:58', '2020-04-11 14:27:58');

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
  `post_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(2, 'Streetback Dose Tour', 'Pabellón La Fonteta Sant Lluís', 'Valencia', 'España', '2020-06-15', 'SDT1', '2020-04-10 13:42:23', '2020-04-10 13:42:23', 4, 'jdose-backstreetdose.jpg', 86919, NULL),
(3, 'Un perro andaluz Tour', 'La caja mágica', 'Madrid', 'España', '2020-07-01', 'UPA1', '2020-04-10 13:46:03', '2020-04-10 13:46:03', 6, 'delaossa-event.jpg', 820572, NULL),
(4, 'Salut Tour', 'Don Diego López Haro, 89 48903 Bilbo, Bizkaia', 'Bilbao', 'España', '2020-06-19', 'SST1', '2020-04-10 13:48:04', '2020-04-10 13:48:04', 3, 'santasalut-event.jpeg', 110015, NULL);

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
('20200420085639', '2020-04-20 08:56:42');

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
(4, '¡BackStreet Dose Tour empieza! J Dose sale con todo', 'J Dose vuelve a la carga con un nuevo disco llamado \"Backstreetdose\". El álbum compuesto de un total de 12 cortes en los que aparecen 2 colaboraciones vocales correspondiente a Alber Stewar (su compañero en el grupo Los Chicos de la lluvia) y Fernandocosta. Su primer concierto será en Valencia.', '2020-04-10 14:07:19', '2020-04-10 14:07:19', 4, 'jdose-backstreetdose.jpg', 86919);

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
(4, 1);

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
(2, 'Sudadera - Babi', 35, 0, 'única', 50, 1, 'Sudadera de Babi con materiales 50% algodón y 50% poliéster de 280g/m2. Diseño con capucha, con cordones a juego y bolsillo frontal.', '2020-04-10 12:52:30', '2020-04-10 12:57:00', 2, 5, 'babi_sweatshirt.png', 34465),
(3, 'Camiseta - Babi', 15, 0, 'unica', 50, 1, 'Camiseta blanca con el logo y nombre de Babi', '2020-04-10 12:56:34', '2020-04-10 12:56:34', 1, 5, 'babi_tshirt.png', 43380),
(4, 'Un perro andaluz', 10, 0, NULL, 45, 1, 'Nuevo disco de Delaossa y J.Moods \"Un Perro Andaluz\"', '2020-04-10 12:58:10', '2020-04-10 12:58:10', 4, 6, 'delaossa-unperroandaluz.jpg', 211568),
(5, 'Backstreet Dose', 10, 0, NULL, 45, 1, 'Nuevo disco del artista J Dose, \"Backstreet Dose\".', '2020-04-10 12:58:53', '2020-04-10 12:58:53', 4, 4, 'jdose-backstreetdose.jpg', 86919),
(6, 'Sudadera - J Dose', 34.99, 0, 'unica', 50, 1, 'Sudadera con Capucha Unisex de J Dose es la tradicional sudadera con capucha y bolsillo canguro. Tejido de poliéster y algodón.', '2020-04-10 13:03:22', '2020-04-10 13:03:22', 2, 4, 'jdose_sweatshirt.png', 58049),
(7, 'Sudadera \"Si tu perro\" - Luisaker', 15, 0, 'unica', 50, 1, 'Sudadera del perreo favorito del rap y de nuestro artista Alicantino Luisaker.', '2020-04-10 13:05:05', '2020-04-10 13:05:05', 2, 1, 'luisaker_sweatshirt.png', 33140),
(8, 'Funda IPhone', 4.99, 0, NULL, 50, 1, 'Funda de IPhone con el logo de Sample Records', '2020-04-10 13:06:07', '2020-04-10 13:06:07', 3, NULL, 'sr_phonecase.png', 18804),
(9, 'Sudadera SR', 27.99, 0, NULL, 50, 1, 'Sudadera Sample Records con capucha y bolsillos.', '2020-04-10 13:07:01', '2020-04-10 13:07:01', 2, NULL, 'sr_sweatshirt.png', 26849),
(10, 'Camiseta SR', 9.99, 0, NULL, 50, 1, 'Camiseta Sample Records', '2020-04-10 13:07:39', '2020-04-10 13:07:39', 1, NULL, 'sr_tshirt.png', 38493);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `purchase`
--

CREATE TABLE `purchase` (
  `id` int(11) NOT NULL,
  `serial_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `date` date NOT NULL,
  `time` time DEFAULT NULL,
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
(4, '', '2020-04-22', NULL, 0, 'a mi puta cada numero 14', '', '', 'AE bro', 10, '2020-04-20 11:53:25', '2020-04-20 11:53:25', NULL, NULL);

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
(4, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `purchase_ticket`
--

CREATE TABLE `purchase_ticket` (
  `purchase_id` int(11) NOT NULL,
  `ticket_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
(3, 'Colegas', 244, 'https://www.youtube.com/watch?v=zDcBO_RVU58', '2019-09-01 00:00:00', '2020-04-10 10:36:50', '2020-04-10 10:36:50', 5, NULL, 'babi-colegas-5e903022d45dd.mpga', 'babi-colegas.jpg', 30264),
(4, 'Devuélmelo', 242, 'https://www.youtube.com/watch?v=PeyuymuiPbU', '2019-10-31 00:00:00', '2020-04-10 10:38:34', '2020-04-10 10:38:34', 5, NULL, 'babi-devuelvemelo-5e90308a052f6.mpga', 'babi-devuelvemelo.jpg', 54414),
(5, 'Stressed Out', 233, 'https://www.youtube.com/watch?v=O85KUSOlST8', '2019-10-03 00:00:00', '2020-04-10 10:40:14', '2020-04-10 10:40:14', 5, NULL, 'babi-ft-ly-raine-stressed-out-5e9030eef0a19.mpga', 'babi-stressedout.jpg', 35294),
(6, 'Lo sabia', 197, 'https://www.youtube.com/watch?v=1uaPOEyeBHU', '2016-01-16 00:00:00', '2020-04-10 10:42:02', '2020-04-10 10:42:02', 5, NULL, 'babi-ft-miranda-lo-sabia-5e90315a87812.mpga', 'babi-losabia.jpg', 125971),
(7, 'Game Ova', 244, 'https://www.youtube.com/watch?v=Bi6w8gmDXYM', '2019-12-16 00:00:00', '2020-04-10 10:44:21', '2020-04-10 10:44:21', 5, NULL, 'babi-game-ova-5e9031e50fb4a.mpga', 'babi-gameova.jpg', 70034),
(8, 'Tommy Hill', 231, 'https://www.youtube.com/watch?v=aGRyQAaPIHg', '2020-04-09 00:00:00', '2020-04-10 11:20:23', '2020-04-14 13:54:31', 6, 2, 'DELAOSSA-J-MOODS-TOMMY-HILL-ft-EASY-S-UN-PERRO-ANDALUZ-5e95a477e8813.mpga', 'delaossa-unperroandaluz.jpg', 211568),
(9, 'Dicen de mi', 235, 'https://www.youtube.com/watch?v=PI6xHzUpFOE', '2020-04-09 00:00:00', '2020-04-10 11:22:36', '2020-04-10 11:22:36', 6, 2, 'DELAOSSA-J-MOODS-DICEN-DE-MI-UN-PERRO-ANDALUZ-5e903adc12162.mpga', 'delaossa-unperroandaluz.jpg', 211568),
(10, 'Pura sangre', 214, 'https://www.youtube.com/watch?v=Lh3LAGFDGrQ', '2020-04-08 00:00:00', '2020-04-10 11:24:59', '2020-04-10 11:24:59', 6, 2, 'DELAOSSA-J-MOODS-PURA-SANGRE-ft-METRICAS-FRIAS-5e903b6b8f928.mpga', 'delaossa-unperroandaluz.jpg', 211568),
(11, 'Artemisa', 169, 'https://www.youtube.com/watch?v=9V3O4WS9AqM', '2020-02-15 00:00:00', '2020-04-10 11:26:41', '2020-04-10 11:26:41', 3, NULL, 'ELANE-ARTEMISA-5e903bd113342.mpga', 'elane-artemisa.jpg', 39496),
(12, 'Átomos', 224, 'https://www.youtube.com/watch?v=QazYB6Oye-M', '2020-11-24 00:00:00', '2020-04-10 11:28:35', '2020-04-10 11:28:35', 2, NULL, 'ELANE-ATOMOS-SONDEESAS-5e903c4377cdb.mpga', 'elane-atomos.jpg', 90999),
(13, 'Hiprofenia', 157, 'https://www.youtube.com/watch?v=8Xp6hW3rfV0', '2020-01-29 00:00:00', '2020-04-10 11:31:52', '2020-04-10 11:31:52', 2, NULL, 'ELANE-HIPROFENIA-SONDEESAS-5e903d085b997.mpga', 'elane-hiprofenia.jpg', 82151),
(14, 'Histérica', 91, 'https://www.youtube.com/watch?v=BkjgiVP4PlE', '2020-04-04 00:00:00', '2020-04-10 11:33:09', '2020-04-10 11:33:09', 2, NULL, 'ELANE-HISTERICA-5e903d553fa0d.mpga', 'elane-histerica.jpg', 53594),
(15, 'Al aire', 223, 'https://www.youtube.com/watch?v=Kh3qyYJ5CFc', '2019-01-23 00:00:00', '2020-04-10 11:39:56', '2020-04-10 11:39:56', 4, 3, 'JDose-AL-AIRE-BackStreetDose-5e903eec030dd.mpga', 'jdose-backstreetdose.jpg', 86919),
(16, 'Pa\' no hablar contigo', 323, 'https://www.youtube.com/watch?v=ZgqZKaODgLc', '2020-04-01 00:00:00', '2020-04-10 11:45:53', '2020-04-10 11:45:53', 4, NULL, 'JDose-PA-NO-HABLAR-CONTIGO-5e90405180611.mpga', 'jdose-panohablarcontigo.jpg', 59241),
(17, 'Dale', 277, 'https://www.youtube.com/watch?v=dtsxNuHyXj8', '2020-03-06 00:00:00', '2020-04-10 11:48:21', '2020-04-10 11:48:21', 4, 3, 'JDOSE-BACKSTREETDOSE-Dale-5e9040e5172ba.mpga', 'jdose-backstreetdose.jpg', 86919),
(18, 'Lo quiero', 173, 'https://www.youtube.com/watch?v=vzkdnNCHZi8', '2019-09-20 00:00:00', '2020-04-10 11:54:45', '2020-04-10 13:55:25', 4, 3, 'JDOSE-BACKSTREETDOSE-Lo-quiero-5e905eadb2275.mpga', 'jdose-backstreetdose.jpg', 86919),
(19, 'Ya vendrá', 171, 'https://www.youtube.com/watch?v=8AGuX-umfRA', '2019-09-20 00:00:00', '2020-04-10 12:03:07', '2020-04-10 12:03:07', 4, 3, 'JDOSE-BACKSTREETDOSE-Ya-vendre-5e90445b1bbe7.mpga', 'jdose-backstreetdose.jpg', 86919),
(20, 'De niños querian ser Kase', 225, 'https://www.youtube.com/watch?v=iD5Mao8ZUuA', '2019-10-07 00:00:00', '2020-04-10 12:05:49', '2020-04-10 12:05:49', 4, 2, 'JDose-DE-NINOS-QUERIAN-SER-KASE-BackStreetDose-5e9044fd2b599.mpga', 'jdose-backstreetdose.jpg', 86919),
(21, 'Que cosa fuera', 402, 'https://www.youtube.com/watch?v=az23nRJZGt8', '2020-03-06 00:00:00', '2020-04-10 12:08:22', '2020-04-10 12:08:22', 4, 3, 'JDose-QUE-COSA-FUERA-Backstreetdose-5e904596516da.mpga', 'jdose-backstreetdose.jpg', 86919),
(22, 'Dicen', 124, 'https://www.youtube.com/watch?v=ilTf3tBFgBs', '2019-10-18 00:00:00', '2020-04-10 12:09:52', '2020-04-10 12:09:52', 1, NULL, 'LUISAKER-DICEN-5e9045f03d9f0.mpga', 'luisaker-dicen.jpg', 249156),
(23, 'Falta', 154, 'https://www.youtube.com/watch?v=owd0xzcRozY', '2019-11-30 00:00:00', '2020-04-10 12:11:14', '2020-04-10 12:11:14', 1, NULL, 'LUISAKER-FALTA-5e904642c286d.mpga', 'luisaker-falta.jpg', 89312),
(24, 'Mamá', 233, 'https://www.youtube.com/watch?v=SrfPwtlJHYs', '2019-09-23 00:00:00', '2020-04-10 12:13:01', '2020-04-10 12:13:01', 1, NULL, 'LUISAKER-MAMA-5e9046adc43f2.mpga', 'luisaker-mama.jpg', 54835),
(25, 'Nítido', 247, 'https://www.youtube.com/watch?v=Fmpl1TJEC08&t=8s', '2020-03-13 00:00:00', '2020-04-10 12:14:48', '2020-04-10 12:14:48', 1, NULL, 'LUISAKER-NITIDO-5e9047180b07f.mpga', 'luisaker-nitido.jpg', 76360),
(26, 'Quédate', 147, 'https://www.youtube.com/watch?v=1XjmNWEDigw', '2020-04-01 00:00:00', '2020-04-10 12:23:34', '2020-04-10 12:23:34', 1, NULL, 'LUISAKER-QUEDATE-5e904926ca234.mpga', 'luisaker-quedate.jpg', 79461),
(27, 'Si tu perro', 148, 'https://www.youtube.com/watch?v=pWt-DNYDqg4', '2019-08-23 00:00:00', '2020-04-10 12:27:23', '2020-04-10 12:27:23', 1, NULL, 'LUISAKER-SI-TU-PERRO-5e904a0b75068.mpga', 'luisaker-situperro.jpg', 105913),
(28, '90 retro', 123, 'https://www.youtube.com/watch?v=-IYpsT9cS1k', '2019-01-01 00:00:00', '2020-04-10 12:28:59', '2020-04-10 12:28:59', 3, NULL, 'SANTA-SALUT-90RETRO-5e904a6b0d36f.mpga', 'santasalut-90retro.jpg', 233900),
(29, 'Bastardas', 220, 'https://www.youtube.com/watch?v=oxgA5VJrgJw', '2019-01-23 00:00:00', '2020-04-10 12:31:01', '2020-04-10 12:31:01', 3, NULL, 'SANTA-SALUT-BASTARDAS-5e904ae5dd868.mpga', 'santasalut-bastardas.jpg', 139555),
(30, 'Herida abierta', 153, 'https://www.youtube.com/watch?v=XPN92y6lrDI', '2019-08-29 00:00:00', '2020-04-10 12:32:20', '2020-04-10 12:32:20', 3, NULL, 'SANTA-SALUT-HERIDA-ABIERTA-5e904b34621bc.mpga', 'santasalut-heridaabierta.jpg', 56998),
(31, 'Morfeo', 150, 'https://www.youtube.com/watch?v=50EyNpZNTQE', '2020-04-04 00:00:00', '2020-04-10 12:39:45', '2020-04-10 12:39:45', 3, NULL, 'SANTA-SALUT-MORFEO-5e904cf12f22e.mpga', 'santasalut-morfeo.jpg', 44246),
(32, 'Retroexplosivo', 132, 'https://www.youtube.com/watch?v=CIZ_YimzniE', '2019-06-12 00:00:00', '2020-04-10 12:41:40', '2020-04-10 12:41:40', 3, NULL, 'SANTA-SALUT-RETROEXPLOSIVO-5e904d6472621.mpga', 'santasalut-retroexplosivo.jpg', 85189);

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
(2, 'canciones', '2020-04-11 16:50:29', '2020-04-11 16:50:29'),
(3, 'albums', '2020-04-11 16:50:25', '2020-04-11 16:50:25');

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
  `event_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `ticket`
--

INSERT INTO `ticket` (`id`, `serial_number`, `price`, `created_at`, `updated_at`, `event_id`) VALUES
(1, 'UPA100001', 34, '2020-04-12 11:37:43', '2020-04-12 11:38:24', 3);

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
(6, 'usuario@usuario.com', '[]', '$argon2id$v=19$m=65536,t=4,p=1$ATxy1r/giaWw7auezK7q3w$WnW8+5MgAJ6k+3EwqicL7zcGi4Ezh+RUjzdfjF+p03I', 'user', NULL, NULL, NULL, NULL, NULL, NULL, '2020-04-12 10:26:05', '2020-04-12 10:26:05', NULL, NULL, NULL, NULL, 'usuario'),
(7, 'sradmin@samplerecords.com', '[\"ROLE_USER\",\"ROLE_ADMIN\"]', '$argon2id$v=19$m=65536,t=4,p=1$1LjW5MdryPzm2Vydr1h+bw$ojPVzfmbrXkGchikbZBRUyxwsnfAaMgORDerugFkbUs', 'sample', NULL, NULL, NULL, NULL, NULL, NULL, '2020-04-12 10:36:00', '2020-04-12 10:36:00', NULL, NULL, NULL, NULL, 'sample'),
(8, 'guriacb11@gmail.com', '[]', '$argon2id$v=19$m=65536,t=4,p=1$bNnvaA2MvOmnTA928KORKw$DQYjo5C3l7gsHQkvO/RZEOsWaUOxw3kRklSidSBt/1E', 'ser', NULL, NULL, NULL, NULL, NULL, NULL, '2020-04-12 12:19:29', '2020-04-12 12:19:29', NULL, NULL, NULL, NULL, 'sergio'),
(9, 'paco@gmail.com', '[\"ROLE_USER\"]', '$argon2id$v=19$m=65536,t=4,p=1$S3yIeL6dy0nYaQuNpA6+8A$0zu8t0UL8MEczsmk343aa/m1YHLJfB748WeMgecGKe0', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-04-20 10:54:03', '2020-04-20 10:54:03', NULL, NULL, NULL, NULL, 'paco'),
(10, 'guriacb12@gmail.com', '[\"ROLE_USER\"]', '$2y$13$BXXwhytwiSaNMFASnrvOPOVQL//PwiYUHpQIyBTL17xkTP5Fqhqie', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-04-20 17:33:34', '2020-04-20 17:51:41', NULL, NULL, NULL, NULL, 'sergio'),
(11, 'guriacb32@gmail.com', '[\"ROLE_USER\"]', '$2y$13$V.1HCtxLyQ3BT1A3.wo/P.lNL4iSgFNFUqYC7qUPbjRDhbsdk8/Um', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2020-04-20 19:06:04', '2020-04-20 19:06:04', NULL, NULL, NULL, NULL, 'jose');

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
  ADD KEY `IDX_9474526C4B89032C` (`post_id`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `artist`
--
ALTER TABLE `artist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `event`
--
ALTER TABLE `event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `post`
--
ALTER TABLE `post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `purchase`
--
ALTER TABLE `purchase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `song`
--
ALTER TABLE `song`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `tag`
--
ALTER TABLE `tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `ticket`
--
ALTER TABLE `ticket`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

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
