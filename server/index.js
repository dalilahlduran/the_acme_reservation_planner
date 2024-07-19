const express = require("express");
const {
  client,
  fetchCustomers,
  fetchRestaurants,
  createReservation,
  fetchReservations,
  destroyReservation,
} = require("./db.js");


const server = express();

client.connect();


server.use(express.json());


server.get("/api/customers", async (req, res, next) => {
  try {
    res.send(await fetchCustomers());
  } catch (ex) {
    next(ex);
  }
});


server.get("/api/restaurants", async (req, res, next) => {
  try {
    res.send(await fetchRestaurants());
  } catch (ex) {
    next(ex);
  }
});


server.get("/api/reservations", async (req, res, next) => {
  try {
    res.send(await fetchReservations());
  } catch (ex) {
    next(ex);
  }
});


server.post("/api/customers/:customer_id/reservations", async (req, res, next) => {
  try {
    res.status(201).send(
      await createReservation({
        customer_id: req.params.customer_id,
        place_id: req.body.place_id,
        departure_date: req.body.departure_date,
      })
    );
  } catch (ex) {
    next(ex);
  }
});


server.delete("/api/customers/:customer_id/reservations/:id", async (req, res, next) => {
  try {
    await destroyReservation({ customer_id: req.params.customer_id, id: req.params.id });
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});


server.use((err, req, res, next) => {
  res.status(err.status || 500).send({ error: err.message || err });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`listening on port ${port}`);
  console.log("some curl commands to test");
  console.log(`curl localhost:${port}/api/customers`);
  console.log(`curl localhost:${port}/api/restaurants`);
  console.log(`curl localhost:${port}/api/reservations`);
});