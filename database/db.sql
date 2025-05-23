-- Products Table
CREATE TABLE Products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock INT NOT NULL CHECK (stock >= 0),
  image_url TEXT,
  category_id INT NOT NULL,
  isCoffee BOOLEAN,
  details JSONB DEFAULT "{}",
  CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES Categories (id) ON DELETE CASCADE
  is_deleted BOOLEAN DEFAULT false
);

-- Users Table
CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

-- Orders Table
CREATE TABLE Orders (
  id SERIAL PRIMARY KEY,
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  payment_status VARCHAR(20) DEFAULT 'Pending', 
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  customer_name VARCHAR(100),
transaction_id VARCHAR(255);
);
--Customer Details Table
CREATE TABLE CustomerDetails (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES Orders(id) ON DELETE CASCADE, 
  address_line_1 VARCHAR(255) NOT NULL,
  address_line_2 VARCHAR(255),
  admin_area_2 VARCHAR(100),
  admin_area_1 VARCHAR(100),
  postal_code VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL
);
-- Order_Items Table
CREATE TABLE Order_Items (
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  grind VARCHAR(30) NOT NULL,
  size VARCHAR(30) NOT NULL,
  PRIMARY KEY (order_id, product_id, grind, size),
  FOREIGN KEY (order_id) REFERENCES Orders (id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES Products (id) ON DELETE CASCADE
);
-- Categories Table
CREATE TABLE Categories (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL UNIQUE
);
-- Sales Table
CREATE TABLE Sales (
  sale_id SERIAL PRIMARY KEY,   
  product_id INT NOT NULL,          
  quantity INT NOT NULL,           
  sale_date TIMESTAMP DEFAULT NOW(), 
  total_price DECIMAL(10, 2) NOT NULL,
  customer_id INT DEFAULT NULL,     
  payment_status VARCHAR(20) DEFAULT 'Pending', 
  FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE
);
-- Coffees Table
CREATE TABLE Coffees (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  region VARCHAR(255),
  altitude VARCHAR(255),
  variety VARCHAR(255),
  process VARCHAR(255),
  CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES Products (id) ON DELETE CASCADE
);