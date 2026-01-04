import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

function Layout({ children }) {
    return (
        // MAKE SURE THIS ID IS HERE AND SPELLED CORRECTLY:
        <div id="main-wrapper" className="show"> 
            
            <Header />
            <Sidebar />
            
            <div className="content-body">
                {children}
            </div>
            
            <Footer />
        </div>
    );
}

export default Layout;