CREATE DATABASE db_deybiparts CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
use db_deybiparts;
CREATE TABLE proveedor (
                id_proveedor INT AUTO_INCREMENT NOT NULL,
                nombre VARCHAR(254) NOT NULL,
                telefono VARCHAR(9) NOT NULL,
                correo VARCHAR(254) NOT NULL,
                PRIMARY KEY (id_proveedor)
);


CREATE TABLE pedido (
                id_pedido INT AUTO_INCREMENT NOT NULL,
                fecha DATE NOT NULL,
                estado VARCHAR(15) NOT NULL,
                id_proveedor INT NOT NULL,
                PRIMARY KEY (id_pedido)
);


CREATE TABLE categoria (
                id_categoria INT AUTO_INCREMENT NOT NULL,
                nombre VARCHAR(254) NOT NULL,
                PRIMARY KEY (id_categoria)
);


CREATE TABLE marca_fabricante (
                id_marca_fabricante INT AUTO_INCREMENT NOT NULL,
                nombre VARCHAR(254) NOT NULL,
                PRIMARY KEY (id_marca_fabricante)
);


CREATE TABLE pais_origen (
                id_pais_origen INT AUTO_INCREMENT NOT NULL,
                nombre VARCHAR(254) NOT NULL,
                PRIMARY KEY (id_pais_origen)
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
                codigo VARCHAR(200) NOT NULL,
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


CREATE TABLE medida (
                id_medida INT AUTO_INCREMENT NOT NULL,
                nombre VARCHAR(254) NOT NULL,
                medida VARCHAR(254) NOT NULL,
                PRIMARY KEY (id_medida)
);


CREATE TABLE producto (
				nombre VARCHAR(254) NOT NULL,
                id_producto INT AUTO_INCREMENT NOT NULL,
                codigo_OEM VARCHAR(100) NOT NULL,
                codigo_interno VARCHAR(100) NOT NULL,
                codigo_fabricante VARCHAR(100) NOT NULL,
                descripcion VARCHAR(500) NOT NULL,
                multiplos VARCHAR(200) NOT NULL,
                precio DOUBLE PRECISION NOT NULL,
                id_categoria INT NOT NULL,
                id_medida INT NOT NULL,
                id_modelo_auto INT NOT NULL,
                id_pais_origen INT NOT NULL,
                id_marca_fabricante INT NOT NULL,
                PRIMARY KEY (id_producto)
);


CREATE TABLE img_producto (
                id_img_producto INT AUTO_INCREMENT NOT NULL,
                id_producto INT NOT NULL,
                url VARCHAR(500) NOT NULL,
                PRIMARY KEY (id_img_producto)
);

CREATE TABLE oferta (
                id_oferta INT AUTO_INCREMENT NOT NULL,
                id_producto INT NOT NULL,
                descuento DOUBLE PRECISION NOT NULL,
                PRIMARY KEY (id_oferta)
);

CREATE TABLE ingreso_producto (
                id_ingreso_producto INT AUTO_INCREMENT NOT NULL,
                cantidad INT NOT NULL,
                fecha_hora DATETIME NOT NULL,
                id_proveedor INT NOT NULL,
                id_producto INT NOT NULL,
                PRIMARY KEY (id_ingreso_producto)
);


CREATE TABLE detalle_pedido (
                id_detalle_pedido INT AUTO_INCREMENT NOT NULL,
                id_pedido INT NOT NULL,
                id_producto INT NOT NULL,
                cantidad INT NOT NULL,
                precio_unitario DOUBLE PRECISION NOT NULL,
                PRIMARY KEY (id_detalle_pedido)
);


CREATE TABLE reemplazo (
                id_reemplazo INT AUTO_INCREMENT NOT NULL,
                id_producto INT NOT NULL,
                cod_reemplazo VARCHAR(100) NOT NULL,
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


CREATE TABLE empresa (
                id_empresa INT AUTO_INCREMENT NOT NULL,
                nombre VARCHAR(254) NOT NULL,
                ruc VARCHAR(100) NOT NULL,
                telefono VARCHAR(9) NOT NULL,
                direccion VARCHAR(254) NOT NULL,
                PRIMARY KEY (id_empresa)
);


CREATE TABLE tienda (
                id_tienda INT AUTO_INCREMENT NOT NULL,
                nombre VARCHAR(254) NOT NULL,
                telefono VARCHAR(9) NOT NULL,
                direccion VARCHAR(254) NOT NULL,
                id_empresa INT NOT NULL,
                PRIMARY KEY (id_tienda)
);


CREATE TABLE inventario (
                id_inventario INT AUTO_INCREMENT NOT NULL,
                id_tienda INT NOT NULL,
                id_producto INT NOT NULL,
                stock INT NOT NULL,
                PRIMARY KEY (id_inventario)
);


CREATE TABLE transferencia (
                id_transferencia INT AUTO_INCREMENT NOT NULL,
                id_producto INT NOT NULL,
                tienda_origen INT NOT NULL,
                tienda_destino INT NOT NULL,
                cantidad INT NOT NULL,
                PRIMARY KEY (id_transferencia)
);


CREATE TABLE caja (
                id_caja INT AUTO_INCREMENT NOT NULL,
                saldo DOUBLE PRECISION NOT NULL,
                PRIMARY KEY (id_caja)
);


CREATE TABLE persona (
                id_persona INT AUTO_INCREMENT NOT NULL,
                nombres VARCHAR(100) NOT NULL,
                apellidos VARCHAR(100) NOT NULL,
                dni VARCHAR(8) NOT NULL,
                PRIMARY KEY (id_persona)
);


CREATE TABLE cliente (
                id_cliente INT AUTO_INCREMENT NOT NULL,
                id_persona INT NOT NULL,
                PRIMARY KEY (id_cliente)
);


CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT NOT NULL,
    correo VARCHAR(254) NOT NULL,
    username VARCHAR(254) NOT NULL,
    password VARCHAR(254) NOT NULL,
    rol VARCHAR(30) NOT NULL CHECK (rol IN ('administrador', 'trabajador', 'admin')),
    estado CHAR(1) DEFAULT '1' CHECK (estado IN ('0', '1')),
    PRIMARY KEY (id_usuario)
);


CREATE TABLE auditoria (
                id_auditoria INT AUTO_INCREMENT NOT NULL,
                id_usuario INT NOT NULL,
                accion VARCHAR(100) NOT NULL,
                detalle_accion VARCHAR(254) NOT NULL,
                fecha_hora DATETIME NOT NULL,
                ip_usuario VARCHAR(50) NOT NULL,
                PRIMARY KEY (id_auditoria)
);


CREATE TABLE trabajador (
                id_trabajador INT AUTO_INCREMENT NOT NULL,
                id_persona INT NOT NULL,
                id_caja INT NOT NULL,
                id_usuario INT NOT NULL,
                id_tienda INT NOT NULL,
                PRIMARY KEY (id_trabajador)
);


CREATE TABLE venta (
                id_venta INT AUTO_INCREMENT NOT NULL,
                id_caja INT NOT NULL,
                id_trabajador INT NOT NULL,
                id_cliente INT NOT NULL,
                fecha_hora DATETIME NOT NULL,
                descuento DOUBLE PRECISION NOT NULL,
                total DOUBLE PRECISION NOT NULL,
                PRIMARY KEY (id_venta)
);


CREATE TABLE detalle_venta (
                id_detalle_venta INT AUTO_INCREMENT NOT NULL,
                id_venta INT NOT NULL,
                id_producto INT NOT NULL,
                cantidad INT NOT NULL,
                precio_unitario DOUBLE PRECISION NOT NULL,
                PRIMARY KEY (id_detalle_venta)
);


ALTER TABLE pedido ADD CONSTRAINT proveedor_pedido_fk
FOREIGN KEY (id_proveedor)
REFERENCES proveedor (id_proveedor)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE ingreso_producto ADD CONSTRAINT proveedor_ingreso_producto_fk
FOREIGN KEY (id_proveedor)
REFERENCES proveedor (id_proveedor)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE detalle_pedido ADD CONSTRAINT pedido_detalle_pedido_fk
FOREIGN KEY (id_pedido)
REFERENCES pedido (id_pedido)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE producto ADD CONSTRAINT categoria_produco_fk
FOREIGN KEY (id_categoria)
REFERENCES categoria (id_categoria)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE producto ADD CONSTRAINT marca_fabricante_produco_fk
FOREIGN KEY (id_marca_fabricante)
REFERENCES marca_fabricante (id_marca_fabricante)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE producto ADD CONSTRAINT pais_origen_produco_fk
FOREIGN KEY (id_pais_origen)
REFERENCES pais_origen (id_pais_origen)
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

ALTER TABLE producto ADD CONSTRAINT modelo_auto_produco_fk
FOREIGN KEY (id_modelo_auto)
REFERENCES modelo_auto (id_modelo_auto)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE aplicacion ADD CONSTRAINT modelo_auto_aplicacion_fk
FOREIGN KEY (id_modelo_auto)
REFERENCES modelo_auto (id_modelo_auto)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE producto ADD CONSTRAINT medida_produco_fk
FOREIGN KEY (id_medida)
REFERENCES medida (id_medida)
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

ALTER TABLE detalle_pedido ADD CONSTRAINT producto_detalle_pedido_fk
FOREIGN KEY (id_producto)
REFERENCES producto (id_producto)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE ingreso_producto ADD CONSTRAINT producto_ingreso_producto_fk
FOREIGN KEY (id_producto)
REFERENCES producto (id_producto)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE detalle_venta ADD CONSTRAINT producto_detalle_venta_fk
FOREIGN KEY (id_producto)
REFERENCES producto (id_producto)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE img_producto ADD CONSTRAINT producto_img_producto_fk
FOREIGN KEY (id_producto)
REFERENCES producto (id_producto)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE oferta ADD CONSTRAINT producto_oferta_fk
FOREIGN KEY (id_producto)
REFERENCES producto (id_producto)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE transferencia ADD CONSTRAINT producto_transferencia_fk
FOREIGN KEY (id_producto)
REFERENCES producto (id_producto)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE inventario ADD CONSTRAINT producto_inventario_fk
FOREIGN KEY (id_producto)
REFERENCES producto (id_producto)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE tienda ADD CONSTRAINT empresa_tienda_fk
FOREIGN KEY (id_empresa)
REFERENCES empresa (id_empresa)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE transferencia ADD CONSTRAINT tienda_transferencia_fk
FOREIGN KEY (tienda_origen)
REFERENCES tienda (id_tienda)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE transferencia ADD CONSTRAINT tienda_transferencia_fk1
FOREIGN KEY (tienda_destino)
REFERENCES tienda (id_tienda)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE inventario ADD CONSTRAINT tienda_inventario_fk
FOREIGN KEY (id_tienda)
REFERENCES tienda (id_tienda)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE trabajador ADD CONSTRAINT caja_trabajador_fk
FOREIGN KEY (id_caja)
REFERENCES caja (id_caja)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE venta ADD CONSTRAINT caja_venta_fk
FOREIGN KEY (id_caja)
REFERENCES caja (id_caja)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE trabajador ADD CONSTRAINT persona_trabajador_fk
FOREIGN KEY (id_persona)
REFERENCES persona (id_persona)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE cliente ADD CONSTRAINT persona_cliente_fk
FOREIGN KEY (id_persona)
REFERENCES persona (id_persona)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE venta ADD CONSTRAINT cliente_venta_fk
FOREIGN KEY (id_cliente)
REFERENCES cliente (id_cliente)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE trabajador ADD CONSTRAINT usuario_trabajador_fk
FOREIGN KEY (id_usuario)
REFERENCES usuario (id_usuario)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE trabajador ADD CONSTRAINT tienda_trabajador_fk
FOREIGN KEY (id_tienda)
REFERENCES tienda (id_tienda)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE auditoria ADD CONSTRAINT usuario_auditoria_fk
FOREIGN KEY (id_usuario)
REFERENCES usuario (id_usuario)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE venta ADD CONSTRAINT trabajador_venta_fk
FOREIGN KEY (id_trabajador)
REFERENCES trabajador (id_trabajador)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE detalle_venta ADD CONSTRAINT venta_detalle_venta_fk
FOREIGN KEY (id_venta)
REFERENCES venta (id_venta)
ON DELETE CASCADE
ON UPDATE CASCADE;