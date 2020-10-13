import express from "express";
import {JsonDataService} from "./service/JsonDataService";

type Data = { id: string, active: boolean };

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const port = 8080 || process.env.PORT;
const server = new JsonDataService<Data, string>("resources/db.json");


app.post("/data", (req, res) => {

  res.status(201).send(server.create(req.body));
});

app.get("/data", (req, res) => {
  res.status(200).json(server.retrieveAll());
});

app.get("/data/:dataId", (req, res) => {
  res.status(200).json(server.retrieve(req.params.dataId));
});

app.put("/data/:dataId", (req, res) => {
  if(server.update(req.params.dataId, req.body))
    res.status(200).send("Hi!");
  else
    res.status(404).send(`Data ${req.params.dataId} not found!`);
});

app.delete("/data/:dataId", (req, res) => {
  server.delete(req.params.dataId);
  res.status(200).send("Hi!");
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
