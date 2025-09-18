
# 📊 Data Analyst Enterprise System

A **MERN + Python** full-stack application to upload business data (CSV/Excel), automatically analyze it (charts, statistics, insights), and present interactive dashboards with upload history for enterprises and small businesses.

---


## 🚀 Problem Statement

Businesses often face challenges like:

- Having large datasets (sales, inventory, customer lists) that are difficult to analyze manually.  
- Not having affordable or user-friendly tools to generate insights.  
- Difficulty comparing past analyses or keeping track of historical performance.  

---

## 💡 Solution

This system provides:

- Easy upload of CSV/Excel data.  
- Automated analysis via a **Python service** (Flask + Pandas, NumPy, Matplotlib, Scikit-learn).  
- A **React frontend** with dashboards to view results.  
- **JWT authentication** with profile & upload history.  
- Downloadable reports (JSON / PDF / Processed Data).  
- A beautiful cyberpunk UI with neon borders and particle backgrounds.  

---

## 📂 File Structure

```

Data-Analyst-Enterprise-System/
|
\|-- backend/
\|   |-- src/
\|   |   |-- server.js
\|   |   |-- config/
\|   |   |   |-- db.js
\|   |   |-- models/
\|   |   |   |-- User.js
\|   |   |   |-- Upload.js
\|   |   |-- routes/
\|   |   |   |-- auth.js
\|   |   |   |-- upload.js
\|   |   |-- middleware/
\|   |       |-- auth.js
\|   |
\|   |-- .env
|
\|-- frontend/
\|   |-- src/
\|   |   |-- components/
\|   |   |-- pages/
\|   |   |-- api/
\|   |   |-- App.jsx
\|   |   |-- main.jsx
\|   |
\|   |-- index.html
|
\|-- python-service/
\|   |-- app.py
\|   |-- analysis.py
\|   |-- requirements.txt
\|   |-- .env
|
\|-- README.md

````

---

## 🛠️ Tech Stack

- **Frontend**: React (Vite), TailwindCSS, Recharts, react-tsparticles  
- **Backend**: Node.js, Express, MongoDB, JWT, Multer  
- **Python Service**: Flask, Pandas, NumPy, Matplotlib, OpenCV, Scikit-learn, Pillow, pytesseract  
- **Authentication**: JWT + bcryptjs  

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repo

```bash
git clone https://github.com/Janardhannaik/Data-Analyst-Enterprise-System.git
cd Data-Analyst-Enterprise-System
````

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create `.env` inside `backend`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/DataAnlaysis
JWT_SECRET=your_jwt_secret
PYTHON_SERVICE_URL=http://localhost:5001
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=524288000
```

Run backend:

```bash
npx nodemon src/server.js
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### 4️⃣ Python Service Setup

```bash
cd python-service
pip install -r requirements.txt
```

Create `.env` inside `python-service`:

```env
FLASK_ENV=development
FLASK_RUN_PORT=5001
```

Run Python service:

```bash
python app.py
```

---

## ▶️ Running All Together

* **Backend** → `http://localhost:5000`
* **Python service** → `http://localhost:5001`
* **Frontend** → `http://localhost:3000`

Workflow:

1. Register/Login.
2. Upload a dataset.
3. System analyzes data (Python service).
4. View charts, insights, and predictions.
5. Download processed reports.
6. Access your history in Profile.

---

## 📦 Key Dependencies

### Backend `package.json`

```json
"dependencies": {
  "axios": "^1.12.1",
  "bcryptjs": "^3.0.2",
  "cors": "^2.8.5",
  "dotenv": "^17.2.2",
  "express": "^5.1.0",
  "form-data": "^4.0.4",
  "jsonwebtoken": "^9.0.2",
  "mongoose": "^8.18.1",
  "multer": "^2.0.2"
},
"devDependencies": {
  "nodemon": "^3.1.10"
}
```

### Python requirements

```
flask
flask-cors
pytesseract
opencv-python
pillow
pandas
numpy
openpyxl
scikit-learn
matplotlib
```

---

## ✨ Features

* 🔑 User authentication (JWT)
* 📂 Data upload (CSV/Excel)
* 📊 Automated analysis: stats, KPIs, charts, predictions
* 📥 Download JSON / PDF / Processed data
* 🕹 Cyberpunk-styled dashboard with neon borders & particles
* 📜 Upload history with profile view

---

## 📸 Demo & Screenshots

📹 **Demo Video** →
 
 ![InShot_20250918_161141197-ezgif com-video-to-gif-converter](https://github.com/user-attachments/assets/8fb78701-c48e-4ded-87a5-87a20cc1746d)


🖼️ **Screenshots**

* Dashboard

  <img width="1350" height="678" alt="Dashboard" src="https://github.com/user-attachments/assets/d0e2f8d2-4fd0-4014-8d56-910374b64907" />


* Analysis Report
  <img width="1333" height="679" alt="Data Analysis Result" src="https://github.com/user-attachments/assets/4101cb75-046f-4b0a-9004-d1a1504df06f" />



* Profile & Upload History & Auth & History

  <img width="1332" height="675" alt="Profile" src="https://github.com/user-attachments/assets/6e245b1c-d686-436e-a999-85b68f602b40" />

  <img width="1333" height="621" alt="Upload" src="https://github.com/user-attachments/assets/9eac037c-6a56-4527-83b6-9c9efd721cda" />
  <img width="1336" height="651" alt="Authentication" src="https://github.com/user-attachments/assets/db75ac26-556a-41d6-8dc9-3b613296c36e" />
  <img width="1340" height="645" alt="History" src="https://github.com/user-attachments/assets/0b878e3e-0b98-4314-9660-ab92ef24e55e" />

---

## 👤 Author

**Janardhan Naik**
📧 Email: [naikjanardhan568@gmail.com](mailto:naikjanardhan568@gmail.com)

