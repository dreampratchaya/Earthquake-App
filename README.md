# Earthquake Web App  

เว็บแอปพลิเคชันแบบ real-time ที่จะแสดงข้อมูลแผ่นดินไหวและข้อมูลสำคัญอีกหลายอย่าง เช่น สึนามิ บนแผนที่แบบ interactive รวมถึงสามารถดูข้อมูลย้อนหลังในแต่ละวันได้

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

---

## Important APIs  

1. **USGS Earthquake API**  
   - ดึงข้อมูลแผ่นดินไหว, สถานที่, ความรุนแรง, ความลึก และ ช่วงเวลาแบบ real-time จาก USGS Earthquake API (สำนักสำรวจธรณีวิทยาสหรัฐอเมริกา)
   - **URL**: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-01-01&endtime=2024-01-02`  

2. **Local MongoDB via Docker**  
   - ส่ง GET Request ไปที่ `/api/earthquake` โดย query ด้วย `start` และ `end`
   - backend จะทำการ query ใน MongoDB และตอบกลับในรูป `geojson`

---

## Deployment Methods  

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
        MONGO_URI: mongodb://mongo:27017/earthquake  # Internal MongoDB connection
      ports:
        - 8000:3000
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
   เข้าไปใน project directory และ command นี้ 
   ```bash
   docker-compose up
   ```

4. **Access the App**:
   `http://localhost:80`

6. **Stop Services**:  
   To stop the containers, use:  
   ```bash
   docker-compose down
   ```

7. **Persist Data**:  
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

application นี้เป็นส่วนหนึ่งของวิชา CT648 Web and Cloud Engineering
66130423 ปราชญา ป้องกัน

