import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const EarthquakeSchema = new Schema({
    properties: {
        mag: Number,
        place: String,
        time: Number,
        tsunami: Number,
        datetime: Date,
    },
    geometry: Object
}, { capped: { max: 100000, size: 1024 * 1024 * 40, autoIndexId: true } })


export default mongoose.model('Earthquake', EarthquakeSchema);