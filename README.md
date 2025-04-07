# 🛒 Grocery App Backend

This is the backend for a Grocery application built with Node.js, TypeScript, Express, TypeORM, and PostgreSQL.

## database diagram:
[database diagram](https://dbdiagram.io/d/Grocery-Booking-App-67ec17224f7afba184f980d5)
---

## API DOCS
[Api Docs](https://docs.google.com/spreadsheets/d/1ak2OKfkpDi5dSPaG8nSO8vR824Udn8EJTzlniHGmt2M/edit?usp=sharing)  

## 🚀 Run the App Without Docker

## 📦 Prerequisites

- Node.js (v18+)
- PostgreSQL (if running locally without Docker)
- Docker & Docker Compose (if running with containers)

### 1. Clone the repository
```bash
git clone https://github.com/Rohan7050/qp-assessment.git
```
### 2. Navigate in repository
```bash
cd qp-assessment
```
### 3. Install dependencies
```bash
npm install
```
### 4. Change .env file as per your need (file is in root level)

### 5. Start server
```bash
npm run dev
```

Environment Setup
The backend service runs on: http://localhost:3000

---

## 🚀 Run the App With Docker

## 📦 Prerequisites

- Docker
- Docker Compose

### 1. Clone the repository
```bash
git clone https://github.com/Rohan7050/qp-assessment.git
```
### 2. Navigate in repository
```bash
cd qp-assessment
```
### 3. Start the services
```bash
docker compose up --build
```
### Or, to rebuild everything without using cache:
``` bash
docker compose build --no-cache
docker compose up
```

Environment Setup
The backend service runs on: http://localhost:3000

---
## 🧪 API Testing with Postman

### You can use our pre-configured Postman collection to test the API endpoints.
[Postman collection](https://github.com/Rohan7050/qp-assessment/blob/DEV_Rohan/postman/qp_assesment.postman_collection.json)

### 🛠 How to Use
1. Open Postman.
2. Click Import → Upload the JSON file or paste the link above.
3. Use the pre-written requests to test the API.

