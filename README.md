# Tabib - Hospital Management System 🏥

A full-stack medical administration platform designed for hospitals to manage doctors, patients, appointments, and prescriptions. Built with a **React** frontend and a **Spring Boot** REST API.

## 🌟 Features
- **Role-Based Access:** Different views for Admins, Doctors, and Patients.
- **Admin Dashboard:** Total control over doctors, patients, drugs, and lab tests.
- **Doctor Portal:** Manage availability schedules and write digital prescriptions.
- **Patient Portal:** Book appointments and view medical history/prescriptions.
- **Authentication:** Secure login and registration system.
- **UI/UX:** Fully responsive dashboard with SweetAlert2 notifications.

## 🛠 Tech Stack
- **Frontend:** React.js, React Router, Axios, Bootstrap 5, SweetAlert2.
- **Backend:** Java 17, Spring Boot, Spring Data JPA, Hibernate.
- **Database:** MySQL (XAMPP).

## ⚙️ Setup & Installation

### 1. Database Setup (XAMPP)
- Open XAMPP and start Apache and MySQL.
- Go to `http://localhost/phpmyadmin`.
- Create a new database named `tabib_db`.
- Import the `tabib_db.sql` file provided in this repository.

### 2. Backend Setup (Spring Boot)
- Open the `backend` folder in your IDE (IntelliJ or Eclipse).
- Update `src/main/resources/application.properties` with your MySQL username and password.
- Run the application. The server starts at `http://localhost:8080`.

### 3. Frontend Setup (React)
- Open a terminal in the `frontend` folder.
- Install dependencies:
  ```bash
  npm install
