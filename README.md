# 🩸 RaktSetu

> **Emergency Blood Donation and Hospital Management System**

![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Express](https://img.shields.io/badge/Framework-Express-black)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)
![Socket.IO](https://img.shields.io/badge/Realtime-Socket.IO-lightgrey)
![Leaflet](https://img.shields.io/badge/Maps-Leaflet-success)
![License](https://img.shields.io/badge/License-MIT-red)

---

## 📖 Overview

RaktSetu is a smart emergency blood donation platform that connects hospitals with nearby eligible blood donors during emergencies.

Unlike traditional blood donation systems, RaktSetu intelligently identifies compatible donors, verifies eligibility, calculates real-time distance, and notifies only the most suitable donors. This helps hospitals receive blood faster while avoiding unnecessary notifications to all registered donors.

The system is designed to make emergency blood requests faster, smarter, and more reliable.

---

## 🎯 Problem Statement

During emergencies, hospitals often struggle to find eligible blood donors quickly. Existing systems generally notify all registered donors without checking compatibility, medical eligibility, or distance.

This causes:

- Delay in finding suitable donors
- Unnecessary notifications
- Lower donor response rate
- Increased workload for hospitals

RaktSetu solves these problems using intelligent filtering and location-based matching.

---

# ✨ Features

## 👨‍⚕️ Hospital Module

- Hospital Registration & Login
- Create Emergency Blood Requests
- Set Blood Group, Units & Emergency Priority
- Set Search Radius (KM)
- View Eligible Donors
- View Donor Locations on Interactive Map
- Track Collected Blood Units
- View Accepted Donors
- Automatic Request Completion

---

## 🩸 Donor Module

- Donor Registration & Login
- GPS Location Capture
- Blood Group Registration
- Accept Blood Requests
- Prevent Duplicate Acceptance
- View Nearby Blood Requests

---

## 🧬 Smart Matching

- Blood Compatibility Matching
- Radius-Based Donor Search
- Distance Calculation
- Age Validation (18–60)
- Weight Validation (50kg+)
- 90-Day Donation Eligibility Check
- Consent-Based Donor Filtering

---

## 📧 Emergency Notification System

- Personalized Email Alerts
- Hospital Details
- Doctor Details
- Blood Group & Units Required
- Google Maps Navigation Link
- Distance from Hospital

---

## 🗺️ Maps & Location

- Interactive Leaflet Map
- Hospital Location Marker
- Donor Location Markers
- Live Distance Display

---

## 📊 Request Tracking

- Active Requests
- Accepted Requests
- Completed Requests
- Multiple Donors Per Request
- Blood Unit Collection Tracking

---

# 🏗️ System Architecture

```text
                    +----------------------+
                    |      Hospital        |
                    | (Create Blood Request)|
                    +----------+-----------+
                               |
                               v
                    +----------------------+
                    |     Node.js API      |
                    |    (Express Server)  |
                    +----------+-----------+
                               |
                 +-------------+--------------+
                 |                            |
                 v                            v
      +-------------------+         +--------------------+
      | Blood Compatibility|         | Eligibility Check |
      |      Matching      |         | Age, Weight,      |
      |                    |         | Consent, 90 Days  |
      +---------+----------+         +---------+----------+
                |                              |
                +--------------+---------------+
                               |
                               v
                 +-----------------------------+
                 | GPS Distance Calculation     |
                 | (Haversine Formula)          |
                 +--------------+--------------+
                                |
                                v
                 +-----------------------------+
                 | Nearby Eligible Donors      |
                 +--------------+--------------+
                                |
               +----------------+----------------+
               |                                 |
               v                                 v
      +--------------------+          +----------------------+
      | Email Notification |          | Live Dashboard       |
      | Google Maps Link   |          | Request Tracking     |
      +--------------------+          +----------------------+
               |                                 |
               +----------------+----------------+
                                |
                                v
                    +--------------------------+
                    | Donor Accepts Request    |
                    +------------+-------------+
                                 |
                                 v
                    +--------------------------+
                    | Blood Units Updated      |
                    | Status Completed         |
                    +--------------------------+
```

---

## 🔄 Workflow

1. Hospital creates an emergency blood request.
2. The system checks blood compatibility.
3. Donor eligibility is verified (age, weight, consent, and last donation).
4. GPS distance is calculated using the Haversine formula.
5. Only nearby eligible donors receive notifications.
6. Donors receive an email with hospital details and Google Maps navigation.
7. Donors accept the request.
8. Blood units collected are updated automatically.
9. Once all required units are collected, the request status changes to **Completed**.

---

# 🛠️ Tech Stack

## Frontend
- React.js
- Tailwind CSS
- Axios
- Leaflet (OpenStreetMap)

## Backend
- Node.js
- Express.js
- Socket.IO

## Database
- MongoDB Atlas
- Mongoose

## Authentication
- JWT (JSON Web Token)

## Email Service
- Nodemailer (Gmail SMTP)

## Other Tools
- Git & GitHub
- VS Code
- Postman

---

# 📂 Project Structure

```
RaktSetu
│
├── client
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── firebase.js
│   │   ├── socket.js
│   │   └── App.jsx
│   └── package.json
│
├── server
│   ├── config
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── utils
│   ├── server.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

# 🚀 Getting Started

## Prerequisites

Make sure the following software is installed:

- Node.js (v18 or later)
- MongoDB Atlas Account
- Git
- VS Code

---

## Clone the Repository

```bash
git clone https://github.com/vinodguntuka09-byte/RaktSetu.git
```

```bash
cd RaktSetu
```

---

## Install Frontend Dependencies

```bash
cd client
npm install
```

---

## Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## Configure Environment Variables

Create a `.env` file inside the **server** folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

---

## Run Backend

```bash
cd server
npm run dev
```

---

## Run Frontend

Open another terminal.

```bash
cd client
npm run dev
```

---

Visit:

```
http://localhost:5173
```

The application should now be running successfully.

---

# 🔌 API Endpoints

## Hospital APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/hospitals/register` | Register Hospital |
| POST | `/api/hospitals/login` | Hospital Login |

---

## Donor APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/donors/register` | Register Donor |
| POST | `/api/donors/login` | Donor Login |

---

## Blood Request APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/requests/create` | Create Blood Request |
| GET | `/api/requests/all` | Get All Requests |
| GET | `/api/requests/eligible/:requestId` | Get Eligible Donors |
| PUT | `/api/requests/accept` | Accept Blood Request |

---

# 🚀 Future Enhancements

- Blood Stock Management
- Analytics Dashboard
- Push Notifications
- SMS Alerts
- AI-Based Donor Availability Prediction
- Hospital Verification by Government
- Donor Reward & Badge System
- Multi-Language Support
- Real-Time Request Updates using Socket.IO
- Mobile Application (Android & iOS)

---

# 👨‍💻 Contributors

### Team RaktSetu

- Vinod Guntuka
- Team Members

> Developed RaktSetu.

---

# 📄 License

This project is developed for educational and hackathon purposes.

Feel free to fork, learn, and improve the project.

© 2026 Team RaktSetu

---

# ⭐ Support

If you like this project,

⭐ Star this repository.

It motivates us to build more impactful open-source projects.

Thank you for visiting RaktSetu ❤️