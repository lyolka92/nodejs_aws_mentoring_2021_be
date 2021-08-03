--create tables

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
DROP TABLE IF EXISTS stocks;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
    ID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    TITLE text NOT NULL,
    DESCRIPTION text,
    PRICE int,
    SRC text
);

CREATE TABLE stocks (
    ID uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    PRODUCT_ID uuid,
	foreign key ("PRODUCT_ID") references "products" ("ID"),
	COUNT int
);

--insert table data

INSERT INTO products
    (TITLE, PRICE, SRC, DESCRIPTION)
VALUES
    ('Violet stones', '15', 'https://images-na.ssl-images-amazon.com/images/I/81GPSNYfCVL._AC_SL1500_.jpg', '12 violet rocks for painting. These rocks are about 2 inches in length. These painting rocks are triple sorted. This means you receive the perfect rocks for painting in every order. These smooth river rocks are perfect for craft projects.'),
    ('Grey stones', '24', 'https://images-na.ssl-images-amazon.com/images/I/81W%2BRih-KcL._AC_SX679_.jpg', 'Ideal for painting! Our rocks from Rock Canvas have been picked specifically for their superior quality with rock painting in mind. The rocks are smooth with no wax which makes artwork really pop! Ready to paint straight out of the bag with no buffing, washing or prep work needed.'),
    ('Pink stones', '16', 'https://images-na.ssl-images-amazon.com/images/I/81dAjA8ujAL._AC_SX679_.jpg', 'These painting rocks are triple sorted. This means you receive the perfect rocks for painting in every order. 12 Capcouriers Pink Painting River Rocks. 100% real natural rocks. These rocks range from 1.5 - 2.5 inches in length. Rocks are dusty and will need to be rinsed before use.'),
    ('Mixed stones', '5', 'https://images-na.ssl-images-amazon.com/images/I/61nF%2BZ1ofAL.jpg', 'Different sizes stones allow artists to give different personality to each creation of art. Ready to paint straight out of the bag, no prep work needed.'),
    ('Marble stones', '28', 'https://c15046624.ssl.cf2.rackcdn.com/product-hugerect-32869-5090-1337911055-bf0dfc53df227de8c29685466f812f50.jpg', 'A beautiful collection of 5 beach pebbles hand picked from spanish mediterranean shores. The stones are oval in shape and. grey, charcoal and white in colour. They also have pretty subtle stripes.'),
    ('Black river stones', '2', 'https://imgs.michaels.com/MAM/assets/1/726D45CA1C364650A39CD1B336F03305/img/C744B4E8F3E14CF2AD0295CDE18B75E3/10556691_2.jpg', 'These black river rocks by Ashland are a great addition to your home decor. You can use them as vase fillers for your flower vase or to decorate large terrariums. Place them in a tray along with candle holders to up the charm of your home decor.'),
    ('Premium white stones', '19', 'https://images-na.ssl-images-amazon.com/images/I/51UigibABXL._AC_SX679_.jpg', 'The white colour is bright and ideal for painting which means you will not need a base white coat to make your colours pop!! Our rocks from Rock Canvas have been picked specifically for their superior quality with rock painting in mind.');

INSERT INTO stocks
	(PRODUCT_ID, COUNT)
VALUES
	('96080b6f-7113-44b0-9caf-7985ba28c218', 120),
	('3fbdc92a-d1bd-4643-ae44-cb2fda6ecc1f', 100),
	('47b7eec0-cadf-461f-89a2-7cd364f65799', 100),
	('37b5f826-2c27-4625-8d9b-577358d40d2d', 100),
	('80471ded-e3f2-4acd-98e2-60afc626b881', 100),
	('e5475a3f-49ad-46f7-8c8f-371bbf7cc355', 100),
	('d27fa921-2e0f-4d7d-bf8f-8589a671d7de', 100)