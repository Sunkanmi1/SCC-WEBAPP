import React from 'react';
import { Case } from '../App';
import '../styles/CaseCard.css';

interface CaseCardProps {
  case: Case;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onAddToCollection?: () => void;
  onRemoveFromCollection?: () => void;
}

const CaseCard: React.FC<CaseCardProps> = ({ 
  case: caseItem,
  isBookmarked = false,
  onToggleBookmark,
  onAddToCollection,
  onRemoveFromCollection
}) => {
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
    <div className={`case-card ${isBookmarked ? 'bookmarked' : ''}`}>
      {/* Bookmark Actions */}
      {(onToggleBookmark || onAddToCollection || onRemoveFromCollection) && (
        <div className="case-card-actions">
          {onToggleBookmark && (
            <button 
              className={`card-action-btn bookmark-btn ${isBookmarked ? 'active' : ''}`}
              onClick={onToggleBookmark}
              title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              <i className={`${isBookmarked ? 'fas' : 'far'} fa-bookmark`}></i>
            </button>
          )}
          {onAddToCollection && (
            <button 
              className="card-action-btn collection-btn"
              onClick={onAddToCollection}
              title="Add to collection"
              aria-label="Add to collection"
            >
              <i className="fas fa-folder-plus"></i>
            </button>
          )}
          {onRemoveFromCollection && (
            <button 
              className="card-action-btn remove-btn"
              onClick={onRemoveFromCollection}
              title="Remove from collection"
              aria-label="Remove from collection"
            >
              <i className="fas fa-folder-minus"></i>
            </button>
          )}
        </div>
      )}

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
            <i className="fas fa-quote-left"></i>
            Citation
          </label>
          <p className="field-value">{caseItem.citation}</p>
        </div>

        <div className="case-field">
          <label className="field-label">
            <i className="fas fa-building"></i>
            Court
          </label>
          <p className="field-value">{caseItem.court}</p>
        </div>

        <div className="case-field">
          <label className="field-label">
            <i className="fas fa-users"></i>
            Judges
          </label>
          <p className="field-value">{caseItem.judges}</p>
        </div>

        <div className="case-field">
          <label className="field-label">
            <i className="fas fa-gavel"></i>
            Majority Opinion
          </label>
          <p className="field-value">{caseItem.majorityOpinion}</p>
        </div>

        <div className="case-field">
          <label className="field-label">
            <i className="fas fa-book"></i>
            Source
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
