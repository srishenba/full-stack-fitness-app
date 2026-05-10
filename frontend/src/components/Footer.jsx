import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook, Send } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="ag-footer">
      <div className="ag-footer-container">
        
        {/* Brand & Newsletter Column */}
        <div className="ag-footer-column ag-footer-brand-col">
          <Link to="/" className="ag-footer-brand">
            <img 
              src="/assests/logo.png" 
              alt="Meal Move Logo" 
              className="ag-footer-logo" 
              onError={(e) => { e.target.src = 'https://cdn-icons-png.flaticon.com/512/2964/2964514.png'; }} 
            />
            <span className="ag-footer-brand-text">Meal Move</span>
          </Link>
          <p className="ag-footer-description">
            Your journey to a healthier lifestyle starts here. Join Meal Move today to plan, track, and conquer your nutrition goals.
          </p>
          
          {/* Newsletter Signup */}
          <div className="ag-newsletter-wrapper">
            <h4 className="ag-newsletter-title">Subscribe to our Newsletter</h4>
            <form className="ag-newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="ag-newsletter-input" 
                required 
              />
              <button type="submit" className="ag-newsletter-btn" aria-label="Subscribe">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Quick Links Column */}
        <div className="ag-footer-column">
          <h3 className="ag-footer-heading">Quick Links</h3>
          <ul className="ag-footer-links">
            <li><Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>Home</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            {/* Keeping logout here as text for design consistency per prompt requirement, though auth handles it dynamically in real apps */}
            <li><Link to="/login">Logout</Link></li>
          </ul>
        </div>

        {/* Tips & Guides Column */}
        <div className="ag-footer-column">
          <h3 className="ag-footer-heading">Tips & Guides</h3>
          <ul className="ag-footer-links">
            <li><a href="#how-to-start">How to Start</a></li>
            <li><a href="#meal-planning">Meal Planning Tips</a></li>
            <li><a href="#healthy-eating">Healthy Eating Guide</a></li>
            <li><a href="#faqs">FAQs</a></li>
          </ul>
        </div>

        {/* Resources Column */}
        <div className="ag-footer-column">
          <h3 className="ag-footer-heading">Resources</h3>
          <ul className="ag-footer-links">
            <li><a href="#blog">Blog</a></li>
            <li><a href="#help-center">Help Center</a></li>
            <li><a href="#contact">Contact Us</a></li>
            <li><a href="#support">Support</a></li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar: Copyright & Socials */}
      <div className="ag-footer-bottom">
        <p className="ag-footer-copyright">
          &copy; 2026 Meal Move. All rights reserved.
        </p>
        <div className="ag-footer-socials">
          <a href="#twitter" aria-label="Twitter" className="ag-social-icon"><Twitter size={20} /></a>
          <a 
            href="https://www.instagram.com/meal_move26/?utm_source=ig_web_button_share_sheet" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Instagram" 
            className="ag-social-icon ag-instagram-icon"
          >
            <Instagram size={20} />
          </a>
          <a href="#facebook" aria-label="Facebook" className="ag-social-icon"><Facebook size={20} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
