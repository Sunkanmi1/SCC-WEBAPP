import React from 'react';
import { Case } from '../App';
import Tooltip from './Tooltip';
import '../styles/CaseCard.css';

interface CaseCardProps {
  case: Case;
}

const CaseCard: React.FC<CaseCardProps> = ({ case: caseItem }) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="case-card">
      <div className="case-card-header">
        <h3 className="case-title">{caseItem.title}</h3>
        <div className="case-date">
          <i className="fas fa-calendar-alt"></i>
          <span>{formatDate(caseItem.date)}</span>
        </div>
      </div>

      <div className="case-card-body">
        <div className="case-field">
          <label className="field-label">
            <i className="fas fa-bookmark"></i>
            Citation
            <Tooltip content="A legal citation is the standardized reference to a legal case. It helps identify and locate the specific legal document.">
              <span className="tooltip-icon">
                <i className="fas fa-question-circle"></i>
              </span>
            </Tooltip>
          </label>
          <p className="field-value">{caseItem.citation}</p>
        </div>

        <div className="case-field">
          <label className="field-label">
            <i className="fas fa-building"></i>
            Court
            <Tooltip content="The court that heard and decided the case. The Supreme Court is the highest court in the judicial system.">
              <span className="tooltip-icon">
                <i className="fas fa-question-circle"></i>
              </span>
            </Tooltip>
          </label>
          <p className="field-value">{caseItem.court}</p>
        </div>

        <div className="case-field">
          <label className="field-label">
            <i className="fas fa-users"></i>
            Judges
            <Tooltip content="The judges or justices who presided over the case and made the legal decision. Multiple judges typically sit on Supreme Court panels.">
              <span className="tooltip-icon">
                <i className="fas fa-question-circle"></i>
              </span>
            </Tooltip>
          </label>
          <p className="field-value">{caseItem.judges}</p>
        </div>

        <div className="case-field">
          <label className="field-label">
            <i className="fas fa-gavel"></i>
            Majority Opinion
            <Tooltip content="The official opinion of the court representing the view of the majority of judges. This becomes the binding legal precedent.">
              <span className="tooltip-icon">
                <i className="fas fa-question-circle"></i>
              </span>
            </Tooltip>
          </label>
          <p className="field-value">{caseItem.majorityOpinion}</p>
        </div>

        <div className="case-field">
          <label className="field-label">
            <i className="fas fa-book"></i>
            Source
            <Tooltip content="The publication or database where the full case details can be found.">
              <span className="tooltip-icon">
                <i className="fas fa-question-circle"></i>
              </span>
            </Tooltip>
          </label>
          <p className="field-value">{caseItem.sourceLabel}</p>
        </div>

        {caseItem.description && caseItem.description !== 'No description available' && (
          <div className="case-field">
            <label className="field-label">
              <i className="fas fa-info-circle"></i>
              Description
            </label>
            <p className="field-value description">{caseItem.description}</p>
          </div>
        )}
      </div>

      {caseItem.articleUrl && (
        <div className="case-card-footer">
          <a 
            href={caseItem.articleUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="external-link"
          >
            <i className="fas fa-external-link-alt"></i>
            <span>View Details</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default CaseCard;
