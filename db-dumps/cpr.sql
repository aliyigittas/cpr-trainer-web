CREATE DATABASE  IF NOT EXISTS `cpr` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `cpr`;
-- MySQL dump 10.13  Distrib 8.0.38, for macos14 (arm64)
--
-- Host: localhost    Database: cpr
-- ------------------------------------------------------
-- Server version	9.2.0

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
-- Table structure for table `performancedetails`
--

DROP TABLE IF EXISTS `performancedetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `performancedetails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `performanceId` int DEFAULT NULL,
  `detailType` varchar(255) DEFAULT NULL,
  `val` double DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `performancedetails`
--

LOCK TABLES `performancedetails` WRITE;
/*!40000 ALTER TABLE `performancedetails` DISABLE KEYS */;
INSERT INTO `performancedetails` VALUES (1,1,'D',50),(2,1,'F',150),(3,1,'D',55),(4,1,'F',130),(5,1,'D',45.2),(6,1,'D',46.5),(7,1,'D',44.7),(8,1,'D',47.3),(9,1,'D',48),(10,1,'D',46.8),(11,1,'D',45.9),(12,1,'F',112),(13,1,'F',112.5),(14,1,'F',115.2),(15,1,'F',113.7),(16,1,'F',114.1),(17,1,'F',111.8),(18,1,'F',113),(19,1,'D',47.3),(20,6,'D',50),(21,6,'D',55),(22,6,'D',45.2),(23,6,'D',46.5),(24,6,'D',44.7),(25,6,'D',47.3),(26,6,'D',48),(27,6,'D',46.8),(28,6,'D',45.9),(29,6,'D',47.3),(30,6,'F',150),(31,6,'F',130),(32,6,'F',112),(33,6,'F',112.5),(34,6,'F',115.2),(35,6,'F',113.7),(36,6,'F',114.1),(37,6,'F',111.8),(38,6,'F',113),(39,7,'D',50),(40,7,'D',55),(41,7,'D',45.2),(42,7,'D',46.5),(43,7,'D',44.7),(44,7,'D',47.3),(45,7,'D',48),(46,7,'D',46.8),(47,7,'D',45.9),(48,7,'D',47.3),(49,7,'F',150),(50,7,'F',130),(51,7,'F',112),(52,7,'F',112.5),(53,7,'F',115.2),(54,7,'F',113.7),(55,7,'F',114.1),(56,7,'F',111.8),(57,7,'F',113),(58,8,'D',50),(59,8,'D',55),(60,8,'D',45.2),(61,8,'D',46.5),(62,8,'D',44.7),(63,8,'D',47.3),(64,8,'D',48),(65,8,'D',46.8),(66,8,'D',45.9),(67,8,'D',47.3),(68,8,'F',150),(69,8,'F',130),(70,8,'F',112),(71,8,'F',112.5),(72,8,'F',115.2),(73,8,'F',113.7),(74,8,'F',114.1),(75,8,'F',111.8),(76,8,'F',113),(77,9,'D',50),(78,9,'D',55),(79,9,'D',45.2),(80,9,'D',46.5),(81,9,'D',44.7),(82,9,'D',47.3),(83,9,'D',48),(84,9,'D',46.8),(85,9,'D',45.9),(86,9,'D',47.3),(87,9,'F',150),(88,9,'F',130),(89,9,'F',112),(90,9,'F',112.5),(91,9,'F',115.2),(92,9,'F',113.7),(93,9,'F',114.1),(94,9,'F',111.8),(95,9,'F',113);
/*!40000 ALTER TABLE `performancedetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `performancenotes`
--

DROP TABLE IF EXISTS `performancenotes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `performancenotes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `performanceid` int DEFAULT NULL,
  `notetype` varchar(255) DEFAULT NULL,
  `note` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `performancenotes`
--

LOCK TABLES `performancenotes` WRITE;
/*!40000 ALTER TABLE `performancenotes` DISABLE KEYS */;
INSERT INTO `performancenotes` VALUES (3,9,'A','[\n    {\n        \"message\": \"The mean depth of compressions is above the recommended range, indicating a need for improvement in compression depth control.\",\n        \"sentiment\": \"Negative\"\n    },\n    {\n        \"message\": \"The mean frequency of compressions is considerably higher than recommended, with high variability, showing a need for better frequency regulation.\",\n        \"sentiment\": \"Negative\"\n    },\n    {\n        \"message\": \"The standard deviation in compression depth is high, indicating inconsistency in compression application.\",\n        \"sentiment\": \"Negative\"\n    },\n    {\n        \"message\": \"Overall performance score is low, suggesting an opportunity for targeted feedback and additional practice.\",\n        \"sentiment\": \"Negative\"\n    }\n]');
/*!40000 ALTER TABLE `performancenotes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `performances`
--

DROP TABLE IF EXISTS `performances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `performances` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int DEFAULT NULL,
  `feedbackType` varchar(255) DEFAULT NULL,
  `meanDepth` double DEFAULT NULL,
  `meanFreq` double DEFAULT NULL,
  `stdDepth` double DEFAULT NULL,
  `stdFreq` double DEFAULT NULL,
  `highDepthCount` int DEFAULT NULL,
  `highFreqCount` int DEFAULT NULL,
  `lowDepthCount` int DEFAULT NULL,
  `lowFreqCount` int DEFAULT NULL,
  `totalCompression` int DEFAULT NULL,
  `score` double DEFAULT NULL,
  `trainingTime` double DEFAULT NULL,
  `performanceDate` varchar(255) DEFAULT NULL,
  `DepthArray` varbinary(255) DEFAULT NULL,
  `FreqArray` varbinary(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `performances`
--

LOCK TABLES `performances` WRITE;
/*!40000 ALTER TABLE `performances` DISABLE KEYS */;
INSERT INTO `performances` VALUES (1,11,'V',148.21,177.86,58.32,210.28,0,1,7,1,9,50,120.01,'2025-04-22 15:45:27',NULL,NULL),(6,11,'VH',148.21,177.86,58.32,210.28,0,1,7,1,9,50,120.01,'2025-04-28 15:45:27',NULL,NULL),(7,11,'VH',148.21,177.86,58.32,210.28,0,1,7,1,9,50,120.01,'2025-04-28 15:45:27',NULL,NULL),(8,11,'VH',148.21,177.86,58.32,210.28,0,1,7,1,9,50,120.01,'2025-04-28 18:45:27',NULL,NULL),(9,11,'VH',148.21,177.86,58.32,210.28,0,1,7,1,9,50,120.01,'2025-04-28 18:45:27',NULL,NULL);
/*!40000 ALTER TABLE `performances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `khasID` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (9,'front','end','frontend','mail@mail.com','8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92','20201701054'),(10,'da','asd','sad','a@a.com','a976270e7922fceaf8deaed98809e1c4f63c0898e5119a82f45d9f3be1226b23','213'),(11,'as','as','as','a@a.com','6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918','dfd');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-28 18:48:15
