import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Breadcrumbs.css';

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  if (items.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb navigation">
      <ol className="breadcrumbs-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="breadcrumb-item">
              {!isLast && item.path ? (
                <>
                  <Link to={item.path} className="breadcrumb-link">
                    {item.icon && <i className={item.icon}></i>}
                    <span>{item.label}</span>
                  </Link>
                  <span className="breadcrumb-separator">
                    <i className="fas fa-chevron-right"></i>
                  </span>
                </>
              ) : (
                <span className="breadcrumb-current" aria-current="page">
                  {item.icon && <i className={item.icon}></i>}
                  <span>{item.label}</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
