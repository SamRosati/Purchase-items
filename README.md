# Purchase Items App

A simple Node.js + Express + MySQL web app for managing purchase items.

The app displays all purchase items, lets you add new items, delete items, and increase/decrease item quantities. It also shows a purchase summary with:

- total number of unique items
- total purchase cost (`sum of cost * quantity`)

This project was built for COMP 2350 (Web Database Technologies) final practical.

## Features

- View all purchase items on `/`
- Add a new purchase item
- Delete a purchase item
- Increase quantity by 1
- Decrease quantity by 1 (won't go below 0)
- Live purchase summary totals
- SQL queries use parameterized inputs to help prevent SQL injection

## Tech Stack

- Node.js
- Express
- EJS
- MySQL (`mysql2/promise`)
- Bulma (UI styling)
- Font Awesome (icons)

## Database Requirements

Create a MySQL database and add the `purchase_item` table:

```sql
CREATE TABLE purchase_item (
  purchase_item_id INT NOT NULL AUTO_INCREMENT,
  item_name VARCHAR(50) NOT NULL,
  item_description VARCHAR(500) NOT NULL,
  cost DECIMAL(10,4) NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (purchase_item_id)
);
```

## Environment Variables

Create a `.env` file in the project root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_user
DB_PASSWORD=your_password
DB_DATABASE=event_booking
PORT=3021
```

## Run Locally

```bash
npm install
npm start
```

Then open: [http://localhost:3021](http://localhost:3021)

## Deployment

This app is ready to deploy on Render (or similar Node hosting).  
Set the same environment variables in your hosting dashboard and ensure the hosted app can access your MySQL database.
