// Core type definitions for the pitch deck analyzer

export interface SlideContent {
  id: string;
  slideNumber: number;
  type: SlideType;
  title?: string;
  content: string;
  bulletPoints?: string[];
  imageUrls?: string[];
  metadata: {
    wordCount: number;
    hasImages: boolean;
    hasCharts: boolean;
    confidence: number;
  };
}

export interface PitchDeck {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'pptx' | 'ppt';
  uploadedAt: Date;
  slides: SlideContent[];
  totalSlides: number;
  metadata: {
    fileSize: number;
    processingTime?: number;
    version: string;
  };
}

export interface AnalysisResult {
  deckId: string;
  overallScore: number;
  analysisDate: Date;
  slideAnalyses: SlideAnalysis[];
  recommendations: Recommendation[];
  frameworkCompliance: FrameworkScore[];
  summary: {
    strengths: string[];
    weaknesses: string[];
    priorities: string[];
  };
}

export interface SlideAnalysis {
  slideId: string;
  slideNumber: number;
  scores: {
    clarity: number;
    impact: number;
    structure: number;
    visual: number;
    overall: number;
  };
  feedback: string;
  suggestions: string[];
  issues: Issue[];
}

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  category: 'content' | 'structure' | 'visual' | 'flow';
  title: string;
  description: string;
  example?: string;
  slideNumbers: number[];
}

export interface FrameworkScore {
  framework: 'yc' | 'sequoia' | 'general';
  score: number;
  criteria: {
    name: string;
    score: number;
    feedback: string;
  }[];
}

export interface Issue {
  type: 'error' | 'warning' | 'suggestion';
  message: string;
  line?: number;
  severity: number;
}

export type SlideType = 
  | 'title'
  | 'problem'
  | 'solution' 
  | 'market'
  | 'business-model'
  | 'traction'
  | 'team'
  | 'financials'
  | 'funding'
  | 'competition'
  | 'other';

export interface UploadProgress {
  stage: 'uploading' | 'parsing' | 'analyzing' | 'complete' | 'error';
  progress: number;
  message: string;
  error?: string;
}

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'pptx';
  includeScores: boolean;
  includeRecommendations: boolean;
  includeExamples: boolean;
  template: 'detailed' | 'summary' | 'executive';
}