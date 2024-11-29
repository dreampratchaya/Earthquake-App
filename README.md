# Earthquake Web App

เว็บแอปพลิเคชันแบบ real-time ที่จะแสดงข้อมูลแผ่นดินไหวและข้อมูลสำคัญอีกหลายอย่าง เช่น สึนามิ บนแผนที่แบบ interactive รวมถึงสามารถดูข้อมูลย้อนหลังในแต่ละวันได้
<img src="./backend/public/USGS Earthquake API.png" width="800" height="370" alt="" />

## Table of Contents

- [Development Principles](#development-principles)
- [Important APIs](#important-apis)
- [Deployment Methods](#deployment-methods)
- [Technologies Used](#technologies-used)
- [License](#license)

---

## Development Principles

1. **User-Centric Design**:

   - User จะได้รับประสบการณ์การใช้งานที่ราบรื่นด้วยด้วย UI จาก React และแผนที่จาก Leaflet ทำให้ user สามารถเข้าถึงข้อมูลสำคัญของแผนดินไหวได้ง่าย เช่น แผนดินไหวเกิดที่ไหน เกิดเวลาเท่าไร มีแจ้งเตือนสึนามิหรือไม่

2. **Performance Optimization**:

   - ใช้ bun ในการการประมวลผลฝั่ง server เพื่อเพิ่มความเร็วและลด latency ในการตอบโต้กับ user
   - ใช้วิธีการเก็บข้อมูลลง database แบบ batch data operations (insertMany) เพื่อเพิ่มประสิทธิภาพในการเขียนข้อมูลลงใน MongoDB

3. **Scalability and Maintainability**:

   - แบ่งส่วนต่างๆ เป็น components เพื่อให้สามารถนำกลับมาใช้ใหม่ได้
   - ใช้ Mongoose กับ MongoDB เพื่อให้ข้อมูลที่เข้าสู่ database มี pattern และ type ที่ถูกต้อง

4. **Real-Time Data Updates**:

   - ดึงและแสดงข้อมูลแผ่นดินไหวใกล้เคียง real-time โดยการใช้ `useEffect` ใน React ในการเรียก API

5. **Leveraging React-Leaflet for Mapping**
   - **How React-Leaflet Works**: React-Leaflet เป็น library ที่ทำให้เราสามารถเรียกใช้ library Leaflet ในรูปแบบ components ของ React ได้ โดย Leaflet เป็น library ที่แสดง map จาก OpenStreetMap ซึ่งเป็น open source มาแสดงผลได้ ฟีเจอร์ของ Leaflet อย่าง `<MapContainer>` จะเป็นตัวกำหนดว่า map จะแสดงผลตรงไหน และ `<Marker>` จะให้เราสามารถนำ marker ไปไว้จุดที่เราต้องการบน map ได้ รวมถึงเมื่อใช้ร่วมกับ `CustomIcon` จะทำให้เราสามารถออกแบบ marker ได้เองโดยใช้ css หรือ svg
   - **Advantages**:
     - _Declarative Mapping_: React-Leaflet ช่วยให้สามารถจัดการกับ map ได้ง่ายขึ้น รวมถึงเมื่อมีข้อมูลใหม่หรือมีการเปลี่ยนแปลงเข้ามาตัว map ก็จะ update ตัวเองได้ทันที ทำให้ user รู้สึกลื่นไหลในการใช้งาน
     - _Customization_: สามารถกำหนด จัดการและตกแต่ง Marker ได้อย่างอิสระเพื่อให้ Marker มีความหลากหลายและเพิ่มประสบการณ์ใช้งานของ user ขึ้น
   - **Development Approach**:
     - `<MapContainer>` จะเป็น layer ที่เป็นข้อมูลพื้นฐานที่แผนที่ควรมี
     - `<Marker>` และ `<Popup>` จะแสดงข้อมูลสถานที่เกิดแผ่นดินไหวในรูปแบบของ วงกลมและมีคลื่นล้อมรอบ ในตำแหน่งที่เกิดแผ่นดินไหว โดย วงกลมและคลื่นล้อมรอบ จะแตกต่างกันไปตามขนาดความรุนแรงของแผ่นดินไหว และเมื่อ click ที่จุดที่เกิดแผ่นดินไหวก็จะแสดงข้อมูลของแผ่นดินไหวทั้งหมด

---

## Important APIs

1. **USGS Earthquake API**

   - ดึงข้อมูลแผ่นดินไหว, สถานที่, ความรุนแรง, ความลึก และ ช่วงเวลาแบบ real-time จาก USGS Earthquake API (สำนักสำรวจธรณีวิทยาสหรัฐอเมริกา)
   - **URL**: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&endtime=2024-01-02`
   - **Example Response**

   ```json
   "features": [
        {
            "type": "Feature",
            "properties": {
                "mag": 4.9,
                "place": "191 km ESE of Ust’-Kamchatsk Staryy, Russia",
                "time": 1731369384328,
                "updated": 1731370895040,
                "tz": null,
                "url": "https://earthquake.usgs.gov/earthquakes/eventpage/us7000nra5",
                "detail": "https://earthquake.usgs.gov/fdsnws/event/1/query?eventid=us7000nra5&format=geojson",
                "felt": null,
                "cdi": null,
                "mmi": null,
                "alert": null,
                "status": "reviewed",
                "tsunami": 0,
                "sig": 369,
                "net": "us",
                "code": "7000nra5",
                "ids": ",usauto7000nra5,us7000nra5,",
                "sources": ",usauto,us,",
                "types": ",internal-moment-tensor,origin,phase-data,",
                "nst": 86,
                "dmin": 4.818,
                "rms": 1.08,
                "gap": 100,
                "magType": "mb",
                "type": "earthquake",
                "title": "M 4.9 - 191 km ESE of Ust’-Kamchatsk Staryy, Russia"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    165.4283,
                    55.7619,
                    10
                ]
            },
            "id": "us7000nra5"
        }
    ],
   ```

   - **Response Fields**
   - `features`: รายการเหตุการณ์แผ่นดินไหว
     - `type`: Always `"Feature"`.
     - `properties`: ลายละเอียดข้อมูลแผ่นดินไหว
       - `mag`: ขนาดของแผ่นดินไหว
       - `place`: คำอธิบายสถานที่
       - `time`: Timestamp ของแผ่นดินไหว (milliseconds)
       - `updated`: Timestamp ที่ update ล่าสุด
       - `url`: Link สำหรับข้อมูลเพิ่มเติม
       - `tsunami`: แผ่นดินไหวทำให้เกิดสึนามิหรือไม่ (`1` for yes, `0` for no)
     - `geometry`: ข้อมูลทางภูมิศาสตร์ของแผ่นดินไหว (`geojson`)
       - `type`: Always `"Point"`.
       - `coordinates`: Longitude, latitude, and depth (kilometers).
     - `id`: Unique identifier for the event.

2. **Basemaps API**

   - เป็น API สำหรับดึง map tiles ในรูปแบบ PNG สำหรับ Leaflet
   - **URL**: _Dark-Mode_: `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png`, _Light-Mode_: `https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png`
   - **URL Parameters**
     | Parameter | Description |
     |-------------|------------------------------------------------------------------|
     | `{s}` | Subdomain สำหรับ load balancing. Options: `a`, `b`, `c`, `d`. |
     | `{z}` | Zoom level (integer). แสดงถึงขนาดการซูมของแผนที่ |
     | `{x}` | Tile column number (integer). แสดงถึงตำแหน่งแนวนอน|
     | `{y}` | Tile row number (integer). แสดงถึงตำแหน่งแนวตั้ง |
     | `{r}` | Optional retina indicator. ใช้ `@2x` สำหรับ high-DPI tiles (e.g., Retina displays). เว้นว่างไว้สำหรับ standard tiles. |
   - **Example Respond**<br>
     <img src="https://a.basemaps.cartocdn.com/dark_all/3/4/2@2x.png" alt="Map" width="200" height="200" />

3. **Local MongoDB via Docker**
   - ส่ง GET Request ไปที่ `/api/earthquake` โดย query ด้วย `start` และ `end`
   - backend จะทำการ query ใน MongoDB และตอบกลับในรูป `geojson`

---

## Deployment Methods

### Docker Multi-Stage Build Explained

1. **Frontend (Vite Build)**  
   frontend จะใช้วิธี Vite build เพื่อทำการเปลี่ยนจาก tsx เป็น js ปกติเพื่อให้ browser ทั่วไปสามารถเข้าใจได้ :

   - ทำการ copyไฟล์ package.json ( และ package-lock.json หรือ bun.lockb ถ้ามี) และ ทำการติดตั้ง dependencies โดยเหตุผลที่ไม่ทำการ copy ไฟล์ทั้งหมดแล้วติดตั้ง dependencies เพราะ Docker จะทำ layer caching เมื่อไฟล์เปลี่ยนแปลงไป วิธีนี้จะเป็นการ optimize Docker layer caching ซึ่งทำให้ สามารถ build ได้เร็วขึ้นอย่างมีนัยสําคัญ

   **Dockerfile Excerpt for Frontend Build**:

   ```dockerfile
   # Stage 1: Build the Vite frontend
   FROM oven/bun AS frontend-builder

   WORKDIR /app/frontend

   # Install frontend dependencies
   COPY frontend/package.json ./
   RUN bun install

   # Copy all frontend files and build the static files
   COPY frontend/ .
   RUN bun run build
   ```

   หลังจากทำการ Vite build เสร็จไฟล์ที่ได้ก็จะไปอยู่ใน folder `dist` รอส่งต่อให้ backend ดำเนินการขั้นต่อไป

**Backend (Express and Static File Serving)**  
 backend จะใช้ Express.js ร่วมกับ bun เพื่อให้บริการ API และ ไฟล์ที่ผ่านการ build จาก frontend

- ทำการติดตั้ง dependencies ที่จำเป็นทั้งหมด
- นำไฟล์ที่ได้จากการ build ของ frontend มาใส่ใน folder public ของ backend เพื่อให้สามารถนำไฟล์มาใช้งานได้

**Dockerfile Excerpt for Backend Setup**:

```dockerfile
# Stage 2: Set up the Express backend and bundle the Vite build
FROM oven/bun AS backend

WORKDIR /app

# Install backend dependencies for production
COPY backend/package.json backend/package-lock.json ./
RUN bun install --production

# Copy backend code and built frontend assets
COPY backend/ .
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose port and set the start command
EXPOSE 3000
CMD ["bun", "server.js"]
```

### Using Docker Compose

1. **Setup Docker Compose**:  
   ตรวจสอบให้แน่ใจว่าได้ติดตั้ง `docker` และ `docker-compose` ไว้ในเครื่องของท่านแล้ว

2. **Create `docker-compose.yml`**:  
   ตรวจสอบให้แน่ใจว่าไฟล์ `docker-compose.yml` ของท่าน config ได้อย่างถูกต้องเพื่อให้ทำงานได้อย่างถูกต้องดังนี้:

   ```yaml
   services:
     app:
       build:
         context: .
         target: backend
       environment:
         NODE_ENV: production
         MONGO_URI: mongodb://mongo:27017/earthquake # Internal MongoDB connection
       ports:
         - 80:3000
       depends_on:
         - mongo
       networks:
         - app-network
       restart: unless-stopped

     mongo:
       image: mongo:8.0.3
       volumes:
         - mongo-data:/data/db
       networks:
         - app-network
       restart: unless-stopped

     volumes:
       mongo-data:

     networks:
       app-network:
         driver: bridge
   ```

3. **Run the Application**:  
   เข้าไปใน project directory และใช้ command นี้

   ```bash
   docker-compose up
   ```

4. **Access the App**:
   `http://localhost:80`

5. **Stop Services**:  
   To stop the containers, use:

   ```bash
   docker-compose down
   ```

6. **Persist Data**:  
   ข้อมูลใน MongoDB จะถูกเก็บไว้ใน `mongo-data` เพื่อให้แน่ใจว่าเมื่อ restart container แล้วข้อมูลจะยังอยู่

---

## Technologies Used

- **Frontend**: React, React-Leaflet, Vite
- **Backend**: Express.js, Bun
- **Database**: MongoDB with Mongoose
- **Deployment**: Docker Compose
- **Animation**: CSS animations

---

## License

This project is licensed under the MIT License.

application นี้เป็นส่วนหนึ่งของวิชา CT648 Web and Cloud Engineering <br>
วิศวกรรมศาสตรมหาบัณฑิต สาขาวิชาวิศวกรรมคอมพิวเตอร์ มหาวิทยาลัยธุรกิจบัณฑิตย์ (Master of Engineering Program in Computer Engineering, Dhurakij Pundit University) <br>
66130423 ปราชญา ป้องกัน <br>
<a href="https://cite.dpu.ac.th/ResumeDean.html">อาจารย์ที่ปรึกษา ผศ.ดร.ชัยพร เขมะภาตะพันธ์</a> <br>
<img src="https://cite.dpu.ac.th/img/logo-cite-edit.jpg?t=1" alt="CITE" width="180" height="125" />
