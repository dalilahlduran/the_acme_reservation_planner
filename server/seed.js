const {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    fetchReservations,
    destroyReservation,
  } = require("./db.js");
  

  const init = async () => {
    console.log("connecting to database");
    await client.connect();
    console.log("connected to database");
  
    await createTables();
    console.log("created tables");
  
    const [moe, lucy, larry, ethyl, chilis, nobu, tgif] = await Promise.all([
      createCustomer({ name: "moe" }),
      createCustomer({ name: "lucy" }),
      createCustomer({ name: "larry" }),
      createCustomer({ name: "ethyl" }),
      createRestaurant({ name: "chilis" }),
      createRestaurant({ name: "nobu" }),
      createRestaurant({ name: "tgif" }),
    ]);
    console.log(await fetchCustomers());
    console.log(await fetchRestaurants());
  
    const [reservation, reservation2] = await Promise.all([
      createReservation({
        customer_id: moe.id,
        restaurant_id: chilis.id,
        date: "12/14/2024",
      }),
      createReservation({
        customer_id: moe.id,
        restaurant_id: tgif.id,
        date: "09/28/2024",
      }),
    ]);
    console.log(await fetchReservations());
  
    await destroyReservation({ id: reservation.id, customer_id: reservation.customer_id });
    console.log(await fetchReservations());
  
    await client.end();
  };
  
  init();