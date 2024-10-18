import axios from "axios";

const res = await axios.get('https://nominatim.openstreetmap.org/search?format=json&q=tokyo')

console.log(res.data[0].lat)
