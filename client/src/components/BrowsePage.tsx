import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import CaseCard from './CaseCard';
import LoadingSpinner from './LoadingSpinner';
import { Case } from '../App';
import '../styles/BrowsePage.css';

interface BrowsePageProps {
  onNavigateToAbout?: () => void;
  onBackToHome: () => void;
}

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const categories: Category[] = [
  {
    id: 'constitutional',
    name: 'Constitutional Law',
    description: 'Cases involving constitutional interpretation and rights',
    icon: 'fa-book-open'
  },
  {
    id: 'criminal',
    name: 'Criminal Law',
    description: 'Criminal cases and proceedings',
    icon: 'fa-gavel'
  },
  {
    id: 'civil',
    name: 'Civil Rights',
    description: 'Civil rights and liberties cases',
    icon: 'fa-balance-scale'
  },
  {
    id: 'commercial',
    name: 'Commercial Law',
    description: 'Business and commercial disputes',
    icon: 'fa-briefcase'
  },
  {
    id: 'labor',
    name: 'Labor & Employment',
    description: 'Employment and labor relations',
    icon: 'fa-users'
  },
  {
    id: 'property',
    name: 'Property Law',
    description: 'Property rights and disputes',
    icon: 'fa-home'
  },
  {
    id: 'family',
    name: 'Family Law',
    description: 'Family and domestic relations',
    icon: 'fa-heart'
  },
  {
    id: 'tax',
    name: 'Tax Law',
    description: 'Taxation and revenue cases',
    icon: 'fa-file-invoice-dollar'
  }
];

const BrowsePage: React.FC<BrowsePageProps> = ({ onNavigateToAbout, onBackToHome }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategoryClick = async (categoryId: string) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    setError(null);

    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090';
      const response = await fetch(`${apiBaseUrl}/browse?category=${encodeURIComponent(categoryId)}`);

      if (!response.ok) {
        throw new Error('Failed to fetch cases');
      }

      const data = await response.json();
      setCases(data.results || []);
      
      if (data.results.length === 0) {
        setError(`No cases found in ${categories.find(c => c.id === categoryId)?.name}`);
      }
    } catch (err) {
      setError('Failed to load cases. Please try again.');
      setCases([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setCases([]);
    setError(null);
  };

  return (
    <div className="browse-page">
      <Header 
        showBackButton={true} 
        onBackClick={onBackToHome}
        onNavigateToAbout={onNavigateToAbout}
      />

      <main className="browse-main">
        {!selectedCategory ? (
          <section className="categories-section">
            <div className="categories-header">
              <h1 className="categories-title">Browse Cases by Category</h1>
              <p className="categories-subtitle">
                Select a category to explore related Supreme Court cases
              </p>
            </div>

            <div className="categories-grid">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="category-card"
                  onClick={() => handleCategoryClick(category.id)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCategoryClick(category.id);
                    }
                  }}
                >
                  <div className="category-icon">
                    <i className={`fas ${category.icon}`}></i>
                  </div>
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                  <div className="category-arrow">
                    <i className="fas fa-arrow-right"></i>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <section className="category-results-section">
            <div className="results-header">
              <button 
                className="back-to-categories-btn"
                onClick={handleBackToCategories}
              >
                <i className="fas fa-arrow-left"></i>
                <span>Back to Categories</span>
              </button>
              <h2 className="category-results-title">
                {categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              {cases.length > 0 && (
                <p className="results-count">
                  Found {cases.length} case{cases.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : error ? (
              <div className="alert error-alert">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            ) : cases.length === 0 ? (
              <div className="alert empty-alert">
                <i className="fas fa-folder-open"></i>
                <h3>No cases found</h3>
                <p>This category doesn't have any cases yet.</p>
              </div>
            ) : (
              <div className="results-grid">
                {cases.map((caseItem, index) => (
                  <CaseCard
                    key={`${caseItem.caseId}-${index}`}
                    case={caseItem}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <Footer onNavigateToAbout={onNavigateToAbout} />
    </div>
  );
};

export default BrowsePage;
