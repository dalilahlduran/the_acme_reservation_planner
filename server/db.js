const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/acme_reservation_planner_db"
);

const createRestaurant = async ({ name }) => {
  const SQL = `INSERT INTO restaurants(id, name) VALUES($1, $2) RETURNING *;`;

  const dbResponse = await client.query(SQL, [uuid.v4(), name]);
  return dbResponse.rows[0];
};

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS reservations; 
    DROP TABLE IF EXISTS customers; 
    DROP TABLE IF EXISTS restaurants;

    CREATE TABLE customers(
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
    );
    CREATE TABLE restaurants(
         id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
    );
    CREATE TABLE reservations(
        id UUID PRIMARY KEY,
        date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        customer_id UUID REFERENCES customers(id) NOT NULL,
        restaurant_id UUID REFERENCES restaurants(id) NOT NULL
    );
    `;

  await client.query(SQL);
};

const createCustomer = async ({ name }) => {
  const SQL = `INSERT INTO customers(id, name) VALUES($1, $2) RETURNING *;`;

  const dbResponse = await client.query(SQL, [uuid.v4(), name]);
  return dbResponse.rows[0];
};

const createReservation = async ({ customer_id, restaurant_id, date }) => {
  const SQL = `INSERT INTO reservations(id, customer_id, restaurant_id, date) VALUES($1, $2, $3, $4) RETURNING *;`;


  const dbResponse = await client.query(SQL, [
    uuid.v4(),
    customer_id,
    restaurant_id,
    date,
  ]);
  return dbResponse.rows[0];
};

const destroyReservation = async ({ id, customer_id }) => {
  const SQL = `DELETE FROM reservations WHERE id=$1 AND customer_id=$2`;

  //will be response in README / Canvas
  await client.query(SQL, [id, customer_id]);
};

const fetchCustomers = async () => {
  const SQL = `SELECT * FROM customers;`;

  //will be response in README / Canvas
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
};

const fetchRestaurants = async () => {
  const SQL = `SELECT * FROM restaurants;`;


  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
};

const fetchReservations = async () => {
  const SQL = `SELECT * FROM reservations;`;


  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
};

module.exports = {
  client,
  createRestaurant,
  createTables,
  createCustomer,
  createReservation,
  destroyReservation,
  fetchCustomers, 
  fetchRestaurants,
  fetchReservations,
};