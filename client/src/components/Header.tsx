import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Globe } from "lucide-react";

import ThemeToggle from "./ThemeToggle";
import CountryNav from "./CountryNav";
import LoadingModal from "./LoadingModal";
import "../styles/Header.css";

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface HeaderProps {
  showBackButton?: boolean;
  onBackClick?: () => void;
  currentCountryCode?: string;
  onNavigateToAbout?: () => void;
}

const countries: Country[] = [
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
];

const Header: React.FC<HeaderProps> = ({
  showBackButton = false,
  onBackClick,
  currentCountryCode,
  onNavigateToAbout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loadingCountry, setLoadingCountry] = useState<string | null>(null);

  const getCountryFromUrl = (): string => {
    if (currentCountryCode) return currentCountryCode;
    const match = location.pathname.match(/^\/(gh|ng|ke)$/i);
    return match ? match[1].toUpperCase() : "GH";
  };

  const [selectedCountry, setSelectedCountry] = useState(getCountryFromUrl);

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
    if (countryCode === selectedCountry) return;

    const country = countries.find((c) => c.code === countryCode);
    setLoadingCountry(country?.name || countryCode);

    try {
      await new Promise((res) => setTimeout(res, 1500));
      window.location.href = `/${countryCode.toLowerCase()}`;
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCountry(null);
      setSelectedCountry(countryCode);
    }
  };

  const handleBackClick = () => {
    onBackClick ? onBackClick() : navigate(-1);
  };

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

          <div className="country-selector" ref={dropdownRef}>
            <button
              className="country-button active-country"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-expanded={isDropdownOpen}
            >
              <Globe size={18} className="globe-icon" />
              <span className="country-flag">{currentCountry.flag}</span>
              <span className="country-name">{currentCountry.name}</span>
              <i
                className={`fas fa-chevron-down dropdown-arrow ${
                  isDropdownOpen ? "open" : ""
                }`}
              />
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
                      <i className="fas fa-check check-icon" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="nav-right">
          <Link to="/statistics"> Dashbord</Link>
          <CountryNav currentCountry={currentCountry.code} />
          {!showBackButton && (
            <Link to="/about" className="nav-link">
              About Us
            </Link>
          )}

          {showBackButton && (
            <button onClick={handleBackClick} className="back-button">
              <i className="fas fa-arrow-left" />
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
