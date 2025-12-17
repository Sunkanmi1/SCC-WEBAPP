import React from "react";
import { Loader2 } from "lucide-react";
import "../styles/LoadingModal.css";

interface LoadingModalProps {
  isOpen: boolean;
  countryName: string;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen, countryName }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Loader2 className="spinner" size={48} />
        <h3 className="modal-title">
          Loading {countryName} Supreme Court Cases
        </h3>
        <p className="modal-text">Please wait while we fetch the data...</p>
      </div>
    </div>
  );
};

export default LoadingModal;
