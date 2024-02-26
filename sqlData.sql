-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: db_deybiparts
-- ------------------------------------------------------
-- Server version	8.0.36

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
-- Table structure for table `aplicacion`
--

DROP TABLE IF EXISTS `aplicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aplicacion` (
  `id_aplicacion` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `id_modelo_auto` int NOT NULL,
  PRIMARY KEY (`id_aplicacion`),
  KEY `modelo_auto_aplicacion_fk` (`id_modelo_auto`),
  KEY `producto_aplicacion_fk` (`id_producto`),
  CONSTRAINT `modelo_auto_aplicacion_fk` FOREIGN KEY (`id_modelo_auto`) REFERENCES `modelo_auto` (`id_modelo_auto`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `producto_aplicacion_fk` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aplicacion`
--

LOCK TABLES `aplicacion` WRITE;
/*!40000 ALTER TABLE `aplicacion` DISABLE KEYS */;
INSERT INTO `aplicacion` VALUES (2,1,1),(3,1,4);
/*!40000 ALTER TABLE `aplicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditoria`
--

DROP TABLE IF EXISTS `auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria` (
  `id_auditoria` int NOT NULL AUTO_INCREMENT,
  `id_usuario` int NOT NULL,
  `accion` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `detalle_accion` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `ip_usuario` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_auditoria`),
  KEY `usuario_auditoria_fk` (`id_usuario`),
  CONSTRAINT `usuario_auditoria_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria`
--

LOCK TABLES `auditoria` WRITE;
/*!40000 ALTER TABLE `auditoria` DISABLE KEYS */;
INSERT INTO `auditoria` VALUES (1,1,'POST','/api/personas','2024-02-23 12:11:32','::1'),(2,1,'POST','/api/cajas','2024-02-23 12:11:39','::1'),(3,1,'POST','/api/trabajadores','2024-02-23 12:11:46','::1'),(4,1,'POST','/api/empresas','2024-02-23 12:12:53','::1'),(5,1,'POST','/api/tiendas','2024-02-23 12:12:57','::1'),(6,1,'POST','/api/trabajadores','2024-02-23 12:13:01','::1'),(7,1,'POST','/api/proveedores','2024-02-23 12:13:07','::1'),(8,1,'POST','/api/pedidos','2024-02-23 12:13:13','::1'),(9,1,'POST','/api/marca-autos','2024-02-23 12:13:18','::1'),(10,1,'POST','/api/modelo-autos','2024-02-23 12:13:23','::1'),(11,1,'POST','/api/autos','2024-02-23 12:13:28','::1'),(12,1,'POST','/api/medidas','2024-02-23 12:13:34','::1'),(13,1,'POST','/api/categorias','2024-02-23 12:13:41','::1'),(14,1,'POST','/api/pais-origenes','2024-02-23 12:13:48','::1'),(15,1,'POST','/api/marca-fabricantes','2024-02-23 12:13:52','::1'),(16,1,'POST','/api/productos','2024-02-23 12:13:58','::1'),(17,1,'POST','/api/aplicaciones','2024-02-23 12:14:03','::1'),(18,1,'POST','/api/aplicaciones','2024-02-23 12:14:24','::1'),(19,1,'POST','/api/img-productos','2024-02-23 12:14:31','::1'),(20,1,'POST','/api/ofertas','2024-02-23 12:14:43','::1'),(21,1,'POST','/api/reemplazos','2024-02-23 12:14:52','::1'),(22,1,'POST','/api/transferencias','2024-02-23 12:14:57','::1'),(23,1,'POST','/api/inventarios','2024-02-23 12:15:10','::1'),(24,1,'POST','/api/ingreso-productos','2024-02-23 12:15:16','::1'),(25,1,'POST','/api/detalle-pedidos','2024-02-23 12:15:21','::1'),(26,1,'POST','/api/personas','2024-02-23 12:37:11','::1'),(27,1,'POST','/api/tiendas','2024-02-23 12:37:28','::1'),(28,1,'POST','/api/cajas','2024-02-23 12:37:37','::1'),(29,1,'POST','/api/trabajadores','2024-02-23 12:37:55','::1'),(30,2,'POST','/api/productos','2024-02-23 12:41:13','::1'),(31,2,'POST','/api/inventarios','2024-02-23 12:41:41','::1'),(32,1,'POST','/api/marca-autos','2024-02-23 13:55:17','::1'),(33,1,'POST','/api/modelo-autos','2024-02-23 13:56:30','::1'),(34,1,'PUT','/api/productos/1','2024-02-23 13:57:18','::1'),(35,1,'POST','/api/modelo-autos','2024-02-23 14:04:28','::1'),(36,1,'POST','/api/productos','2024-02-23 14:05:05','::1'),(37,1,'POST','/api/marca-autos','2024-02-23 14:06:41','::1'),(38,1,'POST','/api/modelo-autos','2024-02-23 14:06:51','::1'),(39,1,'POST','/api/productos','2024-02-23 14:07:25','::1'),(40,1,'POST','/api/inventarios','2024-02-23 14:08:53','::1'),(41,1,'POST','/api/inventarios','2024-02-23 14:09:00','::1'),(42,1,'POST','/api/inventarios','2024-02-23 14:11:19','::1'),(43,1,'POST','/api/reemplazos','2024-02-23 14:26:25','::1'),(44,1,'POST','/api/reemplazos','2024-02-23 14:26:45','::1'),(45,1,'POST','/api/reemplazos','2024-02-23 14:26:58','::1'),(46,1,'POST','/api/reemplazos','2024-02-23 14:27:08','::1'),(47,1,'POST','/api/reemplazos','2024-02-23 14:50:03','::1'),(48,1,'POST','/api/aplicaciones','2024-02-23 15:10:30','::1'),(49,1,'POST','/api/medidas','2024-02-23 17:12:50','::1'),(50,1,'PUT','/api/productos/2','2024-02-23 17:13:18','::1'),(51,1,'PUT','/api/productos/2','2024-02-23 17:13:40','::1'),(52,1,'PUT','/api/marca-autos/1','2024-02-23 17:33:47','::1'),(53,1,'PUT','/api/marca-autos/2','2024-02-23 17:34:15','::1'),(54,1,'PUT','/api/marca-autos/3','2024-02-23 17:34:29','::1');
/*!40000 ALTER TABLE `auditoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auto`
--

DROP TABLE IF EXISTS `auto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auto` (
  `id_auto` int NOT NULL AUTO_INCREMENT,
  `id_modelo_auto` int NOT NULL,
  `placa` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_auto`),
  KEY `modelo_auto_auto_fk` (`id_modelo_auto`),
  CONSTRAINT `modelo_auto_auto_fk` FOREIGN KEY (`id_modelo_auto`) REFERENCES `modelo_auto` (`id_modelo_auto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auto`
--

LOCK TABLES `auto` WRITE;
/*!40000 ALTER TABLE `auto` DISABLE KEYS */;
INSERT INTO `auto` VALUES (1,1,'13ZF43T2');
/*!40000 ALTER TABLE `auto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `caja`
--

DROP TABLE IF EXISTS `caja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `caja` (
  `id_caja` int NOT NULL AUTO_INCREMENT,
  `saldo` double NOT NULL,
  PRIMARY KEY (`id_caja`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `caja`
--

LOCK TABLES `caja` WRITE;
/*!40000 ALTER TABLE `caja` DISABLE KEYS */;
INSERT INTO `caja` VALUES (1,592.5),(2,562.5);
/*!40000 ALTER TABLE `caja` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `id_categoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_categoria`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'repuesto');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `id_persona` int NOT NULL,
  PRIMARY KEY (`id_cliente`),
  KEY `persona_cliente_fk` (`id_persona`),
  CONSTRAINT `persona_cliente_fk` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_pedido`
--

DROP TABLE IF EXISTS `detalle_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_pedido` (
  `id_detalle_pedido` int NOT NULL AUTO_INCREMENT,
  `id_pedido` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` double NOT NULL,
  PRIMARY KEY (`id_detalle_pedido`),
  KEY `pedido_detalle_pedido_fk` (`id_pedido`),
  KEY `producto_detalle_pedido_fk` (`id_producto`),
  CONSTRAINT `pedido_detalle_pedido_fk` FOREIGN KEY (`id_pedido`) REFERENCES `pedido` (`id_pedido`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `producto_detalle_pedido_fk` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_pedido`
--

LOCK TABLES `detalle_pedido` WRITE;
/*!40000 ALTER TABLE `detalle_pedido` DISABLE KEYS */;
INSERT INTO `detalle_pedido` VALUES (1,1,1,20,12.5);
/*!40000 ALTER TABLE `detalle_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_venta`
--

DROP TABLE IF EXISTS `detalle_venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_venta` (
  `id_detalle_venta` int NOT NULL AUTO_INCREMENT,
  `id_venta` int NOT NULL,
  `id_producto` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio_unitario` double NOT NULL,
  PRIMARY KEY (`id_detalle_venta`),
  KEY `producto_detalle_venta_fk` (`id_producto`),
  KEY `venta_detalle_venta_fk` (`id_venta`),
  CONSTRAINT `producto_detalle_venta_fk` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `venta_detalle_venta_fk` FOREIGN KEY (`id_venta`) REFERENCES `venta` (`id_venta`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_venta`
--

LOCK TABLES `detalle_venta` WRITE;
/*!40000 ALTER TABLE `detalle_venta` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalle_venta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empresa`
--

DROP TABLE IF EXISTS `empresa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empresa` (
  `id_empresa` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ruc` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_empresa`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empresa`
--

LOCK TABLES `empresa` WRITE;
/*!40000 ALTER TABLE `empresa` DISABLE KEYS */;
INSERT INTO `empresa` VALUES (1,'Detbi Motors','112321321-213213','12345678','Jr. Jauregui n°567');
/*!40000 ALTER TABLE `empresa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `img_producto`
--

DROP TABLE IF EXISTS `img_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `img_producto` (
  `id_img_producto` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_img_producto`),
  KEY `producto_img_producto_fk` (`id_producto`),
  CONSTRAINT `producto_img_producto_fk` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `img_producto`
--

LOCK TABLES `img_producto` WRITE;
/*!40000 ALTER TABLE `img_producto` DISABLE KEYS */;
INSERT INTO `img_producto` VALUES (1,1,'https://allracingperu.pe/cdn/shop/products/Sintitulo-1_b5b7d323-a922-48c5-aa07-a2c83cd4d1b8.png?v=1637447504');
/*!40000 ALTER TABLE `img_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingreso_producto`
--

DROP TABLE IF EXISTS `ingreso_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingreso_producto` (
  `id_ingreso_producto` int NOT NULL AUTO_INCREMENT,
  `cantidad` int NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `id_proveedor` int NOT NULL,
  `id_producto` int NOT NULL,
  PRIMARY KEY (`id_ingreso_producto`),
  KEY `proveedor_ingreso_producto_fk` (`id_proveedor`),
  KEY `producto_ingreso_producto_fk` (`id_producto`),
  CONSTRAINT `producto_ingreso_producto_fk` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `proveedor_ingreso_producto_fk` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingreso_producto`
--

LOCK TABLES `ingreso_producto` WRITE;
/*!40000 ALTER TABLE `ingreso_producto` DISABLE KEYS */;
INSERT INTO `ingreso_producto` VALUES (1,30,'2023-12-12 14:30:00',1,1);
/*!40000 ALTER TABLE `ingreso_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario` (
  `id_inventario` int NOT NULL AUTO_INCREMENT,
  `id_tienda` int NOT NULL,
  `id_producto` int NOT NULL,
  `stock` int NOT NULL,
  PRIMARY KEY (`id_inventario`),
  KEY `producto_inventario_fk` (`id_producto`),
  KEY `tienda_inventario_fk` (`id_tienda`),
  CONSTRAINT `producto_inventario_fk` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tienda_inventario_fk` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventario`
--

LOCK TABLES `inventario` WRITE;
/*!40000 ALTER TABLE `inventario` DISABLE KEYS */;
INSERT INTO `inventario` VALUES (1,1,1,10),(2,2,2,20),(3,1,3,40),(4,1,4,26),(5,2,3,43);
/*!40000 ALTER TABLE `inventario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marca_auto`
--

DROP TABLE IF EXISTS `marca_auto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marca_auto` (
  `id_marca_auto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `img_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_marca_auto`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marca_auto`
--

LOCK TABLES `marca_auto` WRITE;
/*!40000 ALTER TABLE `marca_auto` DISABLE KEYS */;
INSERT INTO `marca_auto` VALUES (1,'hiundai','https://upload.wikimedia.org/wikipedia/commons/3/3c/Subaru_%282019%29.svg'),(2,'Subaru','https://upload.wikimedia.org/wikipedia/commons/3/3c/Subaru_%282019%29.svg'),(3,'Ima','https://upload.wikimedia.org/wikipedia/commons/3/3c/Subaru_%282019%29.svg');
/*!40000 ALTER TABLE `marca_auto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `marca_fabricante`
--

DROP TABLE IF EXISTS `marca_fabricante`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `marca_fabricante` (
  `id_marca_fabricante` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_marca_fabricante`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `marca_fabricante`
--

LOCK TABLES `marca_fabricante` WRITE;
/*!40000 ALTER TABLE `marca_fabricante` DISABLE KEYS */;
INSERT INTO `marca_fabricante` VALUES (1,'Corolla');
/*!40000 ALTER TABLE `marca_fabricante` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medida`
--

DROP TABLE IF EXISTS `medida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medida` (
  `id_medida` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `medida` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_medida`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medida`
--

LOCK TABLES `medida` WRITE;
/*!40000 ALTER TABLE `medida` DISABLE KEYS */;
INSERT INTO `medida` VALUES (1,'centimetros','10 x 20'),(2,'centimetros','17 x 25 x 19 x 23');
/*!40000 ALTER TABLE `medida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modelo_auto`
--

DROP TABLE IF EXISTS `modelo_auto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modelo_auto` (
  `id_modelo_auto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `anio_inicio` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `anio_termino` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_marca_auto` int NOT NULL,
  `img_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_modelo_auto`),
  KEY `marca_auto_modelo_auto_fk` (`id_marca_auto`),
  CONSTRAINT `marca_auto_modelo_auto_fk` FOREIGN KEY (`id_marca_auto`) REFERENCES `marca_auto` (`id_marca_auto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modelo_auto`
--

LOCK TABLES `modelo_auto` WRITE;
/*!40000 ALTER TABLE `modelo_auto` DISABLE KEYS */;
INSERT INTO `modelo_auto` VALUES (1,'i10','h-323-ht-2','2014-12-12','2015-12-12',1,''),(2,'Alp','h-323-ht-2','2014-12-12','2015-12-12',2,''),(3,'Eda','h-323-ht-2','2014-12-12','2015-12-12',2,''),(4,'Eda','h-323-ht-2','2014-12-12','2015-12-12',3,'');
/*!40000 ALTER TABLE `modelo_auto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oferta`
--

DROP TABLE IF EXISTS `oferta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oferta` (
  `id_oferta` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `descuento` double NOT NULL,
  PRIMARY KEY (`id_oferta`),
  KEY `producto_oferta_fk` (`id_producto`),
  CONSTRAINT `producto_oferta_fk` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oferta`
--

LOCK TABLES `oferta` WRITE;
/*!40000 ALTER TABLE `oferta` DISABLE KEYS */;
INSERT INTO `oferta` VALUES (1,1,5);
/*!40000 ALTER TABLE `oferta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pais_origen`
--

DROP TABLE IF EXISTS `pais_origen`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pais_origen` (
  `id_pais_origen` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_pais_origen`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pais_origen`
--

LOCK TABLES `pais_origen` WRITE;
/*!40000 ALTER TABLE `pais_origen` DISABLE KEYS */;
INSERT INTO `pais_origen` VALUES (1,'Japon');
/*!40000 ALTER TABLE `pais_origen` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `id_pedido` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `estado` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_proveedor` int NOT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `proveedor_pedido_fk` (`id_proveedor`),
  CONSTRAINT `proveedor_pedido_fk` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedor` (`id_proveedor`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
INSERT INTO `pedido` VALUES (1,'2023-12-12','pendiente',1);
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persona`
--

DROP TABLE IF EXISTS `persona`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `persona` (
  `id_persona` int NOT NULL AUTO_INCREMENT,
  `nombres` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellidos` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dni` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_persona`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persona`
--

LOCK TABLES `persona` WRITE;
/*!40000 ALTER TABLE `persona` DISABLE KEYS */;
INSERT INTO `persona` VALUES (1,'Lian Lythor','calla','1333438'),(2,'Lian Lythor1','calla1','1333438');
/*!40000 ALTER TABLE `persona` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `nombre` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_producto` int NOT NULL AUTO_INCREMENT,
  `codigo_OEM` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_interno` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `codigo_fabricante` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `multiplos` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `precio` double NOT NULL,
  `id_categoria` int NOT NULL,
  `id_medida` int NOT NULL,
  `id_modelo_auto` int NOT NULL,
  `id_pais_origen` int NOT NULL,
  `id_marca_fabricante` int NOT NULL,
  PRIMARY KEY (`id_producto`),
  KEY `categoria_produco_fk` (`id_categoria`),
  KEY `marca_fabricante_produco_fk` (`id_marca_fabricante`),
  KEY `pais_origen_produco_fk` (`id_pais_origen`),
  KEY `modelo_auto_produco_fk` (`id_modelo_auto`),
  KEY `medida_produco_fk` (`id_medida`),
  CONSTRAINT `categoria_produco_fk` FOREIGN KEY (`id_categoria`) REFERENCES `categoria` (`id_categoria`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `marca_fabricante_produco_fk` FOREIGN KEY (`id_marca_fabricante`) REFERENCES `marca_fabricante` (`id_marca_fabricante`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `medida_produco_fk` FOREIGN KEY (`id_medida`) REFERENCES `medida` (`id_medida`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `modelo_auto_produco_fk` FOREIGN KEY (`id_modelo_auto`) REFERENCES `modelo_auto` (`id_modelo_auto`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `pais_origen_produco_fk` FOREIGN KEY (`id_pais_origen`) REFERENCES `pais_origen` (`id_pais_origen`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES ('piston',1,'994343-3243232-a','2024-12-02-000211','2132-2121-121-21','filtro de aceite para todo tipo de vehiculos','no se que va aqui',4445.5,1,1,2,1,1),('Filtro Aceite',2,'994343-3243232-a','2024-12-02-000211','2132-2121-121-21','filtro de aceite para todo tipo de vehiculos','no se que va aqui',55.5,1,2,1,1,1),('llanta',3,'232343-324323224-a','p545-dfds','2132-2121-121-21','llanta','no se que va aqui',106.5,1,1,3,1,1),('Correa',4,'232343-324323224-a','p545-dfds','2132-2121-121-21','correa','no se que va aqui',156.5,1,1,4,1,1);
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedor`
--

DROP TABLE IF EXISTS `proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedor` (
  `id_proveedor` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_proveedor`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedor`
--

LOCK TABLES `proveedor` WRITE;
/*!40000 ALTER TABLE `proveedor` DISABLE KEYS */;
INSERT INTO `proveedor` VALUES (1,'proveedores SAC','921223233','proveedores@gmail.com');
/*!40000 ALTER TABLE `proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reemplazo`
--

DROP TABLE IF EXISTS `reemplazo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reemplazo` (
  `id_reemplazo` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `cod_reemplazo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `producto_reemplazo` int NOT NULL,
  `variacion` double NOT NULL,
  PRIMARY KEY (`id_reemplazo`),
  KEY `producto_reemplazo_fk` (`id_producto`),
  KEY `producto_reemplazo_fk1` (`producto_reemplazo`),
  CONSTRAINT `producto_reemplazo_fk` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `producto_reemplazo_fk1` FOREIGN KEY (`producto_reemplazo`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reemplazo`
--

LOCK TABLES `reemplazo` WRITE;
/*!40000 ALTER TABLE `reemplazo` DISABLE KEYS */;
INSERT INTO `reemplazo` VALUES (1,1,'212-2123-123',1,0.1),(2,1,'0012212',2,0.15),(3,2,'0012212',1,0.4),(4,4,'0012212',3,0.2),(5,3,'0012212',1,0.8),(6,1,'0012212',4,0.8);
/*!40000 ALTER TABLE `reemplazo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tienda`
--

DROP TABLE IF EXISTS `tienda`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tienda` (
  `id_tienda` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(9) COLLATE utf8mb4_unicode_ci NOT NULL,
  `direccion` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `id_empresa` int NOT NULL,
  PRIMARY KEY (`id_tienda`),
  KEY `empresa_tienda_fk` (`id_empresa`),
  CONSTRAINT `empresa_tienda_fk` FOREIGN KEY (`id_empresa`) REFERENCES `empresa` (`id_empresa`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tienda`
--

LOCK TABLES `tienda` WRITE;
/*!40000 ALTER TABLE `tienda` DISABLE KEYS */;
INSERT INTO `tienda` VALUES (1,'DeyviMotors J1','923234333','Jr. la Mar N° 456',1),(2,'DeyviMotors E2','923234333','Jr. la Mar N° 456',1);
/*!40000 ALTER TABLE `tienda` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `trabajador`
--

DROP TABLE IF EXISTS `trabajador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trabajador` (
  `id_trabajador` int NOT NULL AUTO_INCREMENT,
  `id_persona` int NOT NULL,
  `id_caja` int NOT NULL,
  `id_usuario` int NOT NULL,
  `id_tienda` int NOT NULL,
  PRIMARY KEY (`id_trabajador`),
  KEY `caja_trabajador_fk` (`id_caja`),
  KEY `persona_trabajador_fk` (`id_persona`),
  KEY `usuario_trabajador_fk` (`id_usuario`),
  KEY `tienda_trabajador_fk` (`id_tienda`),
  CONSTRAINT `caja_trabajador_fk` FOREIGN KEY (`id_caja`) REFERENCES `caja` (`id_caja`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `persona_trabajador_fk` FOREIGN KEY (`id_persona`) REFERENCES `persona` (`id_persona`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tienda_trabajador_fk` FOREIGN KEY (`id_tienda`) REFERENCES `tienda` (`id_tienda`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `usuario_trabajador_fk` FOREIGN KEY (`id_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `trabajador`
--

LOCK TABLES `trabajador` WRITE;
/*!40000 ALTER TABLE `trabajador` DISABLE KEYS */;
INSERT INTO `trabajador` VALUES (2,1,1,1,1),(3,2,2,2,2);
/*!40000 ALTER TABLE `trabajador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transferencia`
--

DROP TABLE IF EXISTS `transferencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transferencia` (
  `id_transferencia` int NOT NULL AUTO_INCREMENT,
  `id_producto` int NOT NULL,
  `tienda_origen` int NOT NULL,
  `tienda_destino` int NOT NULL,
  `cantidad` int NOT NULL,
  PRIMARY KEY (`id_transferencia`),
  KEY `producto_transferencia_fk` (`id_producto`),
  KEY `tienda_transferencia_fk` (`tienda_origen`),
  KEY `tienda_transferencia_fk1` (`tienda_destino`),
  CONSTRAINT `producto_transferencia_fk` FOREIGN KEY (`id_producto`) REFERENCES `producto` (`id_producto`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tienda_transferencia_fk` FOREIGN KEY (`tienda_origen`) REFERENCES `tienda` (`id_tienda`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tienda_transferencia_fk1` FOREIGN KEY (`tienda_destino`) REFERENCES `tienda` (`id_tienda`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transferencia`
--

LOCK TABLES `transferencia` WRITE;
/*!40000 ALTER TABLE `transferencia` DISABLE KEYS */;
INSERT INTO `transferencia` VALUES (1,1,1,1,5);
/*!40000 ALTER TABLE `transferencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `correo` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(254) COLLATE utf8mb4_unicode_ci NOT NULL,
  `rol` varchar(30) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` char(1) COLLATE utf8mb4_unicode_ci DEFAULT '1',
  PRIMARY KEY (`id_usuario`),
  CONSTRAINT `usuario_chk_1` CHECK ((`rol` in (_utf8mb4'administrador',_utf8mb4'trabajador',_utf8mb4'admin'))),
  CONSTRAINT `usuario_chk_2` CHECK ((`estado` in (_utf8mb4'0',_utf8mb4'1')))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'admin@gmail.com','admin','$2b$10$uivAqAFAdTObmozKRNGcpOINlu3FUGlI0tMfAjyxySh01jv5VcAmG','administrador','1'),(2,'admin1@gmail.com','admin1','$2b$10$oTOvPJvm.nfK8JGwylRaJOA0nvemVzjA8Cw5bde97t3XguOhXplyS','administrador','1');
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venta`
--

DROP TABLE IF EXISTS `venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venta` (
  `id_venta` int NOT NULL AUTO_INCREMENT,
  `id_caja` int NOT NULL,
  `id_trabajador` int NOT NULL,
  `id_cliente` int NOT NULL,
  `fecha_hora` datetime NOT NULL,
  `descuento` double NOT NULL,
  `total` double NOT NULL,
  PRIMARY KEY (`id_venta`),
  KEY `caja_venta_fk` (`id_caja`),
  KEY `cliente_venta_fk` (`id_cliente`),
  KEY `trabajador_venta_fk` (`id_trabajador`),
  CONSTRAINT `caja_venta_fk` FOREIGN KEY (`id_caja`) REFERENCES `caja` (`id_caja`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `cliente_venta_fk` FOREIGN KEY (`id_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `trabajador_venta_fk` FOREIGN KEY (`id_trabajador`) REFERENCES `trabajador` (`id_trabajador`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venta`
--

LOCK TABLES `venta` WRITE;
/*!40000 ALTER TABLE `venta` DISABLE KEYS */;
/*!40000 ALTER TABLE `venta` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-02-26 18:31:34
