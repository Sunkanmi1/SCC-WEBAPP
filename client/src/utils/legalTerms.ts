// Legal terms and their explanations

export interface LegalTerm {
  term: string;
  explanation: string;
}

export const LEGAL_TERMS: Record<string, string> = {
  'citation': 'A legal citation is the standardized reference to a legal case, statute, or other source. It helps identify and locate the specific legal document.',
  'judges': 'The judges or justices who presided over the case and made the legal decision. In Supreme Court cases, multiple judges typically sit on the panel.',
  'court': 'The court that heard and decided the case. The Supreme Court is the highest court in the judicial system.',
  'date': 'The date when the court issued its decision or judgment in the case.',
  'majority opinion': 'The official opinion of the court representing the view of the majority of judges. This becomes the binding precedent.',
  'description': 'A brief summary of what the case is about, including the legal issues and parties involved.',
  'source': 'The publication or database where the full case details can be found.',
  'case title': 'The name of the case, typically formatted as "Plaintiff vs. Defendant" or "Appellant vs. Respondent".',
};

export const getLegalTermExplanation = (term: string): string => {
  const normalizedTerm = term.toLowerCase().trim();
  return LEGAL_TERMS[normalizedTerm] || '';
};
