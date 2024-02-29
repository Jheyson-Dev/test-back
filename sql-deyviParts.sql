CREATE DATABASE db_deybiparts CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
use db_deybiparts;

CREATE TABLE categoria (
                id_categoria INT AUTO_INCREMENT NOT NULL,
                nombre_producto VARCHAR(254) NOT NULL,
                campo_medicion VARCHAR(254) NOT NULL,
                url_campo_medicion VARCHAR(255) NOT NULL,
                PRIMARY KEY (id_categoria)
);

CREATE TABLE marca_auto (
                id_marca_auto INT AUTO_INCREMENT NOT NULL,
                nombre VARCHAR(254) NOT NULL,
                img_url VARCHAR(500) NOT NULL,
                PRIMARY KEY (id_marca_auto)
);


CREATE TABLE modelo_auto (
                id_modelo_auto INT AUTO_INCREMENT NOT NULL,
                nombre VARCHAR(254) NOT NULL,
                anio_inicio VARCHAR(15) NOT NULL,
                anio_termino VARCHAR(15) NOT NULL,
                img_url VARCHAR(500) NOT NULL,
                id_marca_auto INT NOT NULL,
                PRIMARY KEY (id_modelo_auto)
);

CREATE TABLE auto (
                id_auto INT AUTO_INCREMENT NOT NULL,
                id_modelo_auto INT NOT NULL,
                placa VARCHAR(20) NOT NULL,
                PRIMARY KEY (id_auto)
);


CREATE TABLE producto (
                id_producto INT AUTO_INCREMENT NOT NULL,
                codigo_OEM VARCHAR(100) NOT NULL,
                codigo_interno VARCHAR(100) NOT NULL,
                codigo_fabricante VARCHAR(100) NOT NULL,
                origen VARCHAR(500) NOT NULL,
                marca_fabricante VARCHAR(500) NOT NULL,
                descripcion VARCHAR(500) NOT NULL,
                multiplos VARCHAR(200) NOT NULL,
                precio DOUBLE PRECISION NOT NULL,
                stock INT NOT NULL,
                oferta CHAR(2) DEFAULT 'no' CHECK (oferta IN ('no', 'si')),
                numero_consulta int DEFAULT 0,
                medida VARCHAR(254) NOT NULL,
                id_categoria INT NOT NULL,
                PRIMARY KEY (id_producto)
);


CREATE TABLE img_producto (
                id_img_producto INT AUTO_INCREMENT NOT NULL,
                id_producto INT NOT NULL,
                url VARCHAR(500) NOT NULL,
                PRIMARY KEY (id_img_producto)
);

CREATE TABLE ingreso (
                id_ingreso INT AUTO_INCREMENT NOT NULL,
                cantidad INT NOT NULL,
                fecha_hora DATETIME NOT NULL,
                id_producto INT NOT NULL,
                PRIMARY KEY (id_ingreso)
);

CREATE TABLE reemplazo (
                id_reemplazo INT AUTO_INCREMENT NOT NULL,
                id_producto INT NOT NULL,
                producto_reemplazo INT NOT NULL,
                variacion DOUBLE PRECISION NOT NULL,
                PRIMARY KEY (id_reemplazo)
);

CREATE TABLE aplicacion (
                id_aplicacion INT AUTO_INCREMENT NOT NULL,
                id_producto INT NOT NULL,
                id_modelo_auto INT NOT NULL,
                PRIMARY KEY (id_aplicacion)
);


CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT NOT NULL,
    username VARCHAR(254) NOT NULL,
    password VARCHAR(254) NOT NULL,
    rol VARCHAR(30) NOT NULL CHECK (rol IN ('administrador', 'trabajador', 'admin')),
    PRIMARY KEY (id_usuario)
);


ALTER TABLE producto ADD CONSTRAINT categoria_produco_fk
FOREIGN KEY (id_categoria)
REFERENCES categoria (id_categoria)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE modelo_auto ADD CONSTRAINT marca_auto_modelo_auto_fk
FOREIGN KEY (id_marca_auto)
REFERENCES marca_auto (id_marca_auto)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE auto ADD CONSTRAINT modelo_auto_auto_fk
FOREIGN KEY (id_modelo_auto)
REFERENCES modelo_auto (id_modelo_auto)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE aplicacion ADD CONSTRAINT modelo_auto_aplicacion_fk
FOREIGN KEY (id_modelo_auto)
REFERENCES modelo_auto (id_modelo_auto)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE aplicacion ADD CONSTRAINT producto_aplicacion_fk
FOREIGN KEY (id_producto)
REFERENCES producto (id_producto)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE reemplazo ADD CONSTRAINT producto_reemplazo_fk
FOREIGN KEY (id_producto)
REFERENCES producto (id_producto)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE reemplazo ADD CONSTRAINT producto_reemplazo_fk1
FOREIGN KEY (producto_reemplazo)
REFERENCES producto (id_producto)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE ingreso ADD CONSTRAINT producto_ingreso_fk
FOREIGN KEY (id_producto)
REFERENCES producto (id_producto)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE img_producto ADD CONSTRAINT producto_img_producto_fk
FOREIGN KEY (id_producto)
REFERENCES producto (id_producto)
ON DELETE CASCADE
ON UPDATE CASCADE;