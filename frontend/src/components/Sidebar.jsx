import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Sidebar() {
    const [activeMenu, setActiveMenu] = useState(null);
    const [role, setRole] = useState('');

    useEffect(() => {
        // CHECK BOTH STORAGES
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (storedUser) {
            const u = JSON.parse(storedUser);
            setRole(u.role);
        }
    }, []);
    const toggleMenu = (menuName) => {
        if (activeMenu === menuName) {
            setActiveMenu(null);
        } else {
            setActiveMenu(menuName);
        }
    };

    return (
        <aside className="left-panel nicescroll-box">
            <nav className="navigation">
                <ul className="list-unstyled main-menu">
                    
                    {/* 1. DASHBOARD */}
                    <li className="has-submenu active">
                        <Link to="/">
                            <i className="fas fa-th-large" />
                            <span className="nav-label">Dashboard</span>
                        </Link>
                    </li>

                    {/* 2. DOCTORS */}
                    <li className={`has-submenu ${activeMenu === 'doctors' ? 'active mm-active' : ''}`}>
                        <a href="#!" className="has-arrow" onClick={(e) => { e.preventDefault(); toggleMenu('doctors'); }}>
                            <i className="fas fa-user-md" />
                            <span className="nav-label">Doctors</span>
                        </a>
                        <ul className={`list-unstyled mm-collapse ${activeMenu === 'doctors' ? 'mm-show' : ''}`}>
                            {role === 'admin' && <li><Link to="/add-doctor">Add Doctor</Link></li>}
                            <li><Link to="/doctors">All Doctors</Link></li>
                        </ul>
                    </li>

                    {/* 3. PATIENTS (Hidden for Patient) */}
                    {role !== 'patients' && (
                        <li className={`has-submenu ${activeMenu === 'patients' ? 'active mm-active' : ''}`}>
                            <a href="#!" className="has-arrow" onClick={(e) => { e.preventDefault(); toggleMenu('patients'); }}>
                                <i className="fas fa-users" />
                                <span className="nav-label">Patients</span>
                            </a>
                            <ul className={`list-unstyled mm-collapse ${activeMenu === 'patients' ? 'mm-show' : ''}`}>
                                {role === 'admin' && <li><Link to="/add-patient">New Patient</Link></li>}
                                <li><Link to="/patients">All Patients</Link></li>
                            </ul>
                        </li>
                    )}

                    {/* 4. APPOINTMENTS */}
                    <li className={`has-submenu ${activeMenu === 'appointments' ? 'active mm-active' : ''}`}>
                        <a href="#!" className="has-arrow" onClick={(e) => { e.preventDefault(); toggleMenu('appointments'); }}>
                            <i className="fas fa-calendar-plus" />
                            <span className="nav-label">Appointments</span>
                        </a>
                        <ul className={`list-unstyled mm-collapse ${activeMenu === 'appointments' ? 'mm-show' : ''}`}>
                            {/* Doctor CANNOT book, only View. Patient/Admin CAN book. */}
                            {role !== 'doctor' && <li><Link to="/add-appointment">Book Appointment</Link></li>}
                            <li><Link to="/appointments">View Appointments</Link></li>
                        </ul>
                    </li>

                    {/* 5. PRESCRIPTIONS (VISIBLE TO EVERYONE NOW) */}
                    <li className={`has-submenu ${activeMenu === 'prescriptions' ? 'active mm-active' : ''}`}>
                        <a href="#!" className="has-arrow" onClick={(e) => { e.preventDefault(); toggleMenu('prescriptions'); }}>
                            <i className="fas fa-book-medical" />
                            <span className="nav-label">Prescriptions</span>
                        </a>
                        <ul className={`list-unstyled mm-collapse ${activeMenu === 'prescriptions' ? 'mm-show' : ''}`}>
                            
                            {/* "New Prescription" -> Hidden for Patients */}
                            {role !== 'patients' && (
                                <li><Link to="/new-prescription">New Prescription</Link></li>
                            )}

                            {/* "All Prescriptions" -> Visible to Everyone (Page handles filtering) */}
                            <li><Link to="/prescriptions">All Prescriptions</Link></li>
                        </ul>
                    </li>

                    {/* 6. DRUGS & TESTS (Hidden for Patient) */}
                    {role !== 'patients' && (
                        <>
                            <li className={`has-submenu ${activeMenu === 'drugs' ? 'active mm-active' : ''}`}>
                                <a href="#!" className="has-arrow" onClick={(e) => { e.preventDefault(); toggleMenu('drugs'); }}>
                                    <i className="fas fa-pills" />
                                    <span className="nav-label">Drugs</span>
                                </a>
                                <ul className={`list-unstyled mm-collapse ${activeMenu === 'drugs' ? 'mm-show' : ''}`}>
                                    {role === 'admin' && <li><Link to="/add-drug">Add Drug</Link></li>}
                                    <li><Link to="/drugs">All Drugs</Link></li>
                                </ul>
                            </li>

                            <li className={`has-submenu ${activeMenu === 'tests' ? 'active mm-active' : ''}`}>
                                <a href="#!" className="has-arrow" onClick={(e) => { e.preventDefault(); toggleMenu('tests'); }}>
                                    <i className="fas fa-heartbeat" />
                                    <span className="nav-label">Tests</span>
                                </a>
                                <ul className={`list-unstyled mm-collapse ${activeMenu === 'tests' ? 'mm-show' : ''}`}>
                                    {role === 'admin' && <li><Link to="/add-test">Add Test</Link></li>}
                                    <li><Link to="/tests">All Tests</Link></li>
                                </ul>
                            </li>
                            
                            <li className="has-submenu">
                                <Link to="/doctor-schedule">
                                    <i className="fas fa-cog" />
                                    <span className="nav-label">Doctor Schedule</span>
                                </Link>
                            </li>
                        </>
                    )}

                    {/* 7. logout */}
                    <li className="has-submenu">
                        <Link to="/login" onClick={() => localStorage.removeItem('user')}>
                            <i className="fas fa-sign-out-alt" />
                                <span className="nav-label">Logout</span>
                        </Link>
                    </li>

                </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;