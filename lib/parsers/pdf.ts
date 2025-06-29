import * as pdfParse from 'pdf-parse';
import { SlideContent } from '@/types';

export interface ParsedPdfResult {
  slides: SlideContent[];
  metadata: {
    totalPages: number;
    totalWords: number;
    processingTime: number;
    title?: string;
    author?: string;
  };
}

/**
 * Parse PDF file and extract slide content
 * @param buffer - PDF file as ArrayBuffer
 * @returns Promise<ParsedPdfResult>
 */
export async function parsePdf(buffer: ArrayBuffer): Promise<ParsedPdfResult> {
  const startTime = Date.now();
  
  try {
    // Convert ArrayBuffer to Buffer for pdf-parse
    const pdfBuffer = Buffer.from(buffer);
    
    // Parse the PDF
    const data = await pdfParse(pdfBuffer);
    
    // Split content by pages (pdf-parse doesn't provide page-by-page text by default)
    // We'll use a heuristic approach to split content into slides
    const slides = await extractSlidesFromText(data.text, data.numpages);
    
    const processingTime = Date.now() - startTime;
    
    return {
      slides,
      metadata: {
        totalPages: data.numpages,
        totalWords: data.text.split(/\s+/).length,
        processingTime,
        title: data.info?.Title || undefined,
        author: data.info?.Author || undefined,
      }
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error(`Failed to parse PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Extract individual slides from PDF text content
 * Uses heuristics to identify slide boundaries
 */
async function extractSlidesFromText(text: string, totalPages: number): Promise<SlideContent[]> {
  const slides: SlideContent[] = [];
  
  // Clean up the text
  const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Split by common slide separators or page breaks
  const sections = splitIntoSections(cleanText, totalPages);
  
  sections.forEach((section, index) => {
    const slideNumber = index + 1;
    const content = section.trim();
    
    if (content.length === 0) return;
    
    // Extract title (first line that looks like a title)
    const title = extractSlideTitle(content);
    
    // Extract bullet points
    const bulletPoints = extractBulletPoints(content);
    
    // Calculate metadata
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    
    // Detect slide type based on content
    const type = detectSlideType(content, title);
    
    const slide: SlideContent = {
      id: `slide-${slideNumber}`,
      slideNumber,
      type,
      title,
      content,
      bulletPoints: bulletPoints.length > 0 ? bulletPoints : undefined,
      imageUrls: [], // PDF parsing doesn't extract images yet
      metadata: {
        wordCount,
        hasImages: false, // Will be enhanced later
        hasCharts: detectCharts(content),
        confidence: calculateConfidence(content, wordCount)
      }
    };
    
    slides.push(slide);
  });
  
  return slides;
}

/**
 * Split text into sections that likely represent individual slides
 */
function splitIntoSections(text: string, totalPages: number): string[] {
  // Try different splitting strategies
  
  // Strategy 1: Split by form feed characters (page breaks)
  let sections = text.split('\f').filter(section => section.trim().length > 0);
  
  // Strategy 2: If we don't have enough sections, try splitting by multiple newlines
  if (sections.length < totalPages / 2) {
    sections = text.split(/\n\s*\n\s*\n/).filter(section => section.trim().length > 0);
  }
  
  // Strategy 3: If still not enough, try splitting by lines that look like titles
  if (sections.length < totalPages / 2) {
    const lines = text.split('\n');
    const titleIndices: number[] = [];
    
    lines.forEach((line, index) => {
      if (looksLikeTitle(line.trim())) {
        titleIndices.push(index);
      }
    });
    
    if (titleIndices.length > 1) {
      sections = [];
      for (let i = 0; i < titleIndices.length; i++) {
        const start = titleIndices[i];
        const end = titleIndices[i + 1] || lines.length;
        const section = lines.slice(start, end).join('\n');
        if (section.trim().length > 0) {
          sections.push(section);
        }
      }
    }
  }
  
  // Fallback: Split text into roughly equal parts based on page count
  if (sections.length === 0) {
    const wordsPerPage = Math.ceil(text.split(/\s+/).length / totalPages);
    const words = text.split(/\s+/);
    
    for (let i = 0; i < totalPages; i++) {
      const start = i * wordsPerPage;
      const end = Math.min((i + 1) * wordsPerPage, words.length);
      const section = words.slice(start, end).join(' ');
      if (section.trim().length > 0) {
        sections.push(section);
      }
    }
  }
  
  return sections;
}

/**
 * Extract the title from slide content
 */
function extractSlideTitle(content: string): string | undefined {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  if (lines.length === 0) return undefined;
  
  // First line is often the title
  const firstLine = lines[0];
  
  // Check if it looks like a title (not too long, not a bullet point, etc.)
  if (looksLikeTitle(firstLine)) {
    return firstLine;
  }
  
  // Look for other title-like lines
  for (const line of lines.slice(0, 3)) { // Check first 3 lines
    if (looksLikeTitle(line)) {
      return line;
    }
  }
  
  return undefined;
}

/**
 * Check if a line looks like a title
 */
function looksLikeTitle(line: string): boolean {
  if (!line || line.length === 0) return false;
  
  // Title characteristics
  const isTooLong = line.length > 100;
  const isBulletPoint = /^[\s]*[-•*]\s/.test(line);
  const isNumber = /^\d+\.?\s/.test(line);
  const hasEndPunctuation = /[.!?]$/.test(line.trim());
  const isAllCaps = line === line.toUpperCase() && line.length > 3;
  const hasReasonableLength = line.length >= 3 && line.length <= 80;
  
  return hasReasonableLength && !isTooLong && !isBulletPoint && !isNumber && (!hasEndPunctuation || isAllCaps);
}

/**
 * Extract bullet points from content
 */
function extractBulletPoints(content: string): string[] {
  const lines = content.split('\n');
  const bulletPoints: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Match various bullet point formats
    const bulletMatch = trimmed.match(/^[\s]*[-•*▪▫◦‣⁃]\s*(.+)$/);
    const numberMatch = trimmed.match(/^[\s]*\d+\.?\s+(.+)$/);
    
    if (bulletMatch && bulletMatch[1]) {
      bulletPoints.push(bulletMatch[1].trim());
    } else if (numberMatch && numberMatch[1]) {
      bulletPoints.push(numberMatch[1].trim());
    }
  }
  
  return bulletPoints;
}

/**
 * Detect slide type based on content
 */
function detectSlideType(content: string, title?: string): SlideContent['type'] {
  const lowerContent = content.toLowerCase();
  const lowerTitle = title?.toLowerCase() || '';
  
  // Title slide indicators
  if (lowerTitle.includes('welcome') || lowerTitle.includes('introduction') || 
      lowerContent.includes('company name') || lowerContent.includes('founded')) {
    return 'title';
  }
  
  // Problem slide indicators
  if (lowerTitle.includes('problem') || lowerTitle.includes('challenge') ||
      lowerContent.includes('pain point') || lowerContent.includes('current situation')) {
    return 'problem';
  }
  
  // Solution slide indicators
  if (lowerTitle.includes('solution') || lowerTitle.includes('approach') ||
      lowerContent.includes('our solution') || lowerContent.includes('we solve')) {
    return 'solution';
  }
  
  // Market slide indicators
  if (lowerTitle.includes('market') || lowerTitle.includes('opportunity') ||
      lowerContent.includes('market size') || lowerContent.includes('tam')) {
    return 'market';
  }
  
  // Business model indicators
  if (lowerTitle.includes('business model') || lowerTitle.includes('revenue') ||
      lowerContent.includes('pricing') || lowerContent.includes('monetization')) {
    return 'business-model';
  }
  
  // Team slide indicators
  if (lowerTitle.includes('team') || lowerTitle.includes('founder') ||
      lowerContent.includes('ceo') || lowerContent.includes('experience')) {
    return 'team';
  }
  
  // Traction indicators
  if (lowerTitle.includes('traction') || lowerTitle.includes('growth') ||
      lowerContent.includes('customers') || lowerContent.includes('revenue')) {
    return 'traction';
  }
  
  // Financial indicators
  if (lowerTitle.includes('financial') || lowerTitle.includes('projection') ||
      lowerContent.includes('forecast') || lowerContent.includes('budget')) {
    return 'financials';
  }
  
  // Funding indicators
  if (lowerTitle.includes('funding') || lowerTitle.includes('investment') ||
      lowerContent.includes('raise') || lowerContent.includes('capital')) {
    return 'funding';
  }
  
  // Competition indicators
  if (lowerTitle.includes('competition') || lowerTitle.includes('competitor') ||
      lowerContent.includes('vs') || lowerContent.includes('competitive')) {
    return 'competition';
  }
  
  return 'other';
}

/**
 * Detect if content mentions charts or graphs
 */
function detectCharts(content: string): boolean {
  const lowerContent = content.toLowerCase();
  const chartKeywords = ['chart', 'graph', 'diagram', 'figure', 'table', 'data', 'statistics', 'metrics'];
  
  return chartKeywords.some(keyword => lowerContent.includes(keyword));
}

/**
 * Calculate confidence score for the parsing
 */
function calculateConfidence(content: string, wordCount: number): number {
  let confidence = 0.5; // Base confidence
  
  // More words generally means better extraction
  if (wordCount > 50) confidence += 0.2;
  if (wordCount > 100) confidence += 0.1;
  
  // Presence of structure indicators
  if (content.includes('\n')) confidence += 0.1;
  if (/[-•*]/.test(content)) confidence += 0.1; // Has bullet points
  if (/\d+\./.test(content)) confidence += 0.1; // Has numbered lists
  
  // Penalize very short or very long content
  if (wordCount < 10) confidence -= 0.2;
  if (wordCount > 500) confidence -= 0.1;
  
  return Math.max(0, Math.min(1, confidence));
}