import React from 'react';
import Header from './Header';
import Footer from './Footer';
import '../styles/AboutUs.css';

interface AboutUsProps {
  onNavigateToHome?: () => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ onNavigateToHome }) => {
  const handleBackToHome = () => {
    if (onNavigateToHome) {
      onNavigateToHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="about-page">
      <Header showBackButton={true} onBackClick={handleBackToHome} />
      
      <main className="about-main">
        <div className="about-container">
          {/* Hero Section */}
          <section className="about-hero">
            <h1 className="about-title">About Supreme Court Cases</h1>
            <p className="about-subtitle">
              Empowering legal research with comprehensive access to Supreme Court of Ghana case law
            </p>
          </section>

          {/* Mission Section */}
          <section className="about-section">
            <div className="section-content">
              <h2 className="section-title">Our Mission</h2>
              <p className="section-text">
                The Supreme Court Cases (SCC) web application is dedicated to making legal information 
                accessible, searchable, and freely available to legal professionals, students, researchers, 
                and the general public. We believe that access to legal precedents and case law is fundamental 
                to justice, legal education, and informed decision-making.
              </p>
              <p className="section-text">
                Our platform provides real-time access to over 2,000 Supreme Court of Ghana cases, enabling 
                users to search, explore, and analyze legal decisions with ease and efficiency.
              </p>
            </div>
          </section>

          {/* Features Section */}
          <section className="about-section about-section-alt">
            <div className="section-content">
              <h2 className="section-title">Key Features</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">🔍</div>
                  <h3 className="feature-title">Advanced Search</h3>
                  <p className="feature-text">
                    Powerful full-text search across case titles, descriptions, citations, judges, and court information
                  </p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📊</div>
                  <h3 className="feature-title">Comprehensive Data</h3>
                  <p className="feature-text">
                    Access detailed case information including dates, citations, judges, majority opinions, and sources
                  </p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📱</div>
                  <h3 className="feature-title">Responsive Design</h3>
                  <p className="feature-text">
                    Optimized for all devices - desktop, tablet, and mobile - ensuring access anywhere, anytime
                  </p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🆓</div>
                  <h3 className="feature-title">Free & Open</h3>
                  <p className="feature-text">
                    Completely free to use with open-source code, promoting transparency and accessibility
                  </p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">⚡</div>
                  <h3 className="feature-title">Real-Time Updates</h3>
                  <p className="feature-text">
                    Live data integration with Wikidata ensures you always have access to the latest case information
                  </p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🌐</div>
                  <h3 className="feature-title">Global Access</h3>
                  <p className="feature-text">
                    Available worldwide, supporting legal research and education across borders
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Technology Section */}
          <section className="about-section">
            <div className="section-content">
              <h2 className="section-title">Technology & Data</h2>
              <p className="section-text">
                This application is built using modern web technologies including React, TypeScript, and Node.js, 
                ensuring a fast, reliable, and user-friendly experience. Our backend integrates with Wikidata, 
                a free and open knowledge base that serves as a central storage for structured data.
              </p>
              <p className="section-text">
                All case data is sourced from Wikidata and is available under the Creative Commons Attribution-ShareAlike 
                4.0 International (CC BY-SA 4.0) license, ensuring free and open access to legal information.
              </p>
            </div>
          </section>

          {/* Purpose Section */}
          <section className="about-section about-section-alt">
            <div className="section-content">
              <h2 className="section-title">Who We Serve</h2>
              <div className="audience-list">
                <div className="audience-item">
                  <h3 className="audience-title">Legal Professionals</h3>
                  <p className="audience-text">
                    Lawyers, judges, and legal practitioners can quickly find relevant precedents and case law 
                    to support their work and research.
                  </p>
                </div>
                <div className="audience-item">
                  <h3 className="audience-title">Students & Researchers</h3>
                  <p className="audience-text">
                    Law students and academic researchers can explore case history, analyze legal trends, 
                    and conduct comprehensive legal research.
                  </p>
                </div>
                <div className="audience-item">
                  <h3 className="audience-title">General Public</h3>
                  <p className="audience-text">
                    Citizens can access legal information to better understand their rights, legal processes, 
                    and the judicial system.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact/Support Section */}
          <section className="about-section">
            <div className="section-content">
              <h2 className="section-title">Support & Contribution</h2>
              <p className="section-text">
                This is an open-source project developed to serve the legal community. We welcome contributions, 
                feedback, and suggestions to improve the platform. If you encounter any issues or have ideas for 
                enhancements, please reach out through our project repository.
              </p>
              <p className="section-text">
                <strong>License:</strong> This project is open-source and available under the MIT License. 
                Case data is provided under CC BY-SA 4.0 license from Wikidata.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutUs;

