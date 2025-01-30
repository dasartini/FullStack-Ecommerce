-- Products Table
CREATE TABLE Products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock INT NOT NULL CHECK (stock >= 0),
  category_id INT NOT NULL,
  CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES Categories (id) ON DELETE CASCADE
);

-- Users Table
CREATE TABLE Users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'admin'))
);

-- Orders Table
CREATE TABLE Orders (
  id SERIAL PRIMARY KEY,
  total_price DECIMAL(10, 2) NOT NULL CHECK (total_price >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order_Items Table
CREATE TABLE Order_Items (
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  PRIMARY KEY (order_id, product_id),
  FOREIGN KEY (order_id) REFERENCES Orders (id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES Products (id) ON DELETE CASCADE
);
-- Categories Table
CREATE TABLE Categories (
  id SERIAL PRIMARY KEY,
  category_name VARCHAR(255) NOT NULL UNIQUE
);
