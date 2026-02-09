import { Creator, Work } from './data';

export type CitationFormat = 'apa' | 'mla' | 'chicago';

export interface CitationOptions {
  format: CitationFormat;
  includeAccessDate?: boolean;
  accessDate?: Date;
  database?: string;
}

interface CitationSource {
  creator: Creator;
  work?: Work;
  url?: string;
}

function formatName(name: string, format: CitationFormat): string {
  const parts = name.split(' ');
  if (parts.length === 1) return name;
  
  const lastName = parts[parts.length - 1];
  const firstNames = parts.slice(0, -1);
  
  switch (format) {
    case 'apa':
      return `${lastName}, ${firstNames.map(n => n[0]).join('. ')}.`;
    case 'mla':
    case 'chicago':
      return `${lastName}, ${firstNames.join(' ')}`;
    default:
      return name;
  }
}

function formatYear(year: number | string, format: CitationFormat): string {
  const yearStr = String(year);
  if (format === 'apa') {
    return `(${yearStr})`;
  }
  return yearStr;
}

function formatAccessDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export function generateCitation(source: CitationSource, options: CitationOptions): string {
  const { creator, work, url } = source;
  const { format, includeAccessDate = true, accessDate = new Date(), database = 'Lineage Lit' } = options;
  
  const formattedDate = includeAccessDate ? formatAccessDate(accessDate) : '';
  
  switch (format) {
    case 'apa':
      return generateAPACitation(creator, work, url, formattedDate, database);
    case 'mla':
      return generateMLACitation(creator, work, url, formattedDate, database);
    case 'chicago':
      return generateChicagoCitation(creator, work, url, formattedDate, database);
    default:
      return generateAPACitation(creator, work, url, formattedDate, database);
  }
}

function generateAPACitation(
  creator: Creator, 
  work?: Work, 
  url?: string, 
  accessDate?: string,
  database?: string
): string {
  const authorName = formatName(creator.name, 'apa');
  
  if (work) {
    const year = formatYear(work.year, 'apa');
    const title = work.type === 'book' 
      ? `<i>${work.title}</i>`
      : `"${work.title}"`;
    
    let citation = `${authorName} ${year}. ${title}.`;
    
    if (url) {
      citation += ` ${database}. ${url}`;
      if (accessDate) {
        citation += ` (Accessed ${accessDate})`;
      }
    }
    
    return citation;
  } else {
    let citation = `${authorName} (${creator.years.split('-')[0]}–${creator.years.split('-')[1] || 'present'}). Biography of ${creator.name}.`;
    
    if (url) {
      citation += ` ${database}. ${url}`;
      if (accessDate) {
        citation += ` (Accessed ${accessDate})`;
      }
    }
    
    return citation;
  }
}

function generateMLACitation(
  creator: Creator, 
  work?: Work, 
  url?: string, 
  accessDate?: string,
  database?: string
): string {
  const authorName = formatName(creator.name, 'mla');
  
  if (work) {
    const title = work.type === 'book' 
      ? `<i>${work.title}</i>`
      : `"${work.title}."`;
    
    let citation = `${authorName}. ${title} ${work.year}.`;
    
    if (url) {
      citation += ` ${database}, ${url}`;
      if (accessDate) {
        citation += `. Accessed ${accessDate}.`;
      }
    }
    
    return citation;
  } else {
    let citation = `${authorName}. "Biography of ${creator.name}." ${database}, ${creator.years}.`;
    
    if (url) {
      citation += ` ${url}`;
      if (accessDate) {
        citation += `. Accessed ${accessDate}.`;
      }
    }
    
    return citation;
  }
}

function generateChicagoCitation(
  creator: Creator, 
  work?: Work, 
  url?: string, 
  accessDate?: string,
  database?: string
): string {
  const authorName = formatName(creator.name, 'chicago');
  
  if (work) {
    const title = work.type === 'book' 
      ? `<i>${work.title}</i>`
      : `"${work.title}"`;
    
    let citation = `${authorName}. ${title}. ${work.year}.`;
    
    if (url) {
      citation += ` ${database}. ${url}`;
      if (accessDate) {
        citation += ` (accessed ${accessDate})`;
      }
    }
    
    return citation;
  } else {
    let citation = `${authorName}. "${creator.name}." In ${database}. ${creator.years}.`;
    
    if (url) {
      citation += ` ${url}`;
      if (accessDate) {
        citation += ` (accessed ${accessDate}).`;
      }
    }
    
    return citation;
  }
}

export function generateBibliography(
  sources: CitationSource[], 
  options: CitationOptions
): string {
  const sortedSources = [...sources].sort((a, b) => {
    const nameA = a.creator.name.split(' ').pop() || '';
    const nameB = b.creator.name.split(' ').pop() || '';
    return nameA.localeCompare(nameB);
  });
  
  const citations = sortedSources.map(source => generateCitation(source, options));
  
  switch (options.format) {
    case 'apa':
      return `<h3>References</h3>\n\n${citations.map(c => `<p style="text-indent: -0.5in; margin-left: 0.5in; margin-bottom: 1em;">${c}</p>`).join('\n')}`;
    case 'mla':
      return `<h3>Works Cited</h3>\n\n${citations.map(c => `<p style="text-indent: -0.5in; margin-left: 0.5in; margin-bottom: 1em;">${c}</p>`).join('\n')}`;
    case 'chicago':
      return `<h3>Bibliography</h3>\n\n${citations.map(c => `<p style="text-indent: -0.5in; margin-left: 0.5in; margin-bottom: 1em;">${c}</p>`).join('\n')}`;
    default:
      return citations.join('\n\n');
  }
}

export const formatLabels: Record<CitationFormat, { name: string; description: string }> = {
  apa: {
    name: 'APA 7th',
    description: 'American Psychological Association - Used in social sciences'
  },
  mla: {
    name: 'MLA 9th',
    description: 'Modern Language Association - Used in humanities'
  },
  chicago: {
    name: 'Chicago 17th',
    description: 'Chicago Manual of Style - Used in history and publishing'
  }
};
