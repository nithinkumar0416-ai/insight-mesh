import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

export async function parseDocumentContent(fileBuffer, mimeType, filename) {
  try {
    let rawText = '';
    
    if (mimeType === 'application/pdf' || filename.endsWith('.pdf')) {
      const parsed = await pdfParse(fileBuffer);
      rawText = parsed.text || '';
    } else {
      // Plain text, markdown, or json
      rawText = fileBuffer.toString('utf-8');
    }

    // Clean up excessive whitespace while preserving paragraph breaks
    const cleanedText = rawText
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Segment text into structured paragraphs with citations
    const paragraphs = cleanedText
      .split('\n\n')
      .map((p, index) => ({
        id: `p-${index + 1}`,
        paragraphNumber: index + 1,
        approxPage: Math.floor(index / 4) + 1,
        text: p.trim()
      }))
      .filter(p => p.text.length > 20);

    return {
      rawText: cleanedText,
      paragraphs,
      characterCount: cleanedText.length,
      wordCount: cleanedText.split(/\s+/).length
    };
  } catch (error) {
    console.error('Document parsing error:', error);
    const fallbackText = fileBuffer.toString('utf-8', 0, 10000);
    return {
      rawText: fallbackText || 'Unparseable binary format',
      paragraphs: [{ id: 'p-1', paragraphNumber: 1, approxPage: 1, text: fallbackText || 'Unparseable binary format' }],
      characterCount: fallbackText.length,
      wordCount: fallbackText.split(/\s+/).length
    };
  }
}
