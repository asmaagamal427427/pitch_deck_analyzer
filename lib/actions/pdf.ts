'use server';

import * as pdfParse from 'pdf-parse';

export interface ParsedPdfResult {
  success: boolean;
  slides: SlideContent[];
  metadata: {
    totalPages: number;
    totalSlides: number;
    processingTime: number;
    confidence: number;
    fileSize: number;
  };
  error?: string;
}

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

export async function parsePdf(fileBuffer: Buffer, fileName: string): Promise<ParsedPdfResult> {
  const startTime = Date.now();
  
  try {
    // Parse PDF using pdf-parse
    const pdfData = await pdfParse(fileBuffer);
    
    if (!pdfData.text || pdfData.text.trim().length === 0) {
      return {
        success: false,
        slides: [],
        metadata: {
          totalPages: pdfData.numpages || 0,
          totalSlides: 0,
          processingTime: Date.now() - startTime,
          confidence: 0,
          fileSize: fileBuffer.length
        },
        error: 'No text content found in PDF. The file might be image-based or corrupted.'
      };
    }

    // Extract slides from the parsed text
    const slides = extractSlidesFromText(pdfData.text, pdfData.numpages);
    
    // Calculate overall confidence
    const avgConfidence = slides.length > 0 
      ? slides.reduce((sum, slide) => sum + slide.metadata.confidence, 0) / slides.length 
      : 0;

    const processingTime = Date.now() - startTime;

    return {
      success: true,
      slides,
      metadata: {
        totalPages: pdfData.numpages,
        totalSlides: slides.length,
        processingTime,
        confidence: Math.round(avgConfidence),
        fileSize: fileBuffer.length
      }
    };

  } catch (error) {
    console.error('PDF parsing error:', error);
    
    return {
      success: false,
      slides: [],
      metadata: {
        totalPages: 0,
        totalSlides: 0,
        processingTime: Date.now() - startTime,
        confidence: 0,
        fileSize: fileBuffer.length
      },
      error: error instanceof Error ? error.message : 'Unknown error occurred during PDF parsing'
    };
  }
}

function extractSlidesFromText(text: string, totalPages: number): SlideContent[] {
  const slides: SlideContent[] = [];
  
  // Strategy 1: Split by form feed characters (common in PDF exports)
  let slideTexts = text.split('\f').filter(slide => slide.trim().length > 0);
  
  // Strategy 2: If no form feeds, try splitting by multiple newlines
  if (slideTexts.length <= 1) {
    slideTexts = text.split(/\n\s*\n\s*\n/).filter(slide => slide.trim().length > 0);
  }
  
  // Strategy 3: If still only one section, try splitting by title patterns
  if (slideTexts.length <= 1) {
    slideTexts = text.split(/(?=^[A-Z][A-Za-z\s]{10,50}$)/m).filter(slide => slide.trim().length > 0);
  }
  
  // Strategy 4: If all else fails, estimate based on page count
  if (slideTexts.length <= 1 && totalPages > 1) {
    const avgCharsPerPage = text.length / totalPages;
    slideTexts = [];
    for (let i = 0; i < totalPages; i++) {
      const start = i * avgCharsPerPage;
      const end = (i + 1) * avgCharsPerPage;
      const slideText = text.substring(start, end).trim();
      if (slideText.length > 0) {
        slideTexts.push(slideText);
      }
    }
  }

  // Process each slide
  slideTexts.forEach((slideText, index) => {
    const slideNumber = index + 1;
    const slide = processSlideContent(slideText, slideNumber);
    slides.push(slide);
  });

  return slides;
}

function processSlideContent(text: string, slideNumber: number): SlideContent {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Extract title (usually the first substantial line)
  const title = extractTitle(lines);
  
  // Extract bullet points
  const bulletPoints = extractBulletPoints(lines);
  
  // Determine slide type based on content
  const type = determineSlideType(text, title);
  
  // Calculate confidence based on content structure
  const confidence = calculateConfidence(lines, title, bulletPoints, type);
  
  // Count words
  const wordCount = text.split(/\s+/).length;
  
  return {
    id: `slide-${slideNumber}`,
    slideNumber,
    type,
    title,
    content: text,
    bulletPoints: bulletPoints.length > 0 ? bulletPoints : undefined,
    metadata: {
      wordCount,
      hasImages: /image|figure|chart|graph/i.test(text),
      hasCharts: /chart|graph|data|revenue|growth|market size/i.test(text),
      confidence
    }
  };
}

function extractTitle(lines: string[]): string | undefined {
  // Look for title patterns in the first few lines
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i];
    
    // Skip very short lines (likely not titles)
    if (line.length < 3) continue;
    
    // Skip lines that look like bullet points
    if (/^[•\-\*\d+\.]/.test(line)) continue;
    
    // Prefer lines that are:
    // - Not too long (likely not body text)
    // - Not all caps (unless short)
    // - Have title-like characteristics
    if (line.length <= 60 && (line.length <= 20 || !/^[A-Z\s]+$/.test(line))) {
      return line;
    }
  }
  
  return undefined;
}

function extractBulletPoints(lines: string[]): string[] {
  const bulletPoints: string[] = [];
  
  for (const line of lines) {
    // Match various bullet point formats
    const bulletMatch = line.match(/^[•\-\*]\s*(.+)/) || 
                       line.match(/^\d+[\.\)]\s*(.+)/) ||
                       line.match(/^[a-zA-Z][\.\)]\s*(.+)/);
    
    if (bulletMatch && bulletMatch[1]) {
      bulletPoints.push(bulletMatch[1].trim());
    }
  }
  
  return bulletPoints;
}

function determineSlideType(text: string, title?: string): SlideType {
  const content = (text + ' ' + (title || '')).toLowerCase();
  
  // Define keywords for each slide type
  const typeKeywords = {
    title: ['welcome', 'introduction', 'company', 'startup', 'founded', 'mission'],
    problem: ['problem', 'challenge', 'issue', 'pain point', 'difficulty', 'struggle'],
    solution: ['solution', 'approach', 'how we', 'our product', 'we solve', 'innovation'],
    market: ['market', 'opportunity', 'tam', 'addressable market', 'market size', 'industry'],
    'business-model': ['business model', 'revenue', 'monetization', 'pricing', 'how we make money'],
    traction: ['traction', 'growth', 'users', 'customers', 'revenue', 'metrics', 'kpis'],
    team: ['team', 'founders', 'leadership', 'experience', 'background', 'advisors'],
    financials: ['financials', 'projections', 'forecast', 'budget', 'expenses', 'profit'],
    funding: ['funding', 'investment', 'raise', 'capital', 'investors', 'valuation'],
    competition: ['competition', 'competitors', 'competitive', 'vs', 'comparison', 'differentiation']
  };
  
  // Score each type based on keyword matches
  let bestType: SlideType = 'other';
  let bestScore = 0;
  
  for (const [type, keywords] of Object.entries(typeKeywords)) {
    const score = keywords.reduce((sum, keyword) => {
      return sum + (content.includes(keyword) ? 1 : 0);
    }, 0);
    
    if (score > bestScore) {
      bestScore = score;
      bestType = type as SlideType;
    }
  }
  
  return bestType;
}

function calculateConfidence(lines: string[], title?: string, bulletPoints?: string[], type?: SlideType): number {
  let confidence = 50; // Base confidence
  
  // Boost confidence for having a clear title
  if (title && title.length > 3 && title.length < 60) {
    confidence += 20;
  }
  
  // Boost confidence for having bullet points (structured content)
  if (bulletPoints && bulletPoints.length > 0) {
    confidence += 15;
  }
  
  // Boost confidence for reasonable content length
  if (lines.length >= 3 && lines.length <= 20) {
    confidence += 10;
  }
  
  // Boost confidence for identified slide type (not 'other')
  if (type && type !== 'other') {
    confidence += 15;
  }
  
  // Reduce confidence for very short or very long content
  if (lines.length < 2) {
    confidence -= 20;
  } else if (lines.length > 30) {
    confidence -= 10;
  }
  
  return Math.max(0, Math.min(100, confidence));
}