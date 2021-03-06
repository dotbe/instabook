-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: instabook
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `file`
--

DROP TABLE IF EXISTS `file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file` (
  `id` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `taxRef` varchar(50) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `taxRef_UNIQUE` (`taxRef`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file`
--

LOCK TABLES `file` WRITE;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
INSERT INTO `file` VALUES ('2122fec3-ff8c-41a8-ad1a-1d1b2beca39a','Hello world!!',NULL,'2020-04-04 16:44:54','2020-04-05 16:40:22'),('556b497b-17a1-4f7e-806e-a95f05fbad24','ABCEFGHI',NULL,'2020-04-03 18:06:07','2020-04-03 18:06:07'),('55afc5cf-d8f9-45d7-ae70-a163ab0ccc84','AAA',NULL,'2020-04-04 16:51:30','2020-04-04 16:51:30'),('92c73026-3762-4a11-8237-f7ff023dcd31','ABCEFGHIJK',NULL,'2020-04-03 18:08:38','2020-04-03 18:08:38'),('a','Hello world',NULL,'2020-03-17 00:00:00','2020-03-21 00:00:00'),('bc0ec327-2a52-46d2-9ca6-ef69497c6771','AAAZZ',NULL,'2020-04-12 16:18:09','2020-04-12 16:18:09'),('bda43370-6325-454c-8ff8-20d524946818','AAABBw','00x','2020-03-19 00:00:00','2020-03-19 00:00:00'),('c9ae32a1-69e7-45e0-983f-be5ae8907a43','ABCEFG',NULL,'2020-04-03 18:05:52','2020-04-03 18:05:52'),('f4eb6e1b-ad42-4475-a711-538dc21c89be','ABCEF',NULL,'2020-04-03 18:04:29','2020-04-03 18:04:29'),('f96ea5a4-6dd1-4eb8-a0c3-5916689c6b3a','AAABB','1234','2020-03-19 00:00:00','2020-04-17 22:34:41');
/*!40000 ALTER TABLE `file` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-18 13:28:20
