DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE `departments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `department_name` varchar(250) NOT NULL,
  `over_head_costs` varchar(250) DEFAULT NULL,
  PRIMARY KEY (`id`)
) 



LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'home automation','22000'),(2,'music','12400'),(3,'sporting equipment','15220'),(4,'produce','2000'),(5,'alex\'s new department','230');

CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(250) NOT NULL,
  `department_id` int(11) DEFAULT NULL,
  `price` decimal(8,2) DEFAULT NULL,
  `stock_quantity` int(11) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY department_id (department_id),
  FOREIGN KEY (department_id), 
  REFERENCES departments (id)
);

LOCK TABLES `products` WRITE;

INSERT INTO `products` VALUES (1,'Rega P25 Turntable',2,1500.99,14),(2,'Amazon Echo',1,129.00,414),(3,'Golden Ear Triton 2 Speakers (Pair)',2,2300.99,3),(4,'Shake Weight',3,22.95,997),(5,'Vortex Power Bat',3,39.00,53),(6,'Google Nest Thermostat',1,300.00,59),(7,'Sonos Play 5 Speaker',2,369.99,134),(8,'Basketball Pump',3,15.95,21),(9,'SnapAV OVRC Pro Hub',1,200.99,4),(10,'Tycho Epoch Vinyl in Red Marble',2,17.95,200),(11,'Google Home',1,129.99,12),(12,'bananas',4,4.00,49),(13,'Alex\'s New Product',2,9.99,23);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales`
--

DROP TABLE IF EXISTS `sales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `product_id` int(11) DEFAULT NULL,
  `quantity_purchased` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `sales_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
);

--
-- Dumping data for table `sales`
--

LOCK TABLES `sales` WRITE;
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
INSERT INTO `sales` VALUES (1,2,12,'2019-02-13 19:29:41'),(2,11,2,'2019-02-14 19:44:56'),(3,3,1,'2019-02-16 16:11:56'),(4,8,18,'2019-02-16 16:12:06'),(5,11,4,'2019-02-16 16:12:19'),(6,1,8,'2019-02-16 18:03:09'),(7,5,43,'2019-02-16 18:03:35'),(8,12,75,'2019-02-16 19:38:15'),(9,8,5,'2019-02-16 20:30:46'),(10,2,40,'2019-02-16 20:30:56'),(11,7,1,'2019-02-16 20:36:57'),(12,4,3,'2019-02-16 20:39:46'),(13,2,23,'2019-02-16 20:48:11');
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;
UNLOCK TABLES;