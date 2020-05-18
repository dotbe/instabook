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
  `defAccId` varchar(50) DEFAULT NULL,
  `code` varchar(50) NOT NULL,
  `vatCode` varchar(10) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `acc_vat_fk_idx` (`vatCode`),
  KEY `acc_acc_fk_idx` (`defAccId`),
  CONSTRAINT `acc_acc_fk` FOREIGN KEY (`defAccId`) REFERENCES `acc` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acc`
--

LOCK TABLES `acc` WRITE;
/*!40000 ALTER TABLE `acc` DISABLE KEYS */;
INSERT INTO `acc` VALUES ('00da7662-8dc3-4c65-9704-14cf5e927a6d',NULL,'600000',NULL,'Matières premières',1,'2020-04-16 10:08:41','2020-04-16 10:13:28'),('06033f1e-6bd0-4bba-8808-cf2b77a78c66',NULL,'440OKAY',NULL,'ok',1,NULL,NULL),('43332c0e-54bd-46a8-b3cf-7098b2f72081',NULL,'451000',NULL,'TVA due sur ventes',1,NULL,NULL),('446ed70f-ac8c-4b2b-b73d-d4d31f787025',NULL,'440BRICO',NULL,'Brico',1,NULL,NULL),('68f3d4e3-4e7d-455e-a44e-f92213fd26a8',NULL,'610100',NULL,'Fournitures',1,NULL,NULL),('6ab67bfd-5533-4da3-b950-8731e76bc971',NULL,'411000',NULL,'TVA déductible pour achats',1,NULL,NULL),('6b9c4fc0-641d-4d0a-a0a3-164068af04f3',NULL,'440VETEMENTS',NULL,'Vêtements',1,NULL,NULL),('6f7f4e20-a729-4d8a-b601-fd4bc87cec9c',NULL,'700000',NULL,'Chiffre d\'affaires',1,NULL,NULL),('7a273619-73c2-4e9e-8421-92995e6e970f',NULL,'6100TEST',NULL,'test',1,NULL,NULL),('a',NULL,'1010000',NULL,'Capital non appelle',1,'2020-03-22 15:13:53','2020-04-11 14:54:34'),('a09f48dc-54d6-4a23-b1d8-babd9639b93d',NULL,'650000',NULL,'Intérêts',1,NULL,NULL),('a712e22e-28a3-488c-bbab-5ccf43262e53',NULL,'1000000',NULL,'Capital',1,'2020-03-22 13:38:50','2020-03-22 15:13:39'),('b',NULL,'440PROXIMUS',NULL,'Proximus',1,NULL,NULL),('b61c2f2b-0843-4ec6-a28d-9cdb0aeab16c',NULL,'440TEST',NULL,'Test',1,NULL,NULL),('b73acc23-bf33-4580-9088-9464b17a84b5',NULL,'400ARHS',NULL,'Ahrs SRL',1,NULL,NULL),('c',NULL,'610100',NULL,'Téléphonie',1,NULL,NULL),('c2d4577e-5392-403f-a572-298cdeebdd52',NULL,'440ELECTRABEL',NULL,'Electrabel',1,NULL,NULL),('fbe2045d-aebc-4542-a95c-6524cc92fa69',NULL,'740000',NULL,'Divers',1,NULL,NULL);
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
INSERT INTO `doc` VALUES ('03c83817-3233-4cb2-b497-431bfdc04327','44083d81-62e6-4587-a187-dc957cc7c935',20200001,'2020-04-28',NULL,NULL),('0d52bce5-2297-4131-ba3a-67d57922629d','a',20200009,'2020-02-02',NULL,NULL),('113e625d-4923-4f65-9911-c24f6137b120','a',20200033,'2020-02-02',NULL,NULL),('11efb1ab-0cda-451e-b3de-c24b33f12197','a',20200013,'2020-02-02',NULL,NULL),('1eb87861-3b4d-444c-b2f2-f23775fbbea1','a',20200021,'2020-02-02',NULL,NULL),('23981f4c-194d-41d8-a96b-976aa21fc422','a',20200012,'2020-02-02',NULL,NULL),('2b1fde14-bfee-47ff-a432-6417bae9bddd','a',20200026,'2020-02-02',NULL,NULL),('2c96a407-e9ba-4a6e-85ea-62668666b027','a',20200031,'2020-02-02',NULL,NULL),('404d4e21-78ec-4614-bba0-ab4d112a40b1','a',20200006,'2020-02-02',NULL,NULL),('4b4650c9-866f-4889-912c-c032a94297d9','a',20200017,'2020-02-02',NULL,NULL),('511a45e3-ae1c-4b09-a85c-5d0771211397','a',20200007,'2020-02-02',NULL,NULL),('6278b526-a0a2-4dbf-ba35-45206401e7e3','a',20200011,'2020-02-02',NULL,NULL),('68400220-25ff-42bc-afc0-6bc582915b43','a',20200005,'2020-02-02',NULL,NULL),('6ae6337a-436a-48fa-a4bc-7ae041b1392d','a',20200027,'2020-02-02',NULL,NULL),('7d84d186-243c-41ce-b280-62898a71cca4','a',20200003,'2020-02-02',NULL,NULL),('821a7b6f-1950-4d1b-a696-abd4b23c9d08','a',20200016,'2020-02-02',NULL,NULL),('84341d04-25d4-4e93-ac97-ffa8748f3eb4','a',20200028,'2020-02-02',NULL,NULL),('8627a553-77dd-45c9-b5cd-ff39d21d4d44','5c4e4798-c987-464a-89e9-fa2f8d8ad82e',20200001,'2020-04-28',NULL,NULL),('8840cd20-66cd-4d7a-b29f-2b69b80d67a9','a',20200019,'2020-02-02',NULL,NULL),('8eb2dc49-c4de-4503-8f17-992cf8f0b7bd','a',20200022,'2020-02-02',NULL,NULL),('90d54584-45a4-4a94-bb56-446d9402b9c9','a',20200008,'2020-02-02',NULL,NULL),('9f68a1d8-99bf-4674-abe7-c94850d0f24b','a',20200010,'2020-02-02',NULL,NULL),('a','a',20200001,'2020-01-01',NULL,NULL),('a62cbec5-32b4-48db-943b-49f5c89d1ec7','a',20200024,'2020-02-02',NULL,NULL),('b','a',20200002,'2020-02-02',NULL,NULL),('b21e56b8-eecc-4cb8-9e45-d4e18b4173ba','a',20200004,'2020-02-02',NULL,NULL),('b63e7034-98e4-4750-b184-b4191705a198','b545c560-d15f-49b1-816c-d375d8197760',20200002,'2020-04-27',NULL,NULL),('c5e25b68-b2c3-420c-9532-e94658b18fa8','a',20200030,'2020-02-02',NULL,NULL),('d191ba8a-209d-485f-935e-031f32dd1574','a',20200018,'2020-02-02',NULL,NULL),('d64a9642-eb2d-4078-92d8-4308043ac9a3','a',20200023,'2020-02-02',NULL,NULL),('d95b9edc-9e04-4915-a511-8e91085b4aa2','a',20200032,'2020-02-02',NULL,NULL),('dd7818a1-c43c-448b-94af-ccef2a10e0de','a',20200029,'2020-02-02',NULL,NULL),('e3b280a9-9fee-4d00-9dee-489933cc3eaa','a',20200020,'2020-02-02',NULL,NULL),('e5554516-a5b2-4675-9e1e-55438d4fed95','b545c560-d15f-49b1-816c-d375d8197760',20200001,'2020-04-27',NULL,NULL),('ecbaeaf3-1527-4270-ae17-b2940e1b748b','a',20200014,'2020-02-02',NULL,NULL),('f70f4a69-94c6-428f-97d5-f6917df3114a','a',20200025,'2020-02-02',NULL,NULL),('ff688b80-fa85-43f3-a0b0-6be1d577a0b2','a',20200015,'2020-02-02',NULL,NULL);
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
INSERT INTO `file` VALUES ('2122fec3-ff8c-41a8-ad1a-1d1b2beca39a','Hello world!!',NULL,'2020-04-04 16:44:54','2020-04-05 16:40:22'),('556b497b-17a1-4f7e-806e-a95f05fbad24','ABCEFGHI',NULL,'2020-04-03 18:06:07','2020-04-03 18:06:07'),('55afc5cf-d8f9-45d7-ae70-a163ab0ccc84','AAA',NULL,'2020-04-04 16:51:30','2020-04-04 16:51:30'),('92c73026-3762-4a11-8237-f7ff023dcd31','ABCEFGHIJK',NULL,'2020-04-03 18:08:38','2020-04-03 18:08:38'),('a','Hello world',NULL,'2020-03-17 00:00:00','2020-03-21 00:00:00'),('bc0ec327-2a52-46d2-9ca6-ef69497c6771','AAAZZ',NULL,'2020-04-12 16:18:09','2020-04-12 16:18:09'),('bda43370-6325-454c-8ff8-20d524946818','AAABBw','00x','2020-03-19 00:00:00','2020-03-19 00:00:00'),('c9ae32a1-69e7-45e0-983f-be5ae8907a43','ABCEFG',NULL,'2020-04-03 18:05:52','2020-04-03 18:05:52'),('f4eb6e1b-ad42-4475-a711-538dc21c89be','ABCEF',NULL,'2020-04-03 18:04:29','2020-04-03 18:04:29'),('f96ea5a4-6dd1-4eb8-a0c3-5916689c6b3a','AAABB','123456','2020-03-19 00:00:00','2020-04-17 22:34:41');
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
  `accId` varchar(50) DEFAULT NULL,
  `name` varchar(50) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `type` varchar(50) NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `jnl_file_fk_idx` (`fileId`),
  KEY `jnl_acc_fk_idx` (`accId`),
  CONSTRAINT `jnl_acc_fk` FOREIGN KEY (`accId`) REFERENCES `acc` (`id`),
  CONSTRAINT `jnl_file_fk` FOREIGN KEY (`fileId`) REFERENCES `file` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jnl`
--

LOCK TABLES `jnl` WRITE;
/*!40000 ALTER TABLE `jnl` DISABLE KEYS */;
INSERT INTO `jnl` VALUES ('3b1735b3-5ec6-480b-88ba-c9debb36bb53','f96ea5a4-6dd1-4eb8-a0c3-5916689c6b3a',NULL,'Achats',1,'BUY','2020-04-17 22:40:54','2020-04-17 22:40:54'),('44083d81-62e6-4587-a187-dc957cc7c935','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84',NULL,'NC s/Ventes',1,'SELL_CN',NULL,NULL),('5c4e4798-c987-464a-89e9-fa2f8d8ad82e','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84',NULL,'NC s/Achats',1,'BUY_CN','2020-04-16 15:47:54','2020-04-16 15:48:10'),('730940b8-4b13-43a9-ab1d-3ca1efaa3fb6','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84',NULL,'Opérations Diverses',1,'DIVERSE','2020-04-09 13:23:32','2020-04-09 13:23:32'),('7f213fac-7899-473a-9c7b-598b87106f1e','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84',NULL,'BELFIUS',1,'FINANCE','2020-04-09 13:22:33','2020-04-09 13:22:33'),('a','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84',NULL,'Achats',1,'BUY',NULL,'2020-04-17 22:37:17'),('b545c560-d15f-49b1-816c-d375d8197760','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84',NULL,'Ventes',1,'SELL','2020-04-09 11:32:44','2020-04-16 15:48:21'),('c0a61228-a8e4-435c-b8bd-bd3ea60479d8','55afc5cf-d8f9-45d7-ae70-a163ab0ccc84',NULL,'TVA',1,'DIVERSE',NULL,NULL);
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
  `vatCode` varchar(10) DEFAULT NULL,
  `comment` varchar(50) DEFAULT NULL,
  `amount` double(10,2) NOT NULL,
  `i` int NOT NULL,
  `ro` tinyint NOT NULL DEFAULT '0',
  `updatedAt` datetime DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `docId` (`docId`),
  KEY `accId` (`accId`),
  KEY `vatCode` (`vatCode`) /*!80000 INVISIBLE */,
  CONSTRAINT `line_acc_fk` FOREIGN KEY (`accId`) REFERENCES `acc` (`id`),
  CONSTRAINT `line_doc_fk` FOREIGN KEY (`docId`) REFERENCES `doc` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `line`
--

LOCK TABLES `line` WRITE;
/*!40000 ALTER TABLE `line` DISABLE KEYS */;
INSERT INTO `line` VALUES ('077ba53a-e8f4-41b0-b051-b88c9b7f0af2','1eb87861-3b4d-444c-b2f2-f23775fbbea1','c',NULL,'Proximus',30.00,1,1,NULL,NULL),('0c310b84-da70-4229-98b1-de2a0c4f075f','2c96a407-e9ba-4a6e-85ea-62668666b027','c',NULL,'Proximus',66.00,1,1,NULL,NULL),('0d0dd087-6218-4951-9e82-c32751ae172b','e3b280a9-9fee-4d00-9dee-489933cc3eaa','c',NULL,'Proximus',0.50,1,1,NULL,NULL),('0dbc18e9-ccbc-48ff-9c80-642823650a1e','821a7b6f-1950-4d1b-a696-abd4b23c9d08','c',NULL,'Proximus',7.00,1,1,NULL,NULL),('1e0ba1da-bc0d-40dc-b110-dd75e4c1df0f','ff688b80-fa85-43f3-a0b0-6be1d577a0b2','b',NULL,'Téléphonie',-8.00,0,1,NULL,NULL),('24f1b04d-2246-48b3-a86c-ca0979ba0bce','f70f4a69-94c6-428f-97d5-f6917df3114a','c',NULL,'Proximus',60.00,1,1,NULL,NULL),('27d3b25d-56d5-4d33-8c81-2e0f6a94bf58','d64a9642-eb2d-4078-92d8-4308043ac9a3','b',NULL,'Proximus',33.00,1,1,NULL,NULL),('27e6cc9e-2384-4ebc-ba64-fb9fdd140c5e','d95b9edc-9e04-4915-a511-8e91085b4aa2','c',NULL,'Proximus',77.00,1,1,NULL,NULL),('41490c84-16e8-4d3d-b4d4-d3750a946a48','b63e7034-98e4-4750-b184-b4191705a198','00da7662-8dc3-4c65-9704-14cf5e927a6d',NULL,'Ahrs SRL',-100.00,1,1,NULL,NULL),('42f8c997-eb6c-4ce3-858a-80a60f2dec37','ecbaeaf3-1527-4270-ae17-b2940e1b748b','b',NULL,'Téléphonie',-10.00,0,1,NULL,NULL),('446fe67e-afd3-4bd9-8664-c795431de8ea','f70f4a69-94c6-428f-97d5-f6917df3114a','b',NULL,'Téléphonie',-60.00,0,1,NULL,NULL),('4b3099ee-b92f-47ac-9e8a-a4792916598b','1eb87861-3b4d-444c-b2f2-f23775fbbea1','b',NULL,'Téléphonie',-30.00,0,1,NULL,NULL),('4b6654e8-5507-424b-a336-c2d81093a58d','c5e25b68-b2c3-420c-9532-e94658b18fa8','b',NULL,'Téléphonie',-10.00,0,1,NULL,NULL),('4bad3c59-6a28-4c87-ab65-f3ea31a809e3','8627a553-77dd-45c9-b5cd-ff39d21d4d44','c',NULL,'Proximus',-99.00,1,1,NULL,NULL),('4bce5ddc-afa1-46f6-8bef-42996e591a7f','d191ba8a-209d-485f-935e-031f32dd1574','b',NULL,'Téléphonie',-40.00,0,1,NULL,NULL),('5017031a-6d11-4db6-beb5-f9adee592ca8','8840cd20-66cd-4d7a-b29f-2b69b80d67a9','b',NULL,'Téléphonie',-1.00,0,1,NULL,NULL),('54e4ee60-cd43-4cf1-8824-5bd0a7231d41','4b4650c9-866f-4889-912c-c032a94297d9','c',NULL,'Proximus',5.00,1,1,NULL,NULL),('55651f8c-f5f8-47d8-b303-79b1eff6f460','11efb1ab-0cda-451e-b3de-c24b33f12197','c',NULL,'Proximus',654.00,1,1,NULL,NULL),('5a15c855-1be3-4d10-bed0-1d62129b0f18','c5e25b68-b2c3-420c-9532-e94658b18fa8','c',NULL,'Proximus',10.00,1,1,NULL,NULL),('5b84df2c-2d80-4be0-8b35-7aff04226c42','a62cbec5-32b4-48db-943b-49f5c89d1ec7','00da7662-8dc3-4c65-9704-14cf5e927a6d',NULL,'Proximus',1.00,1,1,NULL,NULL),('5d83a461-c2cc-409e-9544-6827114b073f','2c96a407-e9ba-4a6e-85ea-62668666b027','b',NULL,'Téléphonie',-66.00,0,1,NULL,NULL),('5edda5d3-67dc-4307-b452-b9f51cd18b52','dd7818a1-c43c-448b-94af-ccef2a10e0de','b73acc23-bf33-4580-9088-9464b17a84b5',NULL,'Proximus',10.00,3,1,NULL,NULL),('5eebd357-92c4-4d11-a3fa-9ad1803f478d','8627a553-77dd-45c9-b5cd-ff39d21d4d44','b',NULL,'Téléphonie',99.00,0,1,NULL,NULL),('6b27794d-7eae-4de8-ad54-5a97059f7e55','d191ba8a-209d-485f-935e-031f32dd1574','c',NULL,'Proximus',40.00,1,1,NULL,NULL),('6f27c64d-74dc-409a-8ad4-1df1c74e44ed','a62cbec5-32b4-48db-943b-49f5c89d1ec7','b',NULL,'Matières premières',-1.00,0,1,NULL,NULL),('717c4a47-044d-4c57-aa1f-9311e58c8842','84341d04-25d4-4e93-ac97-ffa8748f3eb4','c',NULL,'Proximus',5.00,1,1,NULL,NULL),('7ecf1863-aa0d-4619-8cf5-7240a2fc3270','6ae6337a-436a-48fa-a4bc-7ae041b1392d','b',NULL,'Téléphonie',-40.00,0,1,NULL,NULL),('81e3d3c6-3bd0-4570-b13c-4d68950edd77','d95b9edc-9e04-4915-a511-8e91085b4aa2','b',NULL,'Téléphonie',-77.00,0,1,NULL,NULL),('8d35ae52-5c4d-4a1f-83ab-02f168b36c16','2b1fde14-bfee-47ff-a432-6417bae9bddd','c',NULL,'Proximus',10.00,1,1,NULL,NULL),('8f7d6ca4-8d61-42b8-a0a7-f3c8458f5f0b','8840cd20-66cd-4d7a-b29f-2b69b80d67a9','c',NULL,'Proximus',1.00,1,1,NULL,NULL),('91bc919b-1f7c-44db-bbfd-ae7d190904ac','84341d04-25d4-4e93-ac97-ffa8748f3eb4','b',NULL,'Téléphonie',-5.00,0,1,NULL,NULL),('94132b82-4421-44ca-9fe0-5932c6028a07','4b4650c9-866f-4889-912c-c032a94297d9','b',NULL,'Téléphonie',-5.00,0,1,NULL,NULL),('95475b7a-5b5c-4e83-9fa2-9acdfa2a2127','8eb2dc49-c4de-4503-8f17-992cf8f0b7bd','b',NULL,'Proximus',-50.00,0,1,NULL,NULL),('95e7aa12-e5c3-4ee3-80eb-afc5cf7751c1','03c83817-3233-4cb2-b497-431bfdc04327','00da7662-8dc3-4c65-9704-14cf5e927a6d',NULL,'Ahrs SRL',100.00,1,1,NULL,NULL),('9cf6c153-620f-42fb-a705-0048de376af8','dd7818a1-c43c-448b-94af-ccef2a10e0de','00da7662-8dc3-4c65-9704-14cf5e927a6d',NULL,'Proximus',50.00,1,1,NULL,NULL),('a','b','a',NULL,'AAA',1323457.12,0,1,NULL,NULL),('a220663e-afc9-4f5a-ac54-17adfb8c365a','d64a9642-eb2d-4078-92d8-4308043ac9a3','b',NULL,'Proximus',-33.00,0,1,NULL,NULL),('aad63943-8417-4b1f-a63e-c3a3f8bc17fc','821a7b6f-1950-4d1b-a696-abd4b23c9d08','b',NULL,'Téléphonie',-7.00,0,1,NULL,NULL),('b','b','b',NULL,'AAA',-10.00,1,1,NULL,NULL),('b6a05e14-fb15-42f0-9e6e-48f1ffa40dca','ecbaeaf3-1527-4270-ae17-b2940e1b748b','c',NULL,'Proximus',10.00,1,1,NULL,NULL),('b99a19d4-df03-4d71-914d-fd6d2151a6ad','113e625d-4923-4f65-9911-c24f6137b120','c',NULL,'Proximus',88.00,1,1,NULL,NULL),('bb4e2c90-8caf-409a-b238-5adcbc1f7699','ff688b80-fa85-43f3-a0b0-6be1d577a0b2','c',NULL,'Proximus',8.00,1,1,NULL,NULL),('bba2133b-9cc4-453c-bcc0-8779afc5601f','2b1fde14-bfee-47ff-a432-6417bae9bddd','b',NULL,'Téléphonie',-10.00,0,1,NULL,NULL),('bf505c84-f137-4be3-8128-31a27ad5f86e','dd7818a1-c43c-448b-94af-ccef2a10e0de','00da7662-8dc3-4c65-9704-14cf5e927a6d',NULL,'Proximus',-10.00,2,1,NULL,NULL),('c6a2b5eb-c2d7-4a91-a087-206a0136e29b','6ae6337a-436a-48fa-a4bc-7ae041b1392d','c',NULL,'Proximus',30.00,1,1,NULL,NULL),('c94f8c53-e5f5-47fe-bf77-a57d6fe46a65','11efb1ab-0cda-451e-b3de-c24b33f12197','b',NULL,'Téléphonie',-654.00,0,1,NULL,NULL),('d274d894-ba33-4675-a39d-30e19d6589e9','113e625d-4923-4f65-9911-c24f6137b120','b',NULL,'Téléphonie',-88.00,0,1,NULL,NULL),('d673e93b-67c8-4ec3-a367-8f25dad647bd','8eb2dc49-c4de-4503-8f17-992cf8f0b7bd','b',NULL,'Proximus',50.00,1,1,NULL,NULL),('e7b72f41-f9cf-4942-b38e-2b3984705e55','6ae6337a-436a-48fa-a4bc-7ae041b1392d','00da7662-8dc3-4c65-9704-14cf5e927a6d',NULL,'Proximus',10.00,2,1,NULL,NULL),('e92ade7a-d539-4086-a8b8-5c2bea2eca5f','03c83817-3233-4cb2-b497-431bfdc04327','b73acc23-bf33-4580-9088-9464b17a84b5',NULL,'Matières premières',-100.00,0,1,NULL,NULL),('edc31c20-703f-4bea-88cf-63029bca0553','b63e7034-98e4-4750-b184-b4191705a198','b73acc23-bf33-4580-9088-9464b17a84b5',NULL,'Matières premières',100.00,0,1,NULL,NULL),('f3d098f7-b8ce-4abe-890b-913c1a20dcbf','e3b280a9-9fee-4d00-9dee-489933cc3eaa','b',NULL,'Téléphonie',-0.50,0,1,NULL,NULL),('f3e81ffb-34a2-4086-b820-c6a0299a25d1','dd7818a1-c43c-448b-94af-ccef2a10e0de','b',NULL,'Matières premières',-50.00,0,1,NULL,NULL);
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
-- Temporary view structure for view `v_vat`
--

DROP TABLE IF EXISTS `v_vat`;
/*!50001 DROP VIEW IF EXISTS `v_vat`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_vat` AS SELECT 
 1 AS `id`,
 1 AS `jnlType`,
 1 AS `code`,
 1 AS `box`,
 1 AS `accId`,
 1 AS `pc`,
 1 AS `baseBox`,
 1 AS `accName`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `vat`
--

DROP TABLE IF EXISTS `vat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vat` (
  `id` varchar(50) NOT NULL,
  `jnlType` varchar(10) NOT NULL,
  `code` varchar(10) NOT NULL,
  `box` varchar(10) NOT NULL,
  `accId` varchar(50) NOT NULL,
  `pc` double(10,2) NOT NULL,
  `baseBox` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `vatCode_INDEX` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vat`
--

LOCK TABLES `vat` WRITE;
/*!40000 ALTER TABLE `vat` DISABLE KEYS */;
INSERT INTO `vat` VALUES ('6691b426-337d-46c7-9871-90777132ef69','BUY','VEH','59','6ab67bfd-5533-4da3-b950-8731e76bc971',10.50,'na'),('970bbfc6-8a7f-485e-91bc-cb406367239d','BUY','21','59','6ab67bfd-5533-4da3-b950-8731e76bc971',21.00,'na'),('d4eec14e-a2a8-404e-9dd7-4444dd0d53c1','SELL','21','54','43332c0e-54bd-46a8-b3cf-7098b2f72081',21.00,'03'),('ee5c2051-08fd-4e92-a787-874cbe0ee127','BUY','0','59','6ab67bfd-5533-4da3-b950-8731e76bc971',0.00,'na');
/*!40000 ALTER TABLE `vat` ENABLE KEYS */;
UNLOCK TABLES;

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

--
-- Final view structure for view `v_vat`
--

/*!50001 DROP VIEW IF EXISTS `v_vat`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_vat` AS select `vat`.`id` AS `id`,`vat`.`jnlType` AS `jnlType`,`vat`.`code` AS `code`,`vat`.`box` AS `box`,`vat`.`accId` AS `accId`,`vat`.`pc` AS `pc`,`vat`.`baseBox` AS `baseBox`,concat(`acc`.`code`,' (',`acc`.`name`,')') AS `accName` from (`vat` left join `acc` on((`vat`.`accId` = convert(`acc`.`id` using utf8mb4)))) */;
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

-- Dump completed on 2020-04-29  2:04:57
