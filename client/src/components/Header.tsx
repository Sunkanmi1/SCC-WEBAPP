import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import CountryNav from './CountryNav';
import '../styles/Header.css';

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  onNavigateToAbout?: () => void;
  onNavigateToBookmarks?: () => void;
  showBookmarksLink?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  showBackButton = false, 
  onBackClick, 
  onNavigateToAbout,
  onNavigateToBookmarks,
  showBookmarksLink = true
}) => {
  const navigate = useNavigate();
  const location = useLocation();

const countries: Country[] = [
  // { code: "ZA", name: "South Africa", flag: "🇿🇦" }, // Countries will be fetched from the backend
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
];

const Header: React.FC<HeaderProps> = ({
  showBackButton = false,
  onBackClick,
  currentCountryCode,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loadingCountry, setLoadingCountry] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current country from URL or default to Ghana
  const getCountryFromUrl = (): string => {
    if (currentCountryCode) return currentCountryCode;
    const path = window.location.pathname;
    const match = path.match(/^\/(gh|ng|ke|za)$/i);
    return match ? match[1].toUpperCase() : "GH";
  };

  const handleBookmarksClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (onNavigateToBookmarks) {
      onNavigateToBookmarks();
    } else {
      navigate('/bookmarks');
    }
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      // Fallback navigation if onBackClick is not provided
      navigate('/');
    }
  };

  // Extract country code from URL if on country page
  const countryMatch = location.pathname.match(/\/country\/([a-z]{2})/i);
  const currentCountry = countryMatch ? countryMatch[1].toUpperCase() : 'GH';

  return (
    <header className="header">
      <LoadingModal
        isOpen={loadingCountry !== null}
        countryName={loadingCountry || ""}
      />

      <nav className="nav">
        <div className="nav-left">
          <a href="/" className="logo">
            <span className="logo-icon">⚖</span>
            <span className="logo-text">SCC</span>
          </a>

          {/* Country Selector */}
          <div className="country-selector" ref={dropdownRef}>
            <button
              className="country-button active-country"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-label="Select country"
              aria-expanded={isDropdownOpen}
              title={`Currently viewing: ${currentCountry.name}`}
            >
              <Globe size={18} className="globe-icon" />
              <span className="country-flag">{currentCountry.flag}</span>
              <span className="country-name">{currentCountry.name}</span>
              <i
                className={`fas fa-chevron-down dropdown-arrow ${
                  isDropdownOpen ? "open" : ""
                }`}
              ></i>
            </button>

            {isDropdownOpen && (
              <div className="country-dropdown">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    className={`country-option ${
                      country.code === selectedCountry ? "active" : ""
                    }`}
                    onClick={() => handleCountrySelect(country.code)}
                  >
                    <span className="country-flag">{country.flag}</span>
                    <span className="country-name">{country.name}</span>
                    {country.code === selectedCountry && (
                      <i className="fas fa-check check-icon"></i>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="nav-right">
          <CountryNav currentCountry={currentCountry} />
          {!showBackButton && (
            <>
              {showBookmarksLink && (
                <Link to="/bookmarks" onClick={handleBookmarksClick} className="nav-link bookmarks-link">
                  <i className="fas fa-bookmark"></i>
                  <span>Bookmarks</span>
                </Link>
              )}
              <Link to="/about" onClick={handleAboutClick} className="nav-link">
                About Us
              </Link>
            </>
          )}
          {showBackButton && (
            <button onClick={handleBackClick} className="back-button">
              <i className="fas fa-arrow-left"></i>
              <span>Back to Search</span>
            </button>
          )}
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;
