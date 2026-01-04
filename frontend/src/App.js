import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import AddDoctor from './pages/AddDoctor';
import EditDoctor from './pages/EditDoctor';
import Patients from './pages/Patients';
import AddPatient from './pages/AddPatient';
import EditPatient from './pages/EditPatient';
import Appointments from './pages/Appointments';
import AddAppointment from './pages/AddAppointment';
import EditAppointment from './pages/EditAppointment';
import Prescriptions from './pages/Prescriptions';
import AddPrescription from './pages/AddPrescription';
import ViewPrescription from './pages/ViewPrescription';
import AddDrug from './pages/AddDrug';
import Drugs from './pages/Drugs';
import EditDrug from './pages/EditDrug';
import AddTest from './pages/AddTest';
import Tests from './pages/Tests';
import EditTest from './pages/EditTest';
import DoctorSchedule from './pages/DoctorSchedule';
import Login from './pages/Login';       
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Dashboard */}
        <Route path="/" element={<Home />} />
        
        {/* Doctors */}
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/add-doctor" element={<AddDoctor />} />
        <Route path="/edit-doctor/:id" element={<EditDoctor />} />

        {/* Patients */}
        <Route path="/patients" element={<Patients />} />
        <Route path="/add-patient" element={<AddPatient />} />
        <Route path="/edit-patient/:id" element={<EditPatient />} />

        {/* Appointments */}
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/add-appointment" element={<AddAppointment />} />
        <Route path="/edit-appointment/:id" element={<EditAppointment />} />

        {/* Prescriptions */}
        <Route path="/prescriptions" element={<Prescriptions />} />
        <Route path="/new-prescription" element={<AddPrescription />} />
        <Route path="/view-prescription/:id" element={<ViewPrescription />} />

        {/* Drugs */}
        <Route path="/drugs" element={<Drugs />} />
        <Route path="/add-drug" element={<AddDrug />} />
        <Route path="/edit-drug/:id" element={<EditDrug />} />

        {/* Tests */}
        <Route path="/add-test" element={<AddTest />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/edit-test/:id" element={<EditTest />} />

        {/* SCHEDULE ROUTE */}
        <Route path="/doctor-schedule" element={<DoctorSchedule />} />

        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;