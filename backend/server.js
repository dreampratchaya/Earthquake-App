import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import axios from 'axios'
import cron from 'node-cron';
import cors from 'cors'
import Earthquake from './models/earthquake.js'

const app = express()

mongoose.connect('mongodb://127.0.0.1:27017/earthquake')
    .then(() => {
        console.log('Connection open')
    })
    .catch((err) => {
        console.log(err);
    })

const dbSave = async (data) => {
    let datetime = data.properties.time
    let timeFind = await Earthquake.find({ 'properties.time': datetime })
    // timFine.length = 0 -> false, !timFine.length = 0 -> true
    if (!timeFind.length || datetime !== timeFind[0].properties.time) {
        const earthquake = new Earthquake(data)
        earthquake.properties.datetime = new Date(data.properties.time)
        await earthquake.save()
    }
}

cron.schedule('*/10 * * * *', async () => {
    console.log('Running scheduled job: Fetching earthquake data...');
    try {
        const past30Days = new Date();
        past30Days.setDate(past30Days.getDate() - 30);
        const respond = await axios.get(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${past30Days.toISOString().split('T')[0]}&endtime=${new Date().toISOString().split('T')[0]}`)
        if (respond.data.features.length === 0) return []
        for (let data of respond.data.features) {
            await dbSave(data)
        }
    } catch (e) {
        console.error('Error fetching earthquake data:', error)
    }
})

app.use(express.json());
app.use(express.static(path.join('public')))
app.use(cors())

app.get('/api/earthquake', async (req, res) => {
    try {
        const { start, end } = req.query;
        const data = await Earthquake.find({ 'properties.datetime': { $gte: new Date(start).toISOString(), $lte: new Date(end).toISOString() } })
        if (data.length > 0) return res.json(data)

        const respond = await axios.get(`https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${start}&endtime=${end}`)
        if (respond.data.features.length === 0) return res.json([])
        for (let data of respond.data.features) {
            const earthquake = new Earthquake(data)
            earthquake.properties.datetime = new Date(data.properties.time)
            await earthquake.save()
        }
        const show = await Earthquake.find({ 'properties.datetime': { $gte: new Date(start).toISOString(), $lte: new Date(end).toISOString() } })
        res.json(show)
    } catch (error) {
        res.status(500).json({ error: `Error fetching earthquake data ${error}` })
    }
})



app.listen(3000, () => {
    console.log('Serving on port 3000')
})