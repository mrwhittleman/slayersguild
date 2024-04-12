import React from "react";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="flex w-full p-4 bg-accent justify-center z-50">
      <p className="text-sm">&copy; {year} - Vechain Slayers Guild</p>
    </footer>
  );
};

export default Footer;
