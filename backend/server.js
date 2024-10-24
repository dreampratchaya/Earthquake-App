import express, { response } from "express";
import path from "path";
import mongoose from "mongoose";
import axios from "axios";
import cron from "node-cron";
import cors from "cors";
import Earthquake from "./models/earthquake.js";

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/earthquake")
  .then(() => {
    console.log("Connection open");
  })
  .catch((err) => {
    console.log(err);
  });

const fetchPastData = async (past) => {
  try {
    if (past) {
      const past30Days = new Date();
      past30Days.setDate(past30Days.getDate() - 30);
      var respond = await axios.get(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${
          past30Days.toISOString().split("T")[0]
        }&endtime=${new Date().toISOString().split("T")[0]}`
      );
    } else {
      const futureDay = new Date();
      futureDay.setDate(futureDay.getDate() + 1);
      var respond = await axios.get(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${
          new Date().toISOString().split("T")[0]
        }&endtime=${futureDay.toISOString().split("T")[0]}`
      );
    }
    if (respond.data.features.length === 0) return [];
    const eqCheck = respond.data.features.map((data) => data.properties.time);
    const existingEq = await Earthquake.find({
      "properties.time": { $in: eqCheck },
    }).lean();
    const existingEqSet = new Set(existingEq.map((t) => t.properties.time));
    const newData = respond.data.features
      .filter((data) => !existingEqSet.has(data.properties.time))
      .map((data) => ({
        ...data,
        properties: {
          ...data.properties,
          datetime: new Date(data.properties.time),
        },
      }));
    if (newData.length > 0) {
      await Earthquake.insertMany(newData);
    }
  } catch (e) {
    console.error("Error fetching earthquake data:", error);
  }
};

// fetchPastData(true);

cron.schedule("0 */7 * * *", async () => {
  console.log("Running scheduled job 30 days: Fetching earthquake data...");
  await fetchPastData(true);
});

cron.schedule("*/7 * * * *", async () => {
  console.log("Running scheduled job 1 day: Fetching earthquake data...");
  await fetchPastData(false);
});

app.use(express.json());
app.use(express.static(path.join("public")));
app.use(cors());

app.get("/api/earthquake", async (req, res) => {
  try {
    const { start, end } = req.query;
    const data = await Earthquake.find({
      "properties.datetime": {
        $gte: new Date(start).toISOString(),
        $lte: new Date(end).toISOString(),
      },
    });
    if (data.length > 0) return res.json(data);

    const respond = await axios.get(
      `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${start}&endtime=${end}`
    );
    if (respond.data.features.length === 0) return res.json([]);
    const eqCheck = respond.data.features.map((data) => data.properties.time);
    const existingEq = await Earthquake.find({
      "properties.time": { $in: eqCheck },
    }).lean();
    const existingEqSet = new Set(existingEq.map((t) => t.properties.time));
    const newData = respond.data.features
      .filter((data) => !existingEqSet.has(data.properties.time))
      .map((data) => ({
        ...data,
        properties: {
          ...data.properties,
          datetime: new Date(data.properties.time),
        },
      }));
    if (newData.length > 0) {
      await Earthquake.insertMany(newData);
    }
    const show = await Earthquake.find({
      "properties.datetime": {
        $gte: new Date(start).toISOString(),
        $lte: new Date(end).toISOString(),
      },
    });
    res.json(show);
  } catch (error) {
    res.status(500).json({ error: `Error fetching earthquake data ${error}` });
  }
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
