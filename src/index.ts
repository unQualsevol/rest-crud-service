import express from "express";
import { JsonDataService } from "./service/JsonDataService";

type Data = { id: string; active: boolean };

const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
const port = 8080 || process.env.PORT;
const server = new JsonDataService<Data, string>("resources/db.json");

app.post("/data", (req, res) => {
  const data = req.body;
  let dataId;
  try {
    dataId = server.create(data);
  } catch (e) {
    res.status(400).send(e.message);
    return;
  }
  if (dataId) {
    res.setHeader("Location", req.path + "/" + dataId);
    res.sendStatus(201);
  } else {
    res.status(409).send(`App '${dataId}' already exists!`);
  }
});

app.get("/data", (req, res) => {
  res.status(200).json(server.retrieveAll());
});

app.get("/data/:dataId", (req, res) => {
  const data = server.retrieve(req.params.dataId);
  if (data) {
    res.status(200).json(data);
  } else {
    res.status(404).send(`App '${req.params.dataId}' not found!`);
  }
});

app.put("/data/:dataId", (req, res) => {
  if (server.update(req.params.dataId, req.body)) {
    res.sendStatus(204);
  } else {
    res.status(404).send(`Data ${req.params.dataId} not found!`);
  }
});

app.delete("/data/:dataId", (req, res) => {
  if (server.delete(req.params.dataId)) {
    res.sendStatus(200);
  } else {
    res.status(404).send(`Data ${req.params.dataId} not found!`);
  }
});

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
