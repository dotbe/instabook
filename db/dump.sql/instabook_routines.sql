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
-- Temporary view structure for view `v_line`
--

DROP TABLE IF EXISTS `v_line`;
/*!50001 DROP VIEW IF EXISTS `v_line`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_line` AS SELECT 
 1 AS `fileId`,
 1 AS `docId`,
 1 AS `docRef`,
 1 AS `docDate`,
 1 AS `jnlId`,
 1 AS `jnlName`,
 1 AS `jnlType`,
 1 AS `lineId`,
 1 AS `lineName`,
 1 AS `lineAmount`,
 1 AS `accId`,
 1 AS `accName`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_file`
--

DROP TABLE IF EXISTS `v_file`;
/*!50001 DROP VIEW IF EXISTS `v_file`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_file` AS SELECT 
 1 AS `id`,
 1 AS `name`,
 1 AS `taxRef`,
 1 AS `createdAt`,
 1 AS `updatedAt`,
 1 AS `countDoc`,
 1 AS `lastRegDate`*/;
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
/*!50001 VIEW `v_line` AS select `doc`.`fileId` AS `fileId`,`doc`.`id` AS `docId`,`doc`.`ref` AS `docRef`,`doc`.`regDate` AS `docDate`,`jnl`.`id` AS `jnlId`,`jnl`.`name` AS `jnlName`,`jnl`.`type` AS `jnlType`,`line`.`id` AS `lineId`,`line`.`name` AS `lineName`,`line`.`amount` AS `lineAmount`,`acc`.`id` AS `accId`,`acc`.`name` AS `accName` from (((`doc` join `jnl` on((`jnl`.`id` = `doc`.`jnlId`))) join `line` on((`line`.`docId` = `doc`.`id`))) join `acc` on((`acc`.`id` = `line`.`accId`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_file`
--

/*!50001 DROP VIEW IF EXISTS `v_file`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_file` AS select `file`.`id` AS `id`,`file`.`name` AS `name`,`file`.`taxRef` AS `taxRef`,`file`.`createdAt` AS `createdAt`,`file`.`updatedAt` AS `updatedAt`,(select count(0) from `doc` where (`doc`.`fileId` = `file`.`id`)) AS `countDoc`,(select max(`doc`.`regDate`) from `doc` where (`doc`.`fileId` = `file`.`id`)) AS `lastRegDate` from `file` */;
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

-- Dump completed on 2020-04-14 23:34:05
