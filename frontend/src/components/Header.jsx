import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    
    // State to track dropdowns
    const [activeDropdown, setActiveDropdown] = useState(null);
    
    // State to store Logged In User Info
    const [currentUser, setCurrentUser] = useState({
        name: 'Guest',
        role: 'Admin',
        photo: ''
    });

    // 1. Fetch User Data on Load from LocalStorage OR SessionStorage
    useEffect(() => {
        // CHECK BOTH STORAGES
        const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
    }, []);

    // 2. LOGOUT FUNCTION (Fixed: Clears BOTH storages)
    const handleLogout = (e) => {
        e.preventDefault();
        
        // Clear everything to ensure complete logout
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        
        // Redirect to Login
        navigate('/login');
    };

    // Toggle Dropdowns
    const toggleDropdown = (name) => {
        if (activeDropdown === name) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(name);
        }
    };

    // Toggle Sidebar
    const toggleSidebar = () => {
        const wrapper = document.getElementById('main-wrapper');
        const hamburgerBtn = document.querySelector('.hamburger');
        if (wrapper) wrapper.classList.toggle('nav-collapsed');
        if (hamburgerBtn) hamburgerBtn.classList.toggle('is-active');
    };

    // Fullscreen Logic
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => console.error(err));
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    };

    return (
        <>
            <div className="nav-header">
                <div className="brand-logo">
                    <Link to="/"> 
                        <img className="logo-tabib" src="/assets/images/download.png" alt="Logo" />
                    </Link>
                    <Link to="/">
                        <img className="brand-title" src="/assets/images/logo.png" alt="Brand" />
                    </Link>
                </div>
            </div>

            <div className="header">
                <header className="top-head container-fluid">
                    <div className="nav-control">
                        
                        {/* Hamburger */}
                        <div 
                            className="hamburger" 
                            onClick={toggleSidebar} 
                            style={{ cursor: 'pointer', zIndex: 9999 }}
                        >
                            <span className="line" /><span className="line" /><span className="line" />
                        </div>

                        <div className="left-header content-header__menu">
                            <ul className="list-unstyled">
                                <li className="nav-link btn">
                                    <Link to="/add-appointment">
                                        <i className="far fa-calendar-check" /> <span> Make an appointment</span>
                                    </Link>
                                </li>
                                <li className="nav-link btn">
                                    <Link to="/new-prescription">
                                        <i className="far fa-file-alt" /> <span> Write a prescription</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="header-right">
                        
                        {/* Fullscreen */}
                        <div className="fullscreen notification_dropdown widget-5">
                            <div className="full">
                                <a className="text-dark" href="#!" onClick={(e) => { e.preventDefault(); toggleFullScreen(); }}>
                                    <i className="fas fa-expand" />
                                </a>
                            </div>
                        </div>

                        {/* Notification Dropdown */}
                        <div className="widget-6">
                            <div className={`cart-wrapper ${activeDropdown === 'notification' ? 'show' : ''}`}>
                                <div className="cart-icon">
                                    <a className="cart-control" href="#!" onClick={(e) => { e.preventDefault(); toggleDropdown('notification'); }}>
                                        <i className="fas fa-bell" />
                                        <div className="pulse-css" />
                                    </a>
                                </div>
                                <div className={`cart-dropdown-form dropdown-container ${activeDropdown === 'notification' ? 'show' : ''}`} 
                                     style={{ display: activeDropdown === 'notification' ? 'block' : 'none' }}>
                                    <div className="form-content">
                                        <div className="widget-media main-scroll nicescroll-box">
                                            <ul className="timeline">
                                                <li><h6 className="mb-0">Notifications</h6></li>
                                                <li>
                                                    <div className="timeline-panel">
                                                        <div className="media mr-2">
                                                            <img alt="Avatar" src="/assets/images/avtar/1.jpg" />
                                                        </div>
                                                        <div className="media-body">
                                                            <h6 className="mb-1">System Alert</h6>
                                                            <small className="d-block">Welcome to Tabib!</small>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- DYNAMIC PROFILE DROPDOWN --- */}
                        <div className="my-account-wrapper widget-7">
                            <div className="account-wrapper">
                                <div className={`account-control ${activeDropdown === 'profile' ? 'active' : ''}`}>
                                    <a 
                                        className="login header-profile" 
                                        href="#!" 
                                        onClick={(e) => { e.preventDefault(); toggleDropdown('profile'); }}
                                    >
                                        <div className="header-info">
                                            {/* Display Real Name and Role */}
                                            <span>{currentUser.name}</span>
                                            <small>{currentUser.role}</small>
                                        </div>
                                        {/* Display Real Photo (Base64) or Default */}
                                        <img 
                                            src={currentUser.photo && currentUser.photo.length > 20 
                                                ? currentUser.photo 
                                                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                                            alt="Profile" 
                                            style={{ objectFit: 'cover' }}
                                        />
                                    </a>
                                    
                                    <div className="account-dropdown-form dropdown-container" 
                                         style={{ display: activeDropdown === 'profile' ? 'block' : 'none' }}>
                                        <div className="form-content">
                                            <Link to="/profile">
                                                <i className="far fa-user" /> <span className="ml-2">Profile</span>
                                            </Link>
                                            <a href="#!" onClick={handleLogout}>
                                                <i className="fas fa-sign-in-alt" /> <span className="ml-2">Logout </span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </header>
            </div>
        </>
    );
}

export default Header;