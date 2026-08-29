# 🩸 RaktSetu

### Real-Time Emergency Blood Donor Coordination Platform

RaktSetu is a real-time emergency blood coordination platform that connects hospitals with eligible nearby blood donors during critical situations.

The platform helps hospitals create emergency blood requests and intelligently identify suitable donors using blood-group compatibility, donor eligibility, GPS-based distance, and a configurable search radius.

RaktSetu also provides real-time donor notifications, email alerts, SMS notifications, hospital–donor map visualization, and donation tracking.

## 🚨 The Problem

During medical emergencies, finding a suitable blood donor quickly can be difficult.

Hospitals may need to:

- Search for compatible blood donors
- Identify donors who are medically eligible
- Find donors within a reasonable distance
- Contact donors quickly
- Track who has accepted the request

RaktSetu brings these steps together into a single platform.

## 💡 Our Solution

RaktSetu creates a direct communication channel between hospitals and nearby eligible donors.

A hospital creates an emergency blood request, and the system:

1. Checks blood-group compatibility
2. Filters donors based on eligibility
3. Calculates the distance between the hospital and donors
4. Finds donors within the requested radius
5. Sends notifications to eligible donors
6. Allows donors to accept the request
7. Tracks collected blood units
8. Allows the hospital to complete the request

## ✨ Key Features

### 🏥 Hospital Management
- Hospital registration and login
- JWT-based authentication
- Hospital-specific blood request management
- Hospitals can view only their own requests
- Track accepted donors and collected blood units
- Complete blood requests when requirements are fulfilled

### 🩸 Donor Management
- Donor registration and login
- Blood group information
- Age and weight eligibility
- Last donation date tracking
- Donor consent management
- GPS-based donor location

### 🧬 Smart Blood Matching
RaktSetu identifies suitable donors using:

- Blood-group compatibility
- Age eligibility
- Weight eligibility
- Consent status
- 90-day donation interval
- Geographic distance
- Hospital-defined search radius

### 📍 GPS-Based Matching
The system calculates the distance between the requesting hospital and eligible donors.

Hospitals can view:

- Donor distance from the hospital
- Hospital location
- Donor locations
- Visual connections between the hospital and eligible donors on the map

### 📧 Email Notifications
Eligible donors receive an emergency blood request email containing:

- Hospital information
- Blood group required
- Required units
- Urgency level
- Doctor contact details
- Distance from the hospital
- Google Maps direction link

### 📱 SMS Notifications
RaktSetu integrates Twilio for SMS notifications to eligible donors.

The SMS system is designed to provide rapid emergency alerts when a compatible donor is identified.

### ⚡ Real-Time Notifications
RaktSetu uses Socket.IO to provide real-time emergency request notifications to connected donor dashboards.

When a new request is created, matching donors can receive an immediate alert without manually refreshing the page.

### 🗺️ Interactive Map
The hospital dashboard provides a map showing:

- 🏥 Requesting hospital
- 🩸 Eligible donors
- 📏 Distance between hospital and donors
- 🔴 Visual connections between hospital and donor locations

### 🤝 Donation Acceptance
Donors can accept an emergency blood request directly from their dashboard.

The system records:

- Donor name
- Donor phone number
- Acceptance time
- Number of collected units
- Request status

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication
- bcrypt.js

### Database
- MongoDB
- Mongoose

### Real-Time Communication
- Socket.IO

### Notifications
- Nodemailer for email notifications
- Twilio for SMS notifications

### Maps & Location
- React Leaflet
- OpenStreetMap
- Browser Geolocation API
- Custom distance calculation using GPS coordinates

### Deployment
- Vercel for frontend deployment
- Render for backend deployment


## 🔄 How RaktSetu Works

```text
🏥 Hospital
     │
     │ Create Emergency Blood Request
     ↓
🩸 Blood Group + Units + Urgency + Search Radius
     │
     ↓
🧬 Blood Compatibility Check
     │
     ↓
✅ Donor Eligibility Check
     │
     ├── Age
     ├── Weight
     ├── Consent
     ├── Last Donation Date
     └── GPS Location
     │
     ↓
📍 Distance & Radius Matching
     │
     ↓
📧 Email + 📱 SMS + ⚡ Real-Time Alert
     │
     ↓
👤 Donor Receives Emergency Request
     │
     ↓
🤝 Donor Accepts Request
     │
     ↓
📊 Hospital Tracks Collected Units
     │
     ↓
✅ Request Completed


## 📁 Project Structure

```text
RaktSetu/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Features.jsx
│       │   ├── Footer.jsx
│       │   ├── Hero.jsx
│       │   ├── Map.jsx
│       │   ├── Navbar.jsx
│       │   └── Stats.jsx
│       │
│       ├── pages/
│       │   ├── DonorDashboard.jsx
│       │   ├── DonorRegister.jsx
│       │   ├── HospitalDashboard.jsx
│       │   ├── HospitalLogin.jsx
│       │   └── LandingPage.jsx
│       │
│       ├── api.js
│       ├── socket.js
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── donorController.js
│   │   ├── hospitalController.js
│   │   ├── hospitalLoginController.js
│   │   └── requestController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js
│   │
│   ├── models/
│   │   ├── Donor.js
│   │   ├── Hospital.js
│   │   └── Request.js
│   │
│   ├── routes/
│   │   ├── donorRoutes.js
│   │   ├── hospitalRoutes.js
│   │   └── requestRoutes.js
│   │
│   ├── utils/
│   │   ├── bloodCompatibility.js
│   │   ├── calculateDistance.js
│   │   ├── sendEmail.js
│   │   └── sendSMS.js
│   │
│   └── server.js
│
├── .gitignore
├── README.md
└── package configuration files

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/vinodguntuka09-byte/RaktSetu.git
cd RaktSetu

Setup Frontend

cd client
npm install
npm run dev

The frontend will run on:
http://localhost:5173

Setup Backend

cd server
npm install
npm run dev

The backend will run on:
http://localhost:5000

Environment Variables
Create a .env file inside the server folder.
Add the required configuration:
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password

TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

Run the Application
Start both services:
# Frontend
cd client
npm run dev

# Backend
cd server
npm run dev

Then open the frontend in your browser..

## 🌐 Live Deployment

RaktSetu is deployed using a separate frontend and backend architecture.

### Frontend
The React frontend is deployed on **Vercel**.

### Backend
The Node.js + Express backend is deployed on **Render**.

### Database
The application uses **MongoDB Atlas** as the cloud database.

### Production Architecture

```text
User
  ↓
Vercel
  ↓
React Frontend
  ↓
Render
  ↓
Node.js + Express API
  ↓
MongoDB Atlas

## 🔮 Future Scope

RaktSetu can be expanded into a complete emergency blood coordination ecosystem.

### 🚗 Donor Transportation
After a donor accepts an emergency request, RaktSetu can coordinate transportation from the donor's location to the hospital.

### 📱 Mobile Application
A dedicated Android and iOS application can provide faster notifications, location services, and easier donor interaction.

### 🤖 Intelligent Donor Prioritization
The system can prioritize donors based on distance, availability, blood-group compatibility, urgency, and previous donation history.

### 🏥 Hospital Network
RaktSetu can connect multiple hospitals, blood banks, and healthcare organizations through a common emergency blood network.

### 📊 Analytics & Monitoring
Hospitals and administrators can use dashboards to monitor blood demand, donor availability, response times, and completed donations.

### 🌍 Large-Scale Emergency Broadcasting
The platform can be extended to notify large groups of eligible donors within a geographic area during major emergencies.


## 👥 Team

**RaktSetu** was developed as a hackathon project by **Team TSM**.

### 🎯 Project Goal

Our goal is to reduce the time required to find suitable blood donors during medical emergencies by connecting hospitals with eligible nearby donors through a single real-time platform.

---

## 🏆 Hackathon Project

RaktSetu was developed as part of our hackathon journey, where we worked on designing, developing, integrating, testing, and deploying the complete application.

The project focuses on solving a real-world healthcare problem using modern web technologies and real-time communication.


## 📄 License

This project was created as a hackathon project for educational and demonstration purposes.


## ❤️ Built for a Real-World Problem

RaktSetu was built with a simple vision:

> **When every minute matters, finding the right blood donor should not depend on luck.**

By combining smart donor matching, location-based filtering, real-time communication, and emergency notifications, RaktSetu aims to make blood donation coordination faster and more accessible.


⭐ **If you find RaktSetu useful, consider giving the repository a star!**

Made with ❤️ by **Team TSM**