import { NextRequest, NextResponse } from 'next/server';
import { parsePdf } from '@/lib/parsers/pdf';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are supported' },
        { status: 400 }
      );
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Parse the PDF
    const parsedResult = await parsePdf(arrayBuffer);
    
    return NextResponse.json({
      success: true,
      data: parsedResult
    });

  } catch (error) {
    console.error('PDF parsing API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to parse PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}