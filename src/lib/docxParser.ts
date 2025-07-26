import mammoth from 'mammoth';

// Extract text from DOCX using mammoth
const extractDocxTextWithLibrary = async (file: File): Promise<string> => {
    try {
        // Convert File to ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Extract text using mammoth
        const result = await mammoth.extractRawText({ arrayBuffer });

        // Clean up the text
        const cleanedText = result.value
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .replace(/\n\s*\n/g, '\n') // Replace multiple newlines with single newline
            .trim();

        console.log(`DOCX parsed successfully. Extracted ${cleanedText.length} characters.`);
        return cleanedText;
    } catch (error) {
        console.error('Error extracting DOCX text:', error);
        throw new Error('Failed to extract text from DOCX file. Please ensure it\'s a valid DOCX document.');
    }
};

export const extractDocxText = async (file: File): Promise<string> => {
    try {
        // Check file size (limit to 10MB)
        if (file.size > 10 * 1024 * 1024) {
            throw new Error('DOCX file is too large. Please upload a file smaller than 10MB.');
        }

        // Check file type
        if (!file.type.includes('docx') && !file.name.toLowerCase().endsWith('.docx')) {
            throw new Error('Please upload a valid DOCX file.');
        }

        // Extract text using mammoth
        const content = await extractDocxTextWithLibrary(file);

        // Check if we extracted any meaningful text
        if (content.length < 10) {
            throw new Error('Could not extract meaningful text from the DOCX. The file might be corrupted or empty.');
        }

        // Additional validation: check if the content looks like a resume
        const resumeKeywords = ['experience', 'education', 'skills', 'work', 'job', 'position', 'company', 'university', 'degree'];
        const hasResumeContent = resumeKeywords.some(keyword =>
            content.toLowerCase().includes(keyword)
        );

        if (!hasResumeContent) {
            console.warn('DOCX content may not be a resume - continuing anyway');
        }

        console.log('DOCX processed successfully with mammoth');
        return content;
    } catch (error) {
        console.error('Error processing DOCX:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to process DOCX file. Please ensure it\'s a valid DOCX document.');
    }
};

export const extractDocxTextWithMetadata = async (file: File): Promise<{
    text: string;
    pages: number;
    info: any;
}> => {
    try {
        // Extract text using mammoth
        const content = await extractDocxTextWithLibrary(file);

        return {
            text: content,
            pages: 1, // mammoth doesn't provide page count, so we'll use 1 as default
            info: {
                title: file.name,
                author: 'Unknown',
                subject: 'Resume',
                size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
            }
        };
    } catch (error) {
        console.error('Error processing DOCX:', error);
        throw new Error('Failed to process DOCX file. Please ensure it\'s a valid DOCX document.');
    }
}; 