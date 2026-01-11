import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Dashboard from "./Dashboard"; // Assuming this contains your main Graphs
import MLFeatureSection from "./MLFeatureSection";
import TechStackSection from "./TechStackSection";
import AboutTeam from "./AboutTeam";
import ContactSection from "./ContactSection";
// import Transactions from "./Transactions";

// You can keep other imports if you plan to use them later, 
// but for the Landing Page flow, we only need the sections above.

const MainLayout = () => {
  return (
    <div className="app-container">
      {/* 1. Header is sticky at the top */}
      <Header />
   <section id="ml-section">
        <MLFeatureSection />
      </section>

      {/* "Technology" Link will scroll here */}
      <section id="tech-section">
        <TechStackSection />
      </section>
      {/* 2. Main Content Sections with IDs for scrolling */}
      
      {/* "Graphs" Link will scroll here */}
      <section id="dashboard-section">
        <Dashboard />
        {/* <Transactions /> */}
      </section>

      {/* "Sample Data" Link could scroll here */}
   

      {/* "About" Link will scroll here */}
      <section id="about-section">
        <AboutTeam />
      </section>

      {/* "Feedback" Link will scroll here */}
      <section id="contact-section">
        <ContactSection />
      </section>

      <Footer />
    </div>
  );
};

export default MainLayout;