# 🩺 Kidney Diseases Diagnosis & Awareness System

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?logo=react)
![Python](https://img.shields.io/badge/AI_Engine-Python_&_Flask-yellow?logo=python)
![Accuracy](https://img.shields.io/badge/Model_Accuracy-98%25-brightgreen)
![Academic Year](https://img.shields.io/badge/Academic_Year-2025%2F2026-lightgrey)

## 📖 About The Project

Many kidney diseases begin with subtle or unnoticed symptoms, creating a significant barrier to early detection. The **Kidney Diseases Diagnosis System** is an interactive, AI-powered web platform designed to bridge the medical knowledge gap and support early detection. 

The system allows users to select their current symptoms and utilizes a Machine Learning model to provide a preliminary health indication. By combining modern web technologies (MERN stack) with Python-based Artificial Intelligence, this project seeks to enhance public awareness and promote healthier decision-making.

> **⚠️ Medical Disclaimer:** This system is an assistant tool for awareness and guidance. It supports patients but **does not replace a real doctor's diagnosis**.

---

## ✨ Key Features

* **🧠 AI Symptom Checker:** Analyzes selected symptoms using a Random Forest Classifier to predict potential kidney-related conditions with up to **98% accuracy**.
* **📚 Health Awareness Hub:** Provides clear, accessible medical information about kidney disease symptoms, causes, risk factors, and preventive measures.
* **🔐 Secure User Authentication:** Robust registration and login system protected by **JSON Web Tokens (JWT)** and **Bcrypt** password hashing.
* **📂 Diagnosis History:** Authenticated users can securely save, view, and track their previous diagnosis results over time.
* **📱 Responsive Design:** A user-friendly, fully responsive interface that works seamlessly on both desktop and mobile devices.

---

## 🛠️ Technology Stack

**Frontend (Client-Side)**
* [React.js](https://reactjs.org/) - UI Development
* Axios - API Requests handling

**Backend (Server-Side)**
* [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) - RESTful API architecture
* [MongoDB](https://www.mongodb.com/) - NoSQL Database for flexible data storage
* JWT & Bcrypt - Security and Authentication

**AI Engine (Microservice)**
* [Python 3](https://www.python.org/) - Machine Learning programming
* [Flask](https://flask.palletsprojects.com/) - Python Micro-framework for serving the AI model
* [Scikit-learn](https://scikit-learn.org/) - Random Forest Machine Learning Model

---

## ⚙️ System Architecture & Data Flow

1. **Client Interaction:** The user interacts with the React frontend and submits their symptoms.
2. **API Gateway:** The Express.js server receives the JSON payload.
3. **AI Processing:** Node.js forwards the symptoms to the Python/Flask microservice.
4. **Prediction:** The Scikit-learn Random Forest model processes the data and returns the prediction.
5. **Storage & Response:** The Node.js server saves the result in MongoDB under the user's profile and sends the final result back to the React UI.

---

## 🚀 Getting Started (Local Setup)

To run this project locally, you need to start the Frontend, the Node Backend, and the Python AI Server.

### Prerequisites
* Node.js (v14 or higher)
* Python (v3.8 or higher)
* MongoDB (Local or Atlas URI)

### Installation Steps

**1. Clone the repository**
```bash
git clone [https://github.com/mo7amedsherif/Kidney-Diseases.git](https://github.com/mo7amedsherif/Kidney-Diseases.git)
cd Kidney-Diseases
```
**2. Start the Node.js Backend**
```bash
cd backend
npm install
# Create a .env file and add your MongoDB URI and JWT Secret
npm start
**3. Start the Python Flask Server (AI)**
```
```bash
cd ai-service
pip install -r requirements.txt
python app.py
```
**Start the React Frontend**
```bash
cd frontend
npm install
npm start
```
