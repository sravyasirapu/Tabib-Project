import React from 'react';

function Footer() {
    return (
        <div className="footer">
            <div className="copyright">
                <p className="mb-0">
                    {/* Changed href="#" to href="/" to fix the warning */}
                    Copyright © Designed & Developed by <a href="/">Sravya</a> 2025
                </p>
            </div>
        </div>
    );
}

export default Footer;