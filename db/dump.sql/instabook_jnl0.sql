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
-- Table structure for table `jnl`
--

DROP TABLE IF EXISTS `jnl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jnl` (
  `id` varchar(50) NOT NULL,
  `fileId` varchar(50) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `type` varchar(50) NOT NULL,
  `nextRef` int DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `jnl_file_fk_idx` (`fileId`),
  CONSTRAINT `jnl_file_fk` FOREIGN KEY (`fileId`) REFERENCES `file` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jnl`
--

LOCK TABLES `jnl` WRITE;
/*!40000 ALTER TABLE `jnl` DISABLE KEYS */;
INSERT INTO `jnl` VALUES ('3b1735b3-5ec6-480b-88ba-c9debb36bb53','f96ea5a4-6dd1-4eb8-a0c3-5916689c6b3a','Achats',1,'BUY',NULL,'2020-04-17 22:40:54','2020-04-17 22:40:54'),('44083d81-62e6-4587-a187-dc957cc7c935','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84','Notes de Crédit s/ Ventes',1,'SELL_CN',1,NULL,NULL),('5c4e4798-c987-464a-89e9-fa2f8d8ad82e','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84','Notes de Crédits s/ Ventes',1,'BUY_CN',1,'2020-04-16 15:47:54','2020-04-16 15:48:10'),('730940b8-4b13-43a9-ab1d-3ca1efaa3fb6','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84','Opération Diverses',1,'DIVERSE',1,'2020-04-09 13:23:32','2020-04-09 13:23:32'),('7f213fac-7899-473a-9c7b-598b87106f1e','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84','BELFIUS',1,'FINANCE',1,'2020-04-09 13:22:33','2020-04-09 13:22:33'),('a','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84','Achats',1,'BUY',NULL,NULL,'2020-04-17 22:37:17'),('b545c560-d15f-49b1-816c-d375d8197760','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84','Ventes',1,'SELL',1,'2020-04-09 11:32:44','2020-04-16 15:48:21');
/*!40000 ALTER TABLE `jnl` ENABLE KEYS */;
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
