import React, { useState, useEffect } from 'react';
import "./Header.css"

export const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`railway-header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="container header-main">
                <div className="logo">
                    🚂 <span>Indian Railways</span>
                </div>

                <nav className="main-nav">
                    <ul className="nav-list">
                        <li><a href="#home">Home</a></li>
                        <li><a href="#pnr">PNR Status</a></li>
                        <li><a href="#trains">Find Trains</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>

                <button className="emergency-btn">🚨 Emergency</button>
            </div>
        </header>
    );
};
