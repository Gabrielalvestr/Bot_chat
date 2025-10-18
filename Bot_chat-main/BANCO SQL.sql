-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: juri_db
-- ------------------------------------------------------
-- Server version	8.0.28

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
-- Table structure for table `tb_dados_profissionais`
--

DROP TABLE IF EXISTS `tb_dados_profissionais`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_dados_profissionais` (
  `id_profissional` int NOT NULL,
  `oab` varchar(20) NOT NULL,
  `documento_cnpj` varchar(18) DEFAULT NULL,
  PRIMARY KEY (`id_profissional`),
  UNIQUE KEY `oab` (`oab`),
  UNIQUE KEY `documento_cnpj` (`documento_cnpj`),
  CONSTRAINT `fk_id_profissional` FOREIGN KEY (`id_profissional`) REFERENCES `tb_usuarios` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_dados_profissionais`
--

LOCK TABLES `tb_dados_profissionais` WRITE;
/*!40000 ALTER TABLE `tb_dados_profissionais` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_dados_profissionais` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_evidencias`
--

DROP TABLE IF EXISTS `tb_evidencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_evidencias` (
  `id_evidencia` int NOT NULL AUTO_INCREMENT,
  `imagem_url` longtext,
  `hash` varchar(64) DEFAULT NULL,
  `url_pagina` varchar(2048) NOT NULL,
  `wayback_url` varchar(2048) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_evidencia`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_evidencias`
--

LOCK TABLES `tb_evidencias` WRITE;
/*!40000 ALTER TABLE `tb_evidencias` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_evidencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_ocorrencia_evidencia`
--

DROP TABLE IF EXISTS `tb_ocorrencia_evidencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_ocorrencia_evidencia` (
  `id_ocorrencia` int NOT NULL,
  `id_evidencia` int NOT NULL,
  PRIMARY KEY (`id_ocorrencia`,`id_evidencia`),
  KEY `fk_rel_evidencia` (`id_evidencia`),
  CONSTRAINT `fk_rel_evidencia` FOREIGN KEY (`id_evidencia`) REFERENCES `tb_evidencias` (`id_evidencia`) ON DELETE CASCADE,
  CONSTRAINT `fk_rel_ocorrencia` FOREIGN KEY (`id_ocorrencia`) REFERENCES `tb_ocorrencias` (`id_ocorrencia`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_ocorrencia_evidencia`
--

LOCK TABLES `tb_ocorrencia_evidencia` WRITE;
/*!40000 ALTER TABLE `tb_ocorrencia_evidencia` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_ocorrencia_evidencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_ocorrencias`
--

DROP TABLE IF EXISTS `tb_ocorrencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_ocorrencias` (
  `id_ocorrencia` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL COMMENT 'Usuário que criou a ocorrência',
  `id_responsavel` int DEFAULT NULL COMMENT 'Profissional associado (opcional)',
  `id_crime` int NOT NULL,
  `gravidade` enum('BAIXA','MEDIA','ALTA') NOT NULL,
  `status` enum('ATIVA','ARQUIVADA','COMPARTILHADA') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `visibilidade` tinyint(1) NOT NULL DEFAULT '1',
  `id_evidencia` int DEFAULT NULL,
  PRIMARY KEY (`id_ocorrencia`),
  KEY `fk_ocorrencia_usuario` (`id_usuario`),
  KEY `fk_ocorrencia_responsavel` (`id_responsavel`),
  KEY `fk_ocorrencia_crime` (`id_crime`),
  KEY `fk_evidencia` (`id_evidencia`),
  CONSTRAINT `fk_evidencia` FOREIGN KEY (`id_evidencia`) REFERENCES `tb_evidencias` (`id_evidencia`),
  CONSTRAINT `fk_ocorrencia_crime` FOREIGN KEY (`id_crime`) REFERENCES `tb_tipo_crime` (`id_crime`) ON DELETE RESTRICT,
  CONSTRAINT `fk_ocorrencia_responsavel` FOREIGN KEY (`id_responsavel`) REFERENCES `tb_usuarios` (`id_usuario`) ON DELETE SET NULL,
  CONSTRAINT `fk_ocorrencia_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `tb_usuarios` (`id_usuario`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_ocorrencias`
--

LOCK TABLES `tb_ocorrencias` WRITE;
/*!40000 ALTER TABLE `tb_ocorrencias` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_ocorrencias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_tipo_crime`
--

DROP TABLE IF EXISTS `tb_tipo_crime`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_tipo_crime` (
  `id_crime` int NOT NULL AUTO_INCREMENT,
  `nome_crime` varchar(150) NOT NULL,
  PRIMARY KEY (`id_crime`),
  UNIQUE KEY `nome_crime` (`nome_crime`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_tipo_crime`
--

LOCK TABLES `tb_tipo_crime` WRITE;
/*!40000 ALTER TABLE `tb_tipo_crime` DISABLE KEYS */;
INSERT INTO `tb_tipo_crime` VALUES (3,'          '),(1,'Atentado ao pudor'),(5,'Selecione o tipo do crime');
/*!40000 ALTER TABLE `tb_tipo_crime` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_usuarios`
--

DROP TABLE IF EXISTS `tb_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `contato` varchar(20) DEFAULT NULL,
  `documento` varchar(20) NOT NULL COMMENT 'Pode armazenar CPF ou RG',
  `tipo_usuario` enum('COMUM','PROFISSIONAL') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `documento` (`documento`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_usuarios`
--

LOCK TABLES `tb_usuarios` WRITE;
/*!40000 ALTER TABLE `tb_usuarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `vw_detalhes_ocorrencias`
--

DROP TABLE IF EXISTS `vw_detalhes_ocorrencias`;
/*!50001 DROP VIEW IF EXISTS `vw_detalhes_ocorrencias`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_detalhes_ocorrencias` AS SELECT 
 1 AS `id_ocorrencia`,
 1 AS `status`,
 1 AS `gravidade`,
 1 AS `data_criacao`,
 1 AS `nome_crime`,
 1 AS `id_criador`,
 1 AS `nome_criador`,
 1 AS `email_criador`,
 1 AS `id_responsavel`,
 1 AS `nome_responsavel`,
 1 AS `oab_responsavel`,
 1 AS `quantidade_evidencias`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_ocorrencias_sem_responsavel`
--

DROP TABLE IF EXISTS `vw_ocorrencias_sem_responsavel`;
/*!50001 DROP VIEW IF EXISTS `vw_ocorrencias_sem_responsavel`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_ocorrencias_sem_responsavel` AS SELECT 
 1 AS `id_ocorrencia`,
 1 AS `gravidade`,
 1 AS `nome_crime`,
 1 AS `nome_criador`,
 1 AS `data_abertura`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vw_profissionais_ativos`
--

DROP TABLE IF EXISTS `vw_profissionais_ativos`;
/*!50001 DROP VIEW IF EXISTS `vw_profissionais_ativos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vw_profissionais_ativos` AS SELECT 
 1 AS `id_usuario`,
 1 AS `nome`,
 1 AS `email`,
 1 AS `contato`,
 1 AS `documento`,
 1 AS `oab`,
 1 AS `documento_cnpj`,
 1 AS `data_cadastro`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `vw_detalhes_ocorrencias`
--

/*!50001 DROP VIEW IF EXISTS `vw_detalhes_ocorrencias`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_detalhes_ocorrencias` AS select `o`.`id_ocorrencia` AS `id_ocorrencia`,`o`.`status` AS `status`,`o`.`gravidade` AS `gravidade`,`o`.`created_at` AS `data_criacao`,`tc`.`nome_crime` AS `nome_crime`,`u_criador`.`id_usuario` AS `id_criador`,`u_criador`.`nome` AS `nome_criador`,`u_criador`.`email` AS `email_criador`,`u_responsavel`.`id_usuario` AS `id_responsavel`,`u_responsavel`.`nome` AS `nome_responsavel`,`dp`.`oab` AS `oab_responsavel`,(select count(0) from `tb_ocorrencia_evidencia` where (`tb_ocorrencia_evidencia`.`id_ocorrencia` = `o`.`id_ocorrencia`)) AS `quantidade_evidencias` from ((((`tb_ocorrencias` `o` join `tb_tipo_crime` `tc` on((`o`.`id_crime` = `tc`.`id_crime`))) join `tb_usuarios` `u_criador` on((`o`.`id_usuario` = `u_criador`.`id_usuario`))) left join `tb_usuarios` `u_responsavel` on((`o`.`id_responsavel` = `u_responsavel`.`id_usuario`))) left join `tb_dados_profissionais` `dp` on((`u_responsavel`.`id_usuario` = `dp`.`id_profissional`))) order by `o`.`created_at` desc */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_ocorrencias_sem_responsavel`
--

/*!50001 DROP VIEW IF EXISTS `vw_ocorrencias_sem_responsavel`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_ocorrencias_sem_responsavel` AS select `o`.`id_ocorrencia` AS `id_ocorrencia`,`o`.`gravidade` AS `gravidade`,`tc`.`nome_crime` AS `nome_crime`,`u_criador`.`nome` AS `nome_criador`,`o`.`created_at` AS `data_abertura` from ((`tb_ocorrencias` `o` join `tb_tipo_crime` `tc` on((`o`.`id_crime` = `tc`.`id_crime`))) join `tb_usuarios` `u_criador` on((`o`.`id_usuario` = `u_criador`.`id_usuario`))) where ((`o`.`status` = 'ativa') and (`o`.`id_responsavel` is null)) order by `o`.`gravidade` desc,`o`.`created_at` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vw_profissionais_ativos`
--

/*!50001 DROP VIEW IF EXISTS `vw_profissionais_ativos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vw_profissionais_ativos` AS select `u`.`id_usuario` AS `id_usuario`,`u`.`nome` AS `nome`,`u`.`email` AS `email`,`u`.`contato` AS `contato`,`u`.`documento` AS `documento`,`dp`.`oab` AS `oab`,`dp`.`documento_cnpj` AS `documento_cnpj`,`u`.`created_at` AS `data_cadastro` from (`tb_usuarios` `u` join `tb_dados_profissionais` `dp` on((`u`.`id_usuario` = `dp`.`id_profissional`))) where (`u`.`tipo_usuario` = 'profissional') */;
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

-- Dump completed on 2025-10-16 10:50:23
