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
-- Dumping data for table `acc`
--

LOCK TABLES `acc` WRITE;
/*!40000 ALTER TABLE `acc` DISABLE KEYS */;
INSERT INTO `acc` VALUES ('00da7662-8dc3-4c65-9704-14cf5e927a6d','600000',NULL,NULL,'Matières premières',1),('a','1010000',NULL,NULL,'Capital non appelle',1),('a712e22e-28a3-488c-bbab-5ccf43262e53','1000000',NULL,NULL,'Capital',1),('b','440PROXIMUS',NULL,NULL,'Proximus',1),('b73acc23-bf33-4580-9088-9464b17a84b5','400ARHS',NULL,NULL,'Ahrs SRL',1),('c','610100',NULL,NULL,'Téléphonie',1);
/*!40000 ALTER TABLE `acc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `conf`
--

LOCK TABLES `conf` WRITE;
/*!40000 ALTER TABLE `conf` DISABLE KEYS */;
INSERT INTO `conf` VALUES ('accBS','1,2,3,4,5','Balance Sheet (Bilan) accounts list'),('accC','400','Customes account prefix (start with)'),('accIS','6,7','Income Statement (Résultat) accounts list'),('accS','440','Suppliers account prefix (start with)'),('docRef','YYYY/NNNN','Document number format. Number must be unique for a Journal for all years: YYYYNNN, YYMMNN, YYNNN, NNNNN');
/*!40000 ALTER TABLE `conf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `doc`
--

LOCK TABLES `doc` WRITE;
/*!40000 ALTER TABLE `doc` DISABLE KEYS */;
INSERT INTO `doc` VALUES ('a','a',20200001,'2020-01-01'),('a08d5aa8-fb34-41a4-b1f5-bc7b93b9e28a','a',20200003,'2020-02-02'),('b','a',20200002,'2020-02-02'),('d61f2ace-ea79-4985-a273-e27d55fd8ae2','a',20200004,'2020-02-02');
/*!40000 ALTER TABLE `doc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `file`
--

LOCK TABLES `file` WRITE;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
INSERT INTO `file` VALUES ('2122fec3-ff8c-41a8-ad1a-1d1b2beca39a','Hello world!!',NULL),('556b497b-17a1-4f7e-806e-a95f05fbad24','ABCEFGHI',NULL),('55afc5cf-d8f9-45d7-ae70-a163ab0ccc84','AAA',NULL),('92c73026-3762-4a11-8237-f7ff023dcd31','ABCEFGHIJK',NULL),('a','Hello world',NULL),('bc0ec327-2a52-46d2-9ca6-ef69497c6771','AAAZZ',NULL),('bda43370-6325-454c-8ff8-20d524946818','AAABBw','00x'),('c9ae32a1-69e7-45e0-983f-be5ae8907a43','ABCEFG',NULL),('f4eb6e1b-ad42-4475-a711-538dc21c89be','ABCEF',NULL),('f96ea5a4-6dd1-4eb8-a0c3-5916689c6b3a','AAABB','1234');
/*!40000 ALTER TABLE `file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `jnl`
--

LOCK TABLES `jnl` WRITE;
/*!40000 ALTER TABLE `jnl` DISABLE KEYS */;
INSERT INTO `jnl` VALUES ('3b1735b3-5ec6-480b-88ba-c9debb36bb53','f96ea5a4-6dd1-4eb8-a0c3-5916689c6b3a',NULL,'Achats',1,'BUY',NULL),('44083d81-62e6-4587-a187-dc957cc7c935','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84',NULL,'NC s/Ventes',1,'SELL_CN',1),('5c4e4798-c987-464a-89e9-fa2f8d8ad82e','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84',NULL,'NC s/Achats',1,'BUY_CN',1),('730940b8-4b13-43a9-ab1d-3ca1efaa3fb6','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84',NULL,'Opérations Diverses',1,'DIVERSE',10),('7f213fac-7899-473a-9c7b-598b87106f1e','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84',NULL,'BELFIUS',1,'FINANCE',1),('a','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84',NULL,'Achats',1,'BUY',NULL),('b545c560-d15f-49b1-816c-d375d8197760','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84',NULL,'Ventes',1,'SELL',1);
/*!40000 ALTER TABLE `jnl` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `line`
--

LOCK TABLES `line` WRITE;
/*!40000 ALTER TABLE `line` DISABLE KEYS */;
INSERT INTO `line` VALUES ('356cba10-f83d-44f1-816a-aff68bcc6ba4','a08d5aa8-fb34-41a4-b1f5-bc7b93b9e28a','b',NULL,'Téléphonie',-10.00,0,0),('8e78a9d2-7d5d-4cfb-9cb1-5fe452157203','d61f2ace-ea79-4985-a273-e27d55fd8ae2','c',NULL,'Proximus',10.00,1,0),('a','b','a',NULL,'AAA',1323457.12,0,0),('acd768e1-1b63-4bca-bf82-972d0c79d15f','d61f2ace-ea79-4985-a273-e27d55fd8ae2','b',NULL,'Téléphonie',-10.00,0,0),('ae76495e-84e4-4868-8b7b-a8d63fdf0f09','a08d5aa8-fb34-41a4-b1f5-bc7b93b9e28a','c',NULL,'Proximus',10.00,1,0),('b','b','b',NULL,'AAA',-10.00,1,0);
/*!40000 ALTER TABLE `line` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `vat`
--

LOCK TABLES `vat` WRITE;
/*!40000 ALTER TABLE `vat` DISABLE KEYS */;
/*!40000 ALTER TABLE `vat` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-01 18:44:49
