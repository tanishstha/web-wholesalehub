import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"; // Importing icons
import "./Footer.scss";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <img src="/assets/images/wholesalehub.jpeg" alt="Commerce Logo" />
          <form className="subscribe-form">
            <input
              type="email"
              placeholder="Enter Your Email*"
              className="email-input"
            />
            <button type="submit" className="btn__main">
              Subscribe
            </button>
          </form>
          <p className="subscribe-text">
            Get monthly updates.
          </p>
        </div>

        <div className="footer-section">
          <h3>Wholesale-Hub</h3>
          <p>Phone: 01-4109655</p>
          <p>Email: yourmail@example.com</p>
          <p>Address: Newroad, Kathmandu</p>
          <div className="social-icons">
            <FaTwitter size={20} />
            <FaFacebook size={20} />
            <FaInstagram size={20} />
            <FaYoutube size={20} />
          </div>
        </div>
        <div className="footer-section">
          <h4>Recent News</h4>
          <ul>
            <li>About Us</li>
            <li>Contact Us</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Links</h4>
          <ul>
            <li>Download for Mac</li>
            <li>Download for Windows</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Wholesale-Hub. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
