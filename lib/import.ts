export interface GoodreadsBook {
  id: string;
  title: string;
  author: string;
  authorLF?: string;
  additionalAuthors?: string;
  isbn?: string;
  isbn13?: string;
  rating: number;
  averageRating?: number;
  publisher?: string;
  binding?: string;
  pages?: number;
  yearPublished?: number;
  originalPublicationYear?: number;
  dateRead?: string;
  dateAdded?: string;
  bookshelves?: string[];
  exclusiveShelf: 'read' | 'currently-reading' | 'to-read' | string;
  review?: string;
  recommendedFor?: string;
  recommendedBy?: string;
  owned?: boolean;
}

export interface ImportProgress {
  total: number;
  processed: number;
  matched: number;
  skipped: number;
  errors: number;
}

export interface ImportResult {
  success: boolean;
  books: GoodreadsBook[];
  progress: ImportProgress;
  errors: string[];
  matchedCreators: MatchedCreator[];
}

export interface MatchedCreator {
  bookTitle: string;
  author: string;
  creatorId?: string;
  creatorName?: string;
  confidence: 'high' | 'medium' | 'low';
}

// Parse Goodreads CSV export
export function parseGoodreadsCSV(csvText: string): { books: GoodreadsBook[]; errors: string[] } {
  const books: GoodreadsBook[] = [];
  const errors: string[] = [];

  try {
    // Split by newlines and handle quoted fields
    const lines = parseCSVLines(csvText);
    
    if (lines.length < 2) {
      return { books: [], errors: ['CSV file is empty or has no data rows'] };
    }

    // Parse header
    const headers = parseCSVLine(lines[0]);
    
    // Map Goodreads column names to our fields
    const columnMap: Record<string, string> = {
      'Book Id': 'id',
      'Title': 'title',
      'Author': 'author',
      'Author l-f': 'authorLF',
      'Additional Authors': 'additionalAuthors',
      'ISBN': 'isbn',
      'ISBN13': 'isbn13',
      'My Rating': 'rating',
      'Average Rating': 'averageRating',
      'Publisher': 'publisher',
      'Binding': 'binding',
      'Number of Pages': 'pages',
      'Year Published': 'yearPublished',
      'Original Publication Year': 'originalPublicationYear',
      'Date Read': 'dateRead',
      'Date Added': 'dateAdded',
      'Bookshelves': 'bookshelves',
      'Exclusive Shelf': 'exclusiveShelf',
      'My Review': 'review',
      'Recommended For': 'recommendedFor',
      'Recommended By': 'recommendedBy',
      'Owned Copies': 'owned',
    };

    // Parse data rows
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = parseCSVLine(lines[i]);
        if (values.length === 0 || values.every(v => !v.trim())) continue;

        const book: Partial<GoodreadsBook> = {};
        
        headers.forEach((header, index) => {
          const key = columnMap[header];
          const value = values[index]?.trim() || '';
          
          if (key && value) {
            switch (key) {
              case 'id':
                book.id = value;
                break;
              case 'title':
                book.title = cleanTitle(value);
                break;
              case 'author':
                book.author = value;
                break;
              case 'authorLF':
                book.authorLF = value;
                break;
              case 'additionalAuthors':
                book.additionalAuthors = value;
                break;
              case 'isbn':
                book.isbn = value.replace(/["=]/g, '');
                break;
              case 'isbn13':
                book.isbn13 = value.replace(/["=]/g, '');
                break;
              case 'rating':
                book.rating = parseFloat(value) || 0;
                break;
              case 'averageRating':
                book.averageRating = parseFloat(value) || undefined;
                break;
              case 'publisher':
                book.publisher = value;
                break;
              case 'binding':
                book.binding = value;
                break;
              case 'pages':
                book.pages = parseInt(value) || undefined;
                break;
              case 'yearPublished':
                book.yearPublished = parseInt(value) || undefined;
                break;
              case 'originalPublicationYear':
                book.originalPublicationYear = parseInt(value) || undefined;
                break;
              case 'dateRead':
                book.dateRead = value;
                break;
              case 'dateAdded':
                book.dateAdded = value;
                break;
              case 'bookshelves':
                book.bookshelves = value.split(',').map(s => s.trim()).filter(Boolean);
                break;
              case 'exclusiveShelf':
                book.exclusiveShelf = value as GoodreadsBook['exclusiveShelf'];
                break;
              case 'review':
                book.review = value;
                break;
              case 'recommendedFor':
                book.recommendedFor = value;
                break;
              case 'recommendedBy':
                book.recommendedBy = value;
                break;
              case 'owned':
                book.owned = value === '1' || value.toLowerCase() === 'true';
                break;
            }
          }
        });

        // Ensure required fields
        if (book.id && book.title) {
          // Set default exclusiveShelf if missing
          if (!book.exclusiveShelf) {
            book.exclusiveShelf = 'read';
          }
          books.push(book as GoodreadsBook);
        }
      } catch (err) {
        errors.push(`Error parsing row ${i}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  } catch (err) {
    errors.push(`Failed to parse CSV: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }

  return { books, errors };
}

// Parse CSV handling quoted fields with commas
function parseCSVLines(text: string): string[] {
  const lines: string[] = [];
  let currentLine = '';
  let insideQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentLine += '"';
        i++; // Skip next quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === '\n' && !insideQuotes) {
      lines.push(currentLine);
      currentLine = '';
    } else if (char === '\r' && !insideQuotes) {
      // Skip carriage return
    } else {
      currentLine += char;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let insideQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
}

// Clean book titles (remove series info, etc.)
function cleanTitle(title: string): string {
  // Remove series info like "(The Hunger Games, #1)"
  return title.replace(/\s*\([^)]*#\d+[^)]*\)\s*$/, '').trim();
}

// Match books to creators in our database
import { creators, Creator } from './data';

export function matchBooksToCreators(books: GoodreadsBook[]): MatchedCreator[] {
  const matches: MatchedCreator[] = [];
  
  for (const book of books) {
    const authorLower = book.author.toLowerCase();
    let bestMatch: { creator: Creator; confidence: 'high' | 'medium' | 'low' } | null = null;
    
    for (const creator of creators) {
      const creatorNameLower = creator.name.toLowerCase();
      
      // High confidence: exact match
      if (authorLower === creatorNameLower) {
        bestMatch = { creator, confidence: 'high' };
        break;
      }
      
      // High confidence: author is in creator name
      if (creatorNameLower.includes(authorLower) || authorLower.includes(creatorNameLower)) {
        bestMatch = { creator, confidence: 'high' };
        break;
      }
      
      // Medium confidence: last name match
      const authorLastName = authorLower.split(' ').pop();
      const creatorLastName = creatorNameLower.split(' ').pop();
      if (authorLastName === creatorLastName && authorLastName && authorLastName.length > 2) {
        bestMatch = { creator, confidence: 'medium' };
      }
    }
    
    matches.push({
      bookTitle: book.title,
      author: book.author,
      creatorId: bestMatch?.creator.id,
      creatorName: bestMatch?.creator.name,
      confidence: bestMatch?.confidence || 'low',
    });
  }
  
  return matches;
}

// Simulate import process with progress
export async function* importBooksWithProgress(
  books: GoodreadsBook[],
  onProgress?: (progress: ImportProgress) => void
): AsyncGenerator<ImportProgress, ImportResult, unknown> {
  const progress: ImportProgress = {
    total: books.length,
    processed: 0,
    matched: 0,
    skipped: 0,
    errors: 0,
  };
  
  const errors: string[] = [];
  const matchedCreators: MatchedCreator[] = [];
  
  // Process in batches
  const BATCH_SIZE = 10;
  const batches = Math.ceil(books.length / BATCH_SIZE);
  
  for (let batchIndex = 0; batchIndex < batches; batchIndex++) {
    const start = batchIndex * BATCH_SIZE;
    const end = Math.min(start + BATCH_SIZE, books.length);
    const batch = books.slice(start, end);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    for (const book of batch) {
      try {
        progress.processed++;
        
        // Check for duplicates (simplified - would check against user's library)
        const isDuplicate = false; // Would check actual user library
        
        if (isDuplicate) {
          progress.skipped++;
          continue;
        }
        
        // Try to match to creator
        const matches = matchBooksToCreators([book]);
        const match = matches[0];
        
        if (match && match.confidence === 'high') {
          progress.matched++;
          matchedCreators.push(match);
        }
        
        onProgress?.({ ...progress });
        yield { ...progress };
      } catch (err) {
        progress.errors++;
        errors.push(`Failed to import "${book.title}": ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  }
  
  return {
    success: errors.length === 0,
    books,
    progress,
    errors,
    matchedCreators,
  };
}

// Get import statistics
export function getImportStats(books: GoodreadsBook[]) {
  const shelfCounts: Record<string, number> = {};
  const authorCounts: Record<string, number> = {};
  const yearCounts: Record<string, number> = {};
  
  for (const book of books) {
    // Count by shelf
    shelfCounts[book.exclusiveShelf] = (shelfCounts[book.exclusiveShelf] || 0) + 1;
    
    // Count by author
    authorCounts[book.author] = (authorCounts[book.author] || 0) + 1;
    
    // Count by publication year
    const year = book.yearPublished || book.originalPublicationYear;
    if (year) {
      const decade = `${Math.floor(year / 10) * 10}s`;
      yearCounts[decade] = (yearCounts[decade] || 0) + 1;
    }
  }
  
  return {
    totalBooks: books.length,
    shelfCounts,
    topAuthors: Object.entries(authorCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10),
    yearCounts,
    averageRating: books.reduce((sum, b) => sum + (b.averageRating || 0), 0) / books.length || 0,
  };
}

// Validate CSV format
export function validateGoodreadsCSV(csvText: string): { valid: boolean; error?: string } {
  if (!csvText.trim()) {
    return { valid: false, error: 'File is empty' };
  }
  
  const lines = parseCSVLines(csvText);
  if (lines.length === 0) {
    return { valid: false, error: 'No data found in file' };
  }
  
  const headers = parseCSVLine(lines[0]);
  const requiredColumns = ['Book Id', 'Title', 'Author'];
  
  for (const col of requiredColumns) {
    if (!headers.includes(col)) {
      return { valid: false, error: `Missing required column: ${col}` };
    }
  }
  
  return { valid: true };
}
