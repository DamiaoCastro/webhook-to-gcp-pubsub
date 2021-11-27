// Import express module and create an http server.
import { Request, Response } from "express";
const express = require('express');

async function startServer() {

  const appExpress = express();

  async function doStuff(request: Request, response: Response) {
    // const count = await doit();
    console.info("end1")
    response.status(200).send(`10 records written`);
  }

  // Setup an http route and a route handler.
  appExpress.post('/webhook', doStuff);

  // Start listening on the http server.
  const port = process.env.PORT || 8080;
  appExpress.listen(port, () => { console.log(`http server listening on port ${port}`); });

}

startServer();

