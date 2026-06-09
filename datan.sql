-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.4.3 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para asistencia_et
CREATE DATABASE IF NOT EXISTS `asistencia_et` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `asistencia_et`;

-- Volcando estructura para tabla asistencia_et.asistencias_v2
CREATE TABLE IF NOT EXISTS `asistencias_v2` (
  `id` int NOT NULL AUTO_INCREMENT,
  `estudiante_id` int NOT NULL,
  `materia_id` int NOT NULL,
  `estado_id` int NOT NULL,
  `fecha` date NOT NULL,
  `observaciones` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `registro_unico` (`estudiante_id`,`materia_id`,`fecha`),
  KEY `materia_id` (`materia_id`),
  KEY `estado_id` (`estado_id`),
  CONSTRAINT `asistencias_v2_ibfk_1` FOREIGN KEY (`estudiante_id`) REFERENCES `estudiantes_v2` (`id`),
  CONSTRAINT `asistencias_v2_ibfk_2` FOREIGN KEY (`materia_id`) REFERENCES `materias` (`id`),
  CONSTRAINT `asistencias_v2_ibfk_3` FOREIGN KEY (`estado_id`) REFERENCES `estados_asistencia` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla asistencia_et.asistencias_v2: ~5 rows (aproximadamente)
INSERT INTO `asistencias_v2` (`id`, `estudiante_id`, `materia_id`, `estado_id`, `fecha`, `observaciones`) VALUES
	(1, 61, 3, 1, '2026-05-14', NULL),
	(2, 63, 3, 3, '2026-05-14', NULL),
	(3, 62, 3, 1, '2026-05-14', NULL),
	(4, 64, 3, 1, '2026-05-14', NULL),
	(5, 65, 3, 1, '2026-05-14', NULL);

-- Volcando estructura para tabla asistencia_et.asistencia_docentes
CREATE TABLE IF NOT EXISTS `asistencia_docentes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `docente_id` int NOT NULL,
  `fecha` date NOT NULL,
  `estado` enum('Presente','Ausente','Tardanza') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `bloque_clase` tinyint DEFAULT NULL,
  `observaciones` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `registro_unico_docente` (`docente_id`,`fecha`),
  CONSTRAINT `asistencia_docentes_ibfk_1` FOREIGN KEY (`docente_id`) REFERENCES `docentes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla asistencia_et.asistencia_docentes: ~19 rows (aproximadamente)
INSERT INTO `asistencia_docentes` (`id`, `docente_id`, `fecha`, `estado`, `bloque_clase`, `observaciones`) VALUES
	(1, 3, '2026-04-30', 'Presente', NULL, NULL),
	(2, 4, '2026-04-30', 'Ausente', 2, 'Se retiró por motivos familiares '),
	(3, 2, '2026-04-30', 'Presente', 3, 'Pase de salida'),
	(4, 5, '2026-04-30', 'Ausente', 4, 'Dio pase de salida '),
	(5, 1, '2026-04-30', 'Presente', NULL, NULL),
	(6, 3, '2026-05-07', 'Presente', 2, NULL),
	(7, 2, '2026-05-07', 'Presente', NULL, NULL),
	(9, 5, '2026-05-07', 'Ausente', NULL, '\n'),
	(13, 4, '2026-05-07', 'Ausente', NULL, NULL),
	(15, 1, '2026-05-07', 'Ausente', NULL, NULL),
	(19, 3, '2026-05-08', 'Tardanza', NULL, NULL),
	(20, 4, '2026-05-08', 'Ausente', NULL, NULL),
	(21, 2, '2026-05-08', 'Ausente', 2, NULL),
	(22, 1, '2026-05-08', 'Presente', 2, NULL),
	(24, 5, '2026-05-08', 'Presente', 1, NULL),
	(25, 6, '2026-05-08', 'Tardanza', NULL, NULL),
	(34, 2, '2026-05-12', 'Presente', NULL, NULL),
	(35, 2, '2026-05-13', 'Presente', NULL, NULL),
	(36, 3, '2026-05-13', 'Presente', NULL, NULL),
	(37, 2, '2026-05-14', 'Presente', NULL, NULL),
	(38, 3, '2026-05-14', 'Presente', NULL, NULL);

-- Volcando estructura para tabla asistencia_et.clases
CREATE TABLE IF NOT EXISTS `clases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `mencion` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `materia` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'General',
  `fecha` date NOT NULL,
  `tema` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `horas` int NOT NULL DEFAULT '2',
  `clase_inicio` int NOT NULL,
  `clase_fin` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `clase_unica` (`mencion`,`fecha`,`materia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla asistencia_et.clases: ~0 rows (aproximadamente)

-- Volcando estructura para tabla asistencia_et.docentes
CREATE TABLE IF NOT EXISTS `docentes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `rol` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'docente',
  `menciones_permitidas` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla asistencia_et.docentes: ~6 rows (aproximadamente)
INSERT INTO `docentes` (`id`, `usuario`, `nombre`, `apellido`, `rol`, `menciones_permitidas`) VALUES
	(1, '33938383', 'Adrian', 'Rojas', 'docente', NULL),
	(2, '33213075', 'Gabriel', 'Rodriguez', 'docente', NULL),
	(3, '32798215', 'Marco', 'Lopez', 'docente', NULL),
	(4, '32814580', 'Arianyeli', 'Perez', 'docente', NULL),
	(5, '33546789', 'Jhongerbis', 'Rojas', 'docente', NULL),
	(6, '33106714', 'Gregory', 'Rondon', 'docente', NULL);

-- Volcando estructura para tabla asistencia_et.docentes_v2
CREATE TABLE IF NOT EXISTS `docentes_v2` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cedula` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nacionalidad_id` int DEFAULT NULL,
  `usuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT 'docente',
  `turno` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'manana',
  `menciones_permitidas` text COLLATE utf8mb4_unicode_ci,
  `materia_principal_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`),
  UNIQUE KEY `cedula` (`cedula`),
  KEY `materia_principal_id` (`materia_principal_id`),
  KEY `nacionalidad_id` (`nacionalidad_id`),
  CONSTRAINT `docentes_v2_ibfk_1` FOREIGN KEY (`materia_principal_id`) REFERENCES `materias` (`id`),
  CONSTRAINT `docentes_v2_ibfk_2` FOREIGN KEY (`nacionalidad_id`) REFERENCES `nacionalidades` (`id`),
  CONSTRAINT `chk_cedula_doc_8` CHECK ((char_length(`cedula`) = 8)),
  CONSTRAINT `chk_cedula_docente` CHECK ((char_length(`cedula`) = 8)),
  CONSTRAINT `chk_contrasena_largo` CHECK ((char_length(`contrasena`) between 5 and 8)),
  CONSTRAINT `chk_pass_5_8` CHECK ((char_length(`contrasena`) between 5 and 8)),
  CONSTRAINT `chk_usuario_7_20` CHECK ((char_length(`usuario`) between 7 and 20)),
  CONSTRAINT `chk_usuario_largo` CHECK ((char_length(`usuario`) between 7 and 20))
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla asistencia_et.docentes_v2: ~6 rows (aproximadamente)
INSERT INTO `docentes_v2` (`id`, `cedula`, `nombre`, `apellido`, `nacionalidad_id`, `usuario`, `contrasena`, `rol`, `turno`, `menciones_permitidas`, `materia_principal_id`) VALUES
	(1, '33938383', 'Adrian', 'Rojas', 1, '33938383', '12345', 'admin', '', NULL, NULL),
	(2, '33213075', 'Gabriel', 'Rodriguez', 1, '33213075', '12345', 'docente_manana', 'manana', NULL, 3),
	(3, '32798215', 'Marco', 'Lopez', 1, '32798215', '12345', 'docente_manana', 'manana', NULL, 2),
	(4, '32814580', 'Arianyeli', 'Perez', 1, '32814580', '12345', 'docente_tarde', 'tarde', NULL, 4),
	(5, '33102151', 'Jhongerbis', 'Rojas', 1, '33546789', '12345', 'docente_tarde', 'tarde', NULL, 6),
	(6, '33106714', 'Gregory', 'Rondon', 1, '33106714', '123456', 'docente_tarde', 'tarde', NULL, 5);

-- Volcando estructura para tabla asistencia_et.estados_asistencia
CREATE TABLE IF NOT EXISTS `estados_asistencia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `codigo` char(1) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla asistencia_et.estados_asistencia: ~3 rows (aproximadamente)
INSERT INTO `estados_asistencia` (`id`, `codigo`, `descripcion`) VALUES
	(1, 'P', 'Presente'),
	(2, 'A', 'Ausente'),
	(3, 'R', 'Retirado');

-- Volcando estructura para tabla asistencia_et.estudiantes_v2
CREATE TABLE IF NOT EXISTS `estudiantes_v2` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cedula` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nro_lista` int DEFAULT NULL,
  `seccion` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `genero_id` int DEFAULT NULL,
  `mencion_id` int DEFAULT NULL,
  `grado_id` int DEFAULT NULL,
  `representante_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cedula` (`cedula`),
  KEY `genero_id` (`genero_id`),
  KEY `mencion_id` (`mencion_id`),
  KEY `grado_id` (`grado_id`),
  KEY `representante_id` (`representante_id`),
  CONSTRAINT `estudiantes_v2_ibfk_1` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`),
  CONSTRAINT `estudiantes_v2_ibfk_2` FOREIGN KEY (`mencion_id`) REFERENCES `menciones` (`id`),
  CONSTRAINT `estudiantes_v2_ibfk_3` FOREIGN KEY (`grado_id`) REFERENCES `grados` (`id`),
  CONSTRAINT `estudiantes_v2_ibfk_4` FOREIGN KEY (`representante_id`) REFERENCES `representantes` (`id`),
  CONSTRAINT `chk_cedula_est_8` CHECK ((char_length(`cedula`) = 8)),
  CONSTRAINT `chk_cedula_estudiante` CHECK ((char_length(`cedula`) = 8))
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla asistencia_et.estudiantes_v2: ~97 rows (aproximadamente)
INSERT INTO `estudiantes_v2` (`id`, `cedula`, `nombre`, `apellido`, `nro_lista`, `seccion`, `genero_id`, `mencion_id`, `grado_id`, `representante_id`) VALUES
	(2, '87650002', 'Brayan', 'Martínez', 2, 'A', 1, 3, 1, 2),
	(3, '87650003', 'Camila', 'Pérez', 3, 'A', 2, 3, 1, 3),
	(4, '87650004', 'Daniel', 'González', 4, 'A', 1, 3, 1, 4),
	(5, '87650005', 'Estefanía', 'López', 5, 'A', 2, 3, 1, 5),
	(6, '87650006', 'Fabricio', 'Hernández', 1, 'A', 1, 3, 2, 6),
	(7, '87650007', 'Gabriela', 'Jiménez', 2, 'A', 2, 3, 2, 7),
	(8, '87650008', 'Hilario', 'Díaz', 3, 'A', 1, 3, 2, 8),
	(9, '87650009', 'Isabela', 'Torres', 4, 'A', 2, 3, 2, 9),
	(10, '87650010', 'Josué', 'Ramírez', 5, 'A', 1, 3, 2, 10),
	(11, '87650011', 'Karla', 'Morales', 1, 'A', 2, 3, 3, 11),
	(12, '87650012', 'Lenin', 'Vargas', 2, 'A', 1, 3, 3, 12),
	(13, '87650013', 'Mariángel', 'Castro', 3, 'A', 2, 3, 3, 13),
	(14, '87650014', 'Neiber', 'Ortiz', 4, 'A', 1, 3, 3, 14),
	(15, '87650015', 'Oriana', 'Reyes', 5, 'A', 2, 3, 3, 15),
	(16, '87650016', 'Pablo', 'Mendoza', 1, 'A', 1, 3, 4, 16),
	(17, '87650017', 'Quilmary', 'Flores', 2, 'A', 2, 3, 4, 17),
	(18, '87650018', 'Reinaldo', 'Ruiz', 3, 'A', 1, 3, 4, 18),
	(19, '87650019', 'Saraí', 'Guerrero', 4, 'A', 2, 3, 4, 19),
	(20, '87650020', 'Tulio', 'Medina', 5, 'A', 1, 3, 4, 20),
	(21, '87650021', 'Urelis', 'Romero', 1, 'A', 2, 3, NULL, 21),
	(22, '87650022', 'Víctor', 'Acosta', 2, 'A', 1, 3, NULL, 22),
	(23, '87650023', 'Waleska', 'Delgado', 3, 'A', 2, 3, NULL, 23),
	(24, '87650024', 'Xander', 'Núñez', 4, 'A', 1, 3, NULL, 24),
	(25, '87650025', 'Yarixa', 'Vega', 5, 'A', 2, 3, NULL, 25),
	(26, '87660001', 'Adriana', 'Castillo', 1, 'A', 2, 4, 1, 26),
	(27, '87660002', 'Bernardo', 'Ramos', 2, 'A', 1, 4, 1, 27),
	(28, '87660003', 'Carolina', 'Cruz', 3, 'A', 2, 4, 1, 28),
	(29, '87660004', 'Deivis', 'Serrano', 4, 'A', 1, 4, 1, 29),
	(30, '87660005', 'Eloísa', 'Moreno', 5, 'A', 2, 4, 1, 30),
	(31, '87660006', 'Freddy', 'Aguilar', 1, 'A', 1, 4, 2, 31),
	(32, '87660007', 'Génesis', 'Suárez', 2, 'A', 2, 4, 2, 32),
	(33, '87660008', 'Héctor', 'Peña', 3, 'A', 1, 4, 2, 33),
	(34, '87660009', 'Isbelia', 'Ríos', 4, 'A', 2, 4, 2, 34),
	(35, '87660010', 'Jhonatan', 'Cabrera', 5, 'A', 1, 4, 2, 35),
	(36, '87660011', 'Keisy', 'Molina', 1, 'A', 2, 4, 3, 36),
	(37, '87660012', 'Lorena', 'Parra', 2, 'A', 2, 4, 3, 37),
	(38, '87660013', 'Maiker', 'Silva', 3, 'A', 1, 4, 3, 38),
	(39, '87660014', 'Nairobis', 'Domínguez', 4, 'A', 2, 4, 3, 39),
	(40, '87660015', 'Oswaldo', 'Campos', 5, 'A', 1, 4, 3, 40),
	(41, '87660016', 'Paola', 'Sandoval', 1, 'A', 2, 4, 4, 41),
	(42, '87660017', 'Romer', 'Espinoza', 2, 'A', 1, 4, 4, 42),
	(43, '87660018', 'Scarlett', 'Ibarra', 3, 'A', 2, 4, 4, 43),
	(44, '87660019', 'Tiberio', 'Lara', 4, 'A', 1, 4, 4, 44),
	(45, '87660020', 'Ureida', 'Guzmán', 5, 'A', 2, 4, 4, 45),
	(46, '87660021', 'Vanessa', 'Rojas', 1, 'A', 2, 4, NULL, 46),
	(47, '87660022', 'Willian', 'Alvarado', 2, 'A', 1, 4, NULL, 47),
	(48, '87660023', 'Xiomara', 'Fuentes', 3, 'A', 2, 4, NULL, 48),
	(49, '87660024', 'Yeibis', 'Paredes', 4, 'A', 2, 4, 4, NULL),
	(50, '87660025', 'Zulay', 'Cortés', 5, 'A', 2, 4, 3, NULL),
	(51, '87670001', 'Abigail', 'Rangel', 1, 'A', 2, 1, 1, 51),
	(52, '87670002', 'Braulio', 'Salazar', 2, 'A', 1, 1, 1, 52),
	(53, '87670003', 'Coromoto', 'Tovar', 3, 'A', 2, 1, 1, 53),
	(54, '87670004', 'Duglas', 'Bravo', 4, 'A', 1, 1, 1, 54),
	(55, '87670005', 'Eglee', 'Contreras', 5, 'A', 2, 1, 1, 55),
	(56, '87670006', 'Félix', 'Figueroa', 1, 'A', 1, 1, 2, 56),
	(57, '87670007', 'Grecia', 'Zamora', 2, 'A', 2, 1, 2, 57),
	(58, '87670008', 'Hilmar', 'Quintero', 3, 'A', 1, 1, 2, 58),
	(59, '87670009', 'Iraida', 'Pacheco', 4, 'A', 2, 1, 2, 59),
	(60, '87670010', 'Jonás', 'Villalobos', 5, 'A', 1, 1, 2, 60),
	(61, '87670011', 'Katiuska', 'Arteaga', 1, 'A', 2, 1, 3, 61),
	(62, '87670012', 'Leandro', 'Barrios', 2, 'A', 1, 1, 3, 62),
	(63, '87670013', 'Merlyn', 'Colmenares', 3, 'A', 2, 1, 3, 63),
	(64, '87670014', 'Nilver', 'Duarte', 4, 'A', 1, 1, 3, 64),
	(65, '87670015', 'Odalys', 'Estrada', 5, 'A', 2, 1, 3, 65),
	(66, '87670016', 'Priscila', 'Ferreira', 1, 'A', 2, 1, 4, 66),
	(67, '87670017', 'Raúl', 'García', 2, 'A', 1, 1, 4, 67),
	(68, '87670018', 'Sulimar', 'Henríquez', 3, 'A', 2, 1, 4, 68),
	(69, '87670019', 'Tulio', 'Infante', 4, 'A', 1, 1, 4, 69),
	(70, '87670020', 'Urcely', 'Jaimes', 5, 'A', 2, 1, 4, 70),
	(76, '87680001', 'Alondra', 'Querales', 1, 'A', 2, 2, 1, 76),
	(77, '87680002', 'Brainner', 'Restrepo', 2, 'A', 1, 2, 1, 77),
	(78, '87680003', 'Crismar', 'Salas', 3, 'A', 2, 2, 1, 78),
	(79, '87680004', 'Dainer', 'Trujillo', 4, 'A', 1, 2, 1, 79),
	(80, '87680005', 'Eudomar', 'Urbina', 5, 'A', 1, 2, 1, 80),
	(81, '87680006', 'Franklyn', 'Valera', 1, 'A', 1, 2, 2, 81),
	(82, '87680007', 'Glendys', 'Wiedemann', 2, 'A', 2, 2, 2, 82),
	(83, '87680008', 'Hernando', 'Yáñez', 3, 'A', 1, 2, 2, 83),
	(84, '87680009', 'Ibranyi', 'Zerpa', 4, 'A', 2, 2, 2, 84),
	(85, '87680010', 'Jarvis', 'Álvarez', 5, 'A', 1, 2, 2, 85),
	(86, '87680011', 'Keibis', 'Bermúdez', 1, 'A', 2, 2, 3, 86),
	(87, '87680012', 'Luisana', 'Chirinos', 2, 'A', 2, 2, 3, 87),
	(88, '87680013', 'Maikol', 'Dávila', 3, 'A', 1, 2, 3, 88),
	(89, '87680014', 'Neida', 'Escalante', 4, 'A', 2, 2, 3, 89),
	(90, '87680015', 'Oneida', 'Franco', 5, 'A', 2, 2, 3, 90),
	(91, '87680016', 'Petra', 'Gil', 1, 'A', 2, 2, 4, 91),
	(92, '87680017', 'Raikel', 'Hidalgo', 2, 'A', 1, 2, 4, 92),
	(93, '87680018', 'Sinay', 'Isturiz', 3, 'A', 2, 2, 4, 93),
	(94, '87680019', 'Tibisay', 'Jiménez', 4, 'A', 2, 2, 4, 94),
	(95, '87680020', 'Unai', 'Karam', 5, 'A', 1, 2, 4, 95),
	(96, '87680021', 'Veimar', 'Luna', 1, 'A', 1, 2, 5, NULL),
	(97, '87680022', 'Wuinifer', 'Mujica', 2, 'A', 2, 2, 5, NULL),
	(98, '87680023', 'Xilena', 'Nieto', 3, 'A', 2, 2, 5, NULL);

-- Volcando estructura para tabla asistencia_et.generos
CREATE TABLE IF NOT EXISTS `generos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla asistencia_et.generos: ~2 rows (aproximadamente)
INSERT INTO `generos` (`id`, `nombre`) VALUES
	(2, 'F'),
	(1, 'M');

-- Volcando estructura para tabla asistencia_et.grados
CREATE TABLE IF NOT EXISTS `grados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla asistencia_et.grados: ~4 rows (aproximadamente)
INSERT INTO `grados` (`id`, `nombre`) VALUES
	(1, '1'),
	(2, '2'),
	(3, '3'),
	(4, '4'),
	(5, '5');

-- Volcando estructura para tabla asistencia_et.materias
CREATE TABLE IF NOT EXISTS `materias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla asistencia_et.materias: ~6 rows (aproximadamente)
INSERT INTO `materias` (`id`, `nombre`) VALUES
	(5, 'Diseño'),
	(1, 'General'),
	(2, 'geografia'),
	(3, 'Ingles'),
	(6, 'Lengua'),
	(4, 'Orientacion');

-- Volcando estructura para tabla asistencia_et.menciones
CREATE TABLE IF NOT EXISTS `menciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla asistencia_et.menciones: ~4 rows (aproximadamente)
INSERT INTO `menciones` (`id`, `nombre`) VALUES
	(1, 'Administración'),
	(2, 'Contabilidad'),
	(3, 'Telemática'),
	(4, 'Turismo');

-- Volcando estructura para tabla asistencia_et.nacionalidades
CREATE TABLE IF NOT EXISTS `nacionalidades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla asistencia_et.nacionalidades: ~2 rows (aproximadamente)
INSERT INTO `nacionalidades` (`id`, `nombre`) VALUES
	(2, 'Extranjero'),
	(1, 'Venezolano');

-- Volcando estructura para vista asistencia_et.reporte_asistencia_detallado
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `reporte_asistencia_detallado` (
	`Estudiante` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`Apellido` VARCHAR(1) NULL COLLATE 'utf8mb4_unicode_ci',
	`Grado` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`Mencion` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`Sexo` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`Materia` VARCHAR(1) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`Fecha` DATE NOT NULL,
	`Asistencia` CHAR(1) NOT NULL COLLATE 'utf8mb4_unicode_ci'
) ENGINE=MyISAM;

-- Volcando estructura para tabla asistencia_et.representantes
CREATE TABLE IF NOT EXISTS `representantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cedula` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nombre` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `apellido` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cedula` (`cedula`),
  CONSTRAINT `chk_cedula_rep_8` CHECK ((char_length(`cedula`) = 8)),
  CONSTRAINT `chk_tlf_rep_10_15` CHECK ((char_length(`telefono`) between 10 and 15))
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla asistencia_et.representantes: ~100 rows (aproximadamente)
INSERT INTO `representantes` (`id`, `cedula`, `nombre`, `apellido`, `telefono`, `direccion`) VALUES
	(1, '12345678', 'Carmen', 'Rodríguez', '04141234567', 'Av. Bolívar, Casa 1, Caracas'),
	(2, '12345679', 'José', 'Martínez', '04141234568', 'Calle 5, Edif. Arco, Caracas'),
	(3, '12345680', 'Ana', 'Pérez', '04141234569', 'Urb. Los Pinos, Caracas'),
	(4, '12345681', 'Luis', 'González', '04141234570', 'Sector Norte, Casa 4, Caracas'),
	(5, '12345682', 'María', 'López', '04141234571', 'Av. Principal, Apto 2B, Caracas'),
	(6, '12345683', 'Pedro', 'Hernández', '04141234572', 'Calle Real, Casa 10, Caracas'),
	(7, '12345684', 'Rosa', 'Jiménez', '04141234573', 'Urb. El Paraíso, Caracas'),
	(8, '12345685', 'Carlos', 'Díaz', '04141234574', 'Av. Miranda, Edif. Sol, Caracas'),
	(9, '12345686', 'Luisa', 'Torres', '04141234575', 'Sector Sur, Casa 7, Caracas'),
	(10, '12345687', 'Miguel', 'Ramírez', '04141234576', 'Calle 3, Local 2, Caracas'),
	(11, '12345688', 'Elena', 'Morales', '04141234577', 'Av. Los Ilustres, Caracas'),
	(12, '12345689', 'Andrés', 'Vargas', '04141234578', 'Urb. Caricuao, Caracas'),
	(13, '12345690', 'Patricia', 'Castro', '04141234579', 'Calle Sucre, Casa 3, Caracas'),
	(14, '12345691', 'Ramón', 'Ortiz', '04141234580', 'Sector Oeste, Apto 5, Caracas'),
	(15, '12345692', 'Sofía', 'Reyes', '04141234581', 'Av. Urdaneta, Caracas'),
	(16, '12345693', 'Jorge', 'Mendoza', '04141234582', 'Calle 8, Casa 2, Caracas'),
	(17, '12345694', 'Beatriz', 'Flores', '04141234583', 'Urb. Altamira, Caracas'),
	(18, '12345695', 'Ricardo', 'Ruiz', '04141234584', 'Av. Libertador, Caracas'),
	(19, '12345696', 'Claudia', 'Guerrero', '04141234585', 'Sector Central, Casa 9, Caracas'),
	(20, '12345697', 'Fernando', 'Medina', '04141234586', 'Calle Principal, Caracas'),
	(21, '12345698', 'Gloria', 'Romero', '04141234587', 'Av. Venezuela, Caracas'),
	(22, '12345699', 'Héctor', 'Acosta', '04141234588', 'Urb. Bello Monte, Caracas'),
	(23, '12345700', 'Isabel', 'Delgado', '04141234589', 'Calle 12, Casa 5, Caracas'),
	(24, '12345701', 'Javier', 'Núñez', '04141234590', 'Sector Este, Apto 3, Caracas'),
	(25, '12345702', 'Karina', 'Vega', '04141234591', 'Av. San Martín, Caracas'),
	(26, '22345678', 'Laura', 'Castillo', '04161234567', 'Calle Ayacucho, Casa 6, Maracay'),
	(27, '22345679', 'Manuel', 'Ramos', '04161234568', 'Urb. Las Delicias, Maracay'),
	(28, '22345680', 'Nancy', 'Cruz', '04161234569', 'Av. Aragua, Edif. Mar, Maracay'),
	(29, '22345681', 'Oscar', 'Serrano', '04161234570', 'Sector Norte, Casa 2, Maracay'),
	(30, '22345682', 'Paula', 'Moreno', '04161234571', 'Calle Páez, Apto 1A, Maracay'),
	(31, '22345683', 'Quintín', 'Aguilar', '04161234572', 'Av. Bolívar, Maracay'),
	(32, '22345684', 'Rebeca', 'Suárez', '04161234573', 'Urb. El Limón, Maracay'),
	(33, '22345685', 'Samuel', 'Peña', '04161234574', 'Calle 4, Casa 8, Maracay'),
	(34, '22345686', 'Teresa', 'Ríos', '04161234575', 'Sector Sur, Apto 2, Maracay'),
	(35, '22345687', 'Ubaldo', 'Cabrera', '04161234576', 'Av. Principal, Maracay'),
	(36, '22345688', 'Valentina', 'Molina', '04161234577', 'Calle Sucre, Casa 11, Maracay'),
	(37, '22345689', 'William', 'Parra', '04161234578', 'Urb. Caña de Azúcar, Maracay'),
	(38, '22345690', 'Xiomara', 'Silva', '04161234579', 'Av. Las Américas, Maracay'),
	(39, '22345691', 'Yolanda', 'Domínguez', '04161234580', 'Sector Oeste, Casa 3, Maracay'),
	(40, '22345692', 'Zaida', 'Campos', '04161234581', 'Calle 7, Edif. Luna, Maracay'),
	(41, '22345693', 'Álvaro', 'Sandoval', '04161234582', 'Av. Miranda, Maracay'),
	(42, '22345694', 'Blanca', 'Espinoza', '04161234583', 'Urb. San Jacinto, Maracay'),
	(43, '22345695', 'César', 'Ibarra', '04161234584', 'Calle Real, Casa 4, Maracay'),
	(44, '22345696', 'Diana', 'Lara', '04161234585', 'Sector Central, Apto 6, Maracay'),
	(45, '22345697', 'Ernesto', 'Guzmán', '04161234586', 'Av. Bermúdez, Maracay'),
	(46, '22345698', 'Fátima', 'Rojas', '04161234587', 'Calle 9, Casa 7, Maracay'),
	(47, '22345699', 'Gilberto', 'Alvarado', '04161234588', 'Urb. Base Aragua, Maracay'),
	(48, '22345700', 'Hilda', 'Fuentes', '04161234589', 'Av. Constitución, Maracay'),
	(49, '22345701', 'Ignacio', 'Paredes', '04161234590', 'Sector Este, Casa 1, Maracay'),
	(50, '22345702', 'Josefina', 'Cortés', '04161234591', 'Calle 2, Apto 4B, Maracay'),
	(51, '32345678', 'Keyla', 'Rangel', '04241234567', 'Av. Sucre, Casa 3, Valencia'),
	(52, '32345679', 'Leonardo', 'Salazar', '04241234568', 'Urb. Prebo, Valencia'),
	(53, '32345680', 'Miriam', 'Tovar', '04241234569', 'Calle Valencia, Edif. Norte, Valencia'),
	(54, '32345681', 'Néstor', 'Bravo', '04241234570', 'Sector Industrial, Casa 5, Valencia'),
	(55, '32345682', 'Olga', 'Contreras', '04241234571', 'Av. Bolívar, Apto 3C, Valencia'),
	(56, '32345683', 'Pablo', 'Figueroa', '04241234572', 'Calle Ayacucho, Valencia'),
	(57, '32345684', 'Queila', 'Zamora', '04241234573', 'Urb. Michelena, Valencia'),
	(58, '32345685', 'Rafael', 'Quintero', '04241234574', 'Av. Constitución, Valencia'),
	(59, '32345686', 'Susana', 'Pacheco', '04241234575', 'Sector Norte, Casa 8, Valencia'),
	(60, '32345687', 'Tomás', 'Villalobos', '04241234576', 'Calle 6, Edif. Sol, Valencia'),
	(61, '32345688', 'Ursula', 'Arteaga', '04241234577', 'Av. Las Ferias, Valencia'),
	(62, '32345689', 'Vicente', 'Barrios', '04241234578', 'Urb. La Viña, Valencia'),
	(63, '32345690', 'Wendy', 'Colmenares', '04241234579', 'Calle Miranda, Casa 2, Valencia'),
	(64, '32345691', 'Xenia', 'Duarte', '04241234580', 'Sector Oeste, Apto 7, Valencia'),
	(65, '32345692', 'Yván', 'Estrada', '04241234581', 'Av. Universidad, Valencia'),
	(66, '32345693', 'Zuleima', 'Ferreira', '04241234582', 'Calle 10, Casa 6, Valencia'),
	(67, '32345694', 'Adrián', 'García', '04241234583', 'Urb. El Recreo, Valencia'),
	(68, '32345695', 'Bárbara', 'Henríquez', '04241234584', 'Av. Democracia, Valencia'),
	(69, '32345696', 'Camilo', 'Infante', '04241234585', 'Sector Central, Casa 4, Valencia'),
	(70, '32345697', 'Daniela', 'Jaimes', '04241234586', 'Calle 1, Edif. Palma, Valencia'),
	(71, '32345698', 'Efraín', 'Labrador', '04241234587', 'Av. Urdaneta, Valencia'),
	(72, '32345699', 'Flor', 'Marcano', '04241234588', 'Urb. Trigal Norte, Valencia'),
	(73, '32345700', 'Gustavo', 'Naranjo', '04241234589', 'Calle 3, Casa 9, Valencia'),
	(74, '32345701', 'Haydeé', 'Ojeda', '04241234590', 'Sector Este, Apto 2, Valencia'),
	(75, '32345702', 'Irineo', 'Portillo', '04241234591', 'Av. Monseñor Adams, Valencia'),
	(76, '42345678', 'Jacqueline', 'Querales', '04121234567', 'Calle Lara, Casa 5, Barquisimeto'),
	(77, '42345679', 'Kevin', 'Restrepo', '04121234568', 'Urb. Nueva Segovia, Barquisimeto'),
	(78, '42345680', 'Lisbeth', 'Salas', '04121234569', 'Av. Las Palmas, Barquisimeto'),
	(79, '42345681', 'Marcos', 'Trujillo', '04121234570', 'Sector Norte, Casa 3, Barquisimeto'),
	(80, '42345682', 'Norka', 'Urbina', '04121234571', 'Calle 20, Apto 1D, Barquisimeto'),
	(81, '42345683', 'Orlando', 'Valera', '04121234572', 'Av. Venezuela, Barquisimeto'),
	(82, '42345684', 'Petra', 'Wiedemann', '04121234573', 'Urb. Fundalara, Barquisimeto'),
	(83, '42345685', 'Quirino', 'Yáñez', '04121234574', 'Calle Carabobo, Casa 7, Barquisimeto'),
	(84, '42345686', 'Rosario', 'Zerpa', '04121234575', 'Sector Sur, Apto 3, Barquisimeto'),
	(85, '42345687', 'Simón', 'Álvarez', '04121234576', 'Av. Libertador, Barquisimeto'),
	(86, '42345688', 'Tamara', 'Bermúdez', '04121234577', 'Calle 5, Casa 4, Barquisimeto'),
	(87, '42345689', 'Ulises', 'Chirinos', '04121234578', 'Urb. Patarata, Barquisimeto'),
	(88, '42345690', 'Vanesa', 'Dávila', '04121234579', 'Av. Rotaria, Barquisimeto'),
	(89, '42345691', 'Winston', 'Escalante', '04121234580', 'Sector Oeste, Casa 6, Barquisimeto'),
	(90, '42345692', 'Ximena', 'Franco', '04121234581', 'Calle 8, Edif. Palacio, Barquisimeto'),
	(91, '42345693', 'Yenny', 'Gil', '04121234582', 'Av. Pedro León Torres, Barquisimeto'),
	(92, '42345694', 'Zacarías', 'Hidalgo', '04121234583', 'Urb. El Ujano, Barquisimeto'),
	(93, '42345695', 'Amelia', 'Isturiz', '04121234584', 'Calle 11, Casa 2, Barquisimeto'),
	(94, '42345696', 'Bruno', 'Jiménez', '04121234585', 'Sector Central, Apto 8, Barquisimeto'),
	(95, '42345697', 'Cristina', 'Karam', '04121234586', 'Av. Florencio Jiménez, Barquisimeto'),
	(96, '42345698', 'David', 'Luna', '04121234587', 'Calle 2, Casa 10, Barquisimeto'),
	(97, '42345699', 'Estela', 'Mujica', '04121234588', 'Urb. Club Hípico, Barquisimeto'),
	(98, '42345700', 'Franco', 'Nieto', '04121234589', 'Av. Los Leones, Barquisimeto'),
	(99, '42345701', 'Graciela', 'Ocanto', '04121234590', 'Sector Este, Casa 1, Barquisimeto'),
	(100, '42345702', 'Hernán', 'Pino', '04121234591', 'Calle 6, Apto 5B, Barquisimeto');

-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `reporte_asistencia_detallado`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `reporte_asistencia_detallado` AS select `e`.`nombre` AS `Estudiante`,`e`.`apellido` AS `Apellido`,`g`.`nombre` AS `Grado`,`m`.`nombre` AS `Mencion`,`gen`.`nombre` AS `Sexo`,`mat`.`nombre` AS `Materia`,`a`.`fecha` AS `Fecha`,`est`.`codigo` AS `Asistencia` from ((((((`asistencias_v2` `a` join `estudiantes_v2` `e` on((`a`.`estudiante_id` = `e`.`id`))) join `grados` `g` on((`e`.`grado_id` = `g`.`id`))) join `menciones` `m` on((`e`.`mencion_id` = `m`.`id`))) join `generos` `gen` on((`e`.`genero_id` = `gen`.`id`))) join `materias` `mat` on((`a`.`materia_id` = `mat`.`id`))) join `estados_asistencia` `est` on((`a`.`estado_id` = `est`.`id`)));

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
