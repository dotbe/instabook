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
-- Table structure for table `acc`
--

DROP TABLE IF EXISTS `acc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `acc` (
  `id` varchar(50) NOT NULL,
  `code` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acc`
--

LOCK TABLES `acc` WRITE;
/*!40000 ALTER TABLE `acc` DISABLE KEYS */;
INSERT INTO `acc` VALUES ('00da7662-8dc3-4c65-9704-14cf5e927a6d','600000','Matières premières',1,'2020-04-16 10:08:41','2020-04-16 10:13:28'),('a','1010000','Capital non appelle',1,'2020-03-22 15:13:53','2020-04-11 14:54:34'),('a712e22e-28a3-488c-bbab-5ccf43262e53','1000000','Capital',1,'2020-03-22 13:38:50','2020-03-22 15:13:39'),('b','440PROXIMUS','Proximus',1,NULL,NULL),('b73acc23-bf33-4580-9088-9464b17a84b5','400ARHS','Ahrs SRL',1,NULL,NULL),('c','610100','Téléphonie',1,NULL,NULL);
/*!40000 ALTER TABLE `acc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conf`
--

DROP TABLE IF EXISTS `conf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conf` (
  `id` varchar(20) NOT NULL,
  `val` varchar(50) DEFAULT NULL,
  `descr` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conf`
--

LOCK TABLES `conf` WRITE;
/*!40000 ALTER TABLE `conf` DISABLE KEYS */;
INSERT INTO `conf` VALUES ('accBS','1,2,3,4,5','Balance Sheet (Bilan) accounts list'),('accC','400','Customes account prefix (start with)'),('accIS','6,7','Income Statement (Résultat) accounts list'),('accS','440','Suppliers account prefix (start with)'),('docRef','YYYY/NNNN','Document number format. Number must be unique for a Journal for all years: YYYYNNN, YYMMNN, YYNNN, NNNNN');
/*!40000 ALTER TABLE `conf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doc`
--

DROP TABLE IF EXISTS `doc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doc` (
  `id` varchar(50) NOT NULL,
  `jnlId` varchar(50) NOT NULL,
  `ref` int NOT NULL,
  `regDate` date NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ref_UNIQUE` (`jnlId`,`ref`),
  KEY `jnlId` (`jnlId`),
  CONSTRAINT `doc_jnl_fk` FOREIGN KEY (`jnlId`) REFERENCES `jnl` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doc`
--

LOCK TABLES `doc` WRITE;
/*!40000 ALTER TABLE `doc` DISABLE KEYS */;
INSERT INTO `doc` VALUES ('a','a',20200001,'2020-01-01',NULL,NULL),('b','a',20200002,'2020-02-02',NULL,NULL);
/*!40000 ALTER TABLE `doc` ENABLE KEYS */;
UNLOCK TABLES;

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
INSERT INTO `jnl` VALUES ('3b1735b3-5ec6-480b-88ba-c9debb36bb53','f96ea5a4-6dd1-4eb8-a0c3-5916689c6b3a','Achats',1,'BUY',NULL,'2020-04-17 22:40:54','2020-04-17 22:40:54'),('44083d81-62e6-4587-a187-dc957cc7c935','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84','NC s/Ventes',1,'SELL_CN',1,NULL,NULL),('5c4e4798-c987-464a-89e9-fa2f8d8ad82e','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84','NC s/Achats',1,'BUY_CN',1,'2020-04-16 15:47:54','2020-04-16 15:48:10'),('730940b8-4b13-43a9-ab1d-3ca1efaa3fb6','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84','Opérations Diverses',1,'DIVERSE',10,'2020-04-09 13:23:32','2020-04-09 13:23:32'),('7f213fac-7899-473a-9c7b-598b87106f1e','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84','BELFIUS',1,'FINANCE',1,'2020-04-09 13:22:33','2020-04-09 13:22:33'),('a','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84','Achats',1,'BUY',NULL,NULL,'2020-04-17 22:37:17'),('b545c560-d15f-49b1-816c-d375d8197760','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84','Ventes',1,'SELL',1,'2020-04-09 11:32:44','2020-04-16 15:48:21');
/*!40000 ALTER TABLE `jnl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `line`
--

DROP TABLE IF EXISTS `line`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `line` (
  `id` varchar(50) NOT NULL,
  `docId` varchar(50) NOT NULL,
  `accId` varchar(50) NOT NULL,
  `comment` varchar(50) NOT NULL,
  `amount` double(10,2) NOT NULL,
  `i` int NOT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `docId` (`docId`),
  KEY `accId` (`accId`),
  CONSTRAINT `line_acc_fk` FOREIGN KEY (`accId`) REFERENCES `acc` (`id`),
  CONSTRAINT `line_doc_fk` FOREIGN KEY (`docId`) REFERENCES `doc` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `line`
--

LOCK TABLES `line` WRITE;
/*!40000 ALTER TABLE `line` DISABLE KEYS */;
INSERT INTO `line` VALUES ('a','b','a','AAA',1323457.12,0,NULL,NULL),('b','b','b','AAA',-10.00,1,NULL,NULL);
/*!40000 ALTER TABLE `line` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_line`
--

DROP TABLE IF EXISTS `v_line`;
/*!50001 DROP VIEW IF EXISTS `v_line`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_line` AS SELECT 
 1 AS `id`,
 1 AS `fileId`,
 1 AS `jnlId`,
 1 AS `docId`,
 1 AS `accId`,
 1 AS `jnlName`,
 1 AS `jnlType`,
 1 AS `ref`,
 1 AS `regDate`,
 1 AS `comment`,
 1 AS `amount`,
 1 AS `d`,
 1 AS `c`,
 1 AS `i`,
 1 AS `accCode`,
 1 AS `accName`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_line`
--

/*!50001 DROP VIEW IF EXISTS `v_line`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_line` AS select `line`.`id` AS `id`,`jnl`.`fileId` AS `fileId`,`jnl`.`id` AS `jnlId`,`doc`.`id` AS `docId`,`acc`.`id` AS `accId`,`jnl`.`name` AS `jnlName`,`jnl`.`type` AS `jnlType`,`doc`.`ref` AS `ref`,`doc`.`regDate` AS `regDate`,`line`.`comment` AS `comment`,`line`.`amount` AS `amount`,if((`line`.`amount` > 0),`line`.`amount`,0) AS `d`,if((`line`.`amount` < 0),-(`line`.`amount`),0) AS `c`,`line`.`i` AS `i`,`acc`.`code` AS `accCode`,`acc`.`name` AS `accName` from (((`jnl` join `doc` on((`jnl`.`id` = `doc`.`jnlId`))) join `line` on((`line`.`docId` = `doc`.`id`))) join `acc` on((`acc`.`id` = `line`.`accId`))) order by `jnl`.`type`,`doc`.`ref`,`line`.`i` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-22 13:45:21
