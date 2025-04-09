import React from "react";
import "./footer.style.scss";

const Footer = () => {
  return (
    <footer className="footer">
     <p className="footer">© {new Date().getFullYear()}. All rights reserved</p>
    </footer>
  );
};

export default Footer;