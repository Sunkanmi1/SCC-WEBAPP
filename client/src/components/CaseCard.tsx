import React, { useRef, useState } from "react";
import { Case } from "../App";
import Tooltip from "./Tooltip";
import html2pdf from "html2pdf.js";
import "../styles/CaseCard.css";

interface CaseCardProps {
  case: Case;
}

const CaseCard: React.FC<CaseCardProps> = ({ case: caseItem }) => {
  const caseRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  // Copy citation to clipboard
  const handleCopyCitation = () => {
    navigator.clipboard.writeText(caseItem.citation || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Export to PDF
  const handleExportPDF = () => {
    if (!caseRef.current) return;
    const opt = {
      margin: 10,
      filename: `${caseItem.caseId || "case"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf()
      .set({
        margin: 10,
        filename: `${caseItem.caseId || "case"}.pdf`,
        image: { type: "jpeg" as "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(caseRef.current!)
      .save();
  };

  // Print
  const handlePrint = () => {
    if (!caseRef.current) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(
      "<html><head><title>Print Case</title></head><body>"
    );
    printWindow.document.write(caseRef.current.innerHTML);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="case-card">
      <div ref={caseRef}>
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

          {caseItem.description &&
            caseItem.description !== "No description available" && (
              <div className="case-field">
                <label className="field-label">
                  <i className="fas fa-info-circle"></i>
                  Description
                </label>
                <p className="field-value description">
                  {caseItem.description}
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Action buttons below card body, above footer */}

      {caseItem.articleUrl && (
        <div className="case-card-actions-wrapper">
          <div className="primary-action">
            <a
              href={caseItem.articleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="view-details-btn"
            >
              <div className="btn-content">
                <i className="fas fa-external-link-alt"></i>
                <span>View Full Details</span>
              </div>
            </a>
          </div>

          <div className="secondary-actions">
            <div className="action-group">
              <button
                onClick={handleCopyCitation}
                className="action-btn"
                aria-label="Copy Citation"
                data-tooltip="Copy APA citation"
              >
                <svg
                  className="action-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="9"
                    y="9"
                    width="13"
                    height="13"
                    rx="2"
                    ry="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5 15H4C2.89543 15 2 14.1046 2 13V4C2 2.89543 2.89543 2 4 2H13C14.1046 2 15 2.89543 15 4V5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="btn-text">Citation</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="action-btn"
                aria-label="Export to PDF"
                data-tooltip="Export as PDF document"
              >
                <svg
                  className="action-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 2V8H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 13H8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M16 17H8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 9H9H8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="btn-text">PDF</span>
              </button>

              <button
                onClick={handlePrint}
                className="action-btn"
                aria-label="Print"
                data-tooltip="Print case study"
              >
                <svg
                  className="action-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 9V2H18V9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 18H4C2.89543 18 2 17.1046 2 16V11C2 9.89543 2.89543 9 4 9H20C21.1046 9 22 9.89543 22 11V16C22 17.1046 21.1046 18 20 18H18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M18 14H6V22H18V14Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="btn-text">Print</span>
              </button>

              <button
                onClick={() => {
                  const url = `${window.location.origin}/case/${caseItem.caseId}`;
                  navigator.clipboard.writeText(url);
                  // Show a subtle notification instead of alert
                  alert("Link copied to clipboard");
                }}
                className="action-btn"
                aria-label="Copy Link"
                data-tooltip="Copy case link"
              >
                <svg
                  className="action-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.0552 14.413 2.55918 13.47 3.47L11.75 5.18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 11C13.5705 10.4259 13.0226 9.95085 12.3934 9.60705C11.7642 9.26325 11.0685 9.05889 10.3533 9.00768C9.63816 8.95647 8.92037 9.05966 8.24861 9.31022C7.57685 9.56078 6.96688 9.95296 6.46 10.46L3.46 13.46C2.54921 14.403 2.04524 15.666 2.05663 16.977C2.06802 18.288 2.59387 19.5421 3.52091 20.4691C4.44795 21.3962 5.70201 21.922 7.013 21.9334C8.32398 21.9448 9.58699 21.4408 10.53 20.53L12.24 18.82"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="btn-text">Link</span>
              </button>
            </div>

            {/* Social Sharing */}
            <div className="social-share-group">
              <span className="share-label">Share:</span>
              <div className="social-icons">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    window.location.origin + "/case/" + caseItem.caseId
                  )}&text=${encodeURIComponent(caseItem.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon twitter"
                  aria-label="Share on Twitter"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>

                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                    window.location.origin + "/case/" + caseItem.caseId
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon linkedin"
                  aria-label="Share on LinkedIn"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    caseItem.title +
                      " " +
                      window.location.origin +
                      "/case/" +
                      caseItem.caseId
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-icon whatsapp"
                  aria-label="Share on WhatsApp"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.76.982.998-3.677-.236-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.899 6.988c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseCard;
