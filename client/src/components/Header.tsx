import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import CountryNav from './CountryNav';
import '../styles/Header.css';

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  currentCountryCode?: string;
}

const Header: React.FC<HeaderProps> = ({ showBackButton = false, onBackClick, onNavigateToAbout }) => {
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

  const [selectedCountry, setSelectedCountry] = useState(getCountryFromUrl());
  const currentCountry =
    countries.find((c) => c.code === selectedCountry) || countries[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountrySelect = async (countryCode: string) => {
    setIsDropdownOpen(false);

    if (countryCode === selectedCountry) return; // Already on this country

    // Show loading modal
    const country = countries.find((c) => c.code === countryCode);
    setLoadingCountry(country?.name || countryCode);

    try {
      // Simulate data fetching (the actual hook will be used in the page component)
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to the country-specific page
      const countryPath = `/${countryCode.toLowerCase()}`;
      window.location.href = countryPath;

      // Update selected country
      setSelectedCountry(countryCode);
    } catch (error) {
      console.error("Error loading country data:", error);
      setLoadingCountry(null);
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
            <Link to="/about" onClick={handleAboutClick} className="nav-link">
              About Us
            </Link>
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
