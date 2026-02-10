'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  X,
  BookOpen,
  Users,
  BarChart3,
  ArrowLeft,
  Loader2,
  Download,
  Search,
  Star,
  Calendar,
  Network
} from 'lucide-react';
import Link from 'next/link';
import MobileNav, { MobileHeaderSpacer, MobileBottomSpacer, DesktopNav } from '@/app/components/MobileNav';
import {
  parseGoodreadsCSV,
  validateGoodreadsCSV,
  matchBooksToCreators,
  importBooksWithProgress,
  getImportStats,
  GoodreadsBook,
  ImportProgress,
  MatchedCreator,
} from '@/lib/import';
import { usePersistence } from '@/app/components/PersistenceProvider';

interface UploadState {
  status: 'idle' | 'uploading' | 'parsing' | 'validating' | 'importing' | 'complete' | 'error';
  message: string;
}

export default function ImportPage() {
  const [uploadState, setUploadState] = useState<UploadState>({ status: 'idle', message: '' });
  const [books, setBooks] = useState<GoodreadsBook[]>([]);
  const [progress, setProgress] = useState<ImportProgress | null>(null);
  const [matches, setMatches] = useState<MatchedCreator[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toggleSavedCreator, isCreatorSaved, recordCreatorView } = usePersistence();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.name.endsWith('.csv')) {
      setUploadState({ status: 'error', message: 'Please upload a CSV file' });
      return;
    }

    setUploadState({ status: 'uploading', message: 'Reading file...' });
    setErrors([]);
    
    try {
      const text = await file.text();
      
      setUploadState({ status: 'validating', message: 'Validating CSV format...' });
      const validation = validateGoodreadsCSV(text);
      
      if (!validation.valid) {
        setUploadState({ status: 'error', message: validation.error || 'Invalid file format' });
        return;
      }
      
      setUploadState({ status: 'parsing', message: 'Parsing books...' });
      const { books: parsedBooks, errors: parseErrors } = parseGoodreadsCSV(text);
      
      if (parsedBooks.length === 0) {
        setUploadState({ status: 'error', message: 'No books found in file' });
        return;
      }
      
      setBooks(parsedBooks);
      setErrors(parseErrors);
      
      // Match to creators
      const matched = matchBooksToCreators(parsedBooks);
      setMatches(matched);

      // Persist high-confidence matches: save creators and record views
      const highMatches = matched.filter(m => m.confidence === 'high' && m.creatorId);
      for (const match of highMatches) {
        if (match.creatorId) {
          if (!isCreatorSaved(match.creatorId)) {
            toggleSavedCreator(match.creatorId);
          }
          recordCreatorView(match.creatorId);
        }
      }

      setUploadState({ status: 'complete', message: `Found ${parsedBooks.length} books` });
    } catch (err) {
      setUploadState({ 
        status: 'error', 
        message: err instanceof Error ? err.message : 'Failed to process file' 
      });
    }
  };

  const startImport = async () => {
    setUploadState({ status: 'importing', message: 'Importing books...' });
    setProgress({ total: books.length, processed: 0, matched: 0, skipped: 0, errors: 0 });
    
    const generator = importBooksWithProgress(books, (p) => setProgress(p));
    
    for await (const p of generator) {
      setProgress(p);
    }
    
    setUploadState({ status: 'complete', message: 'Import complete!' });
  };

  const reset = () => {
    setUploadState({ status: 'idle', message: '' });
    setBooks([]);
    setProgress(null);
    setMatches([]);
    setErrors([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const stats = books.length > 0 ? getImportStats(books) : null;
  const highConfidenceMatches = matches.filter(m => m.confidence === 'high');
  const mediumConfidenceMatches = matches.filter(m => m.confidence === 'medium');

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950 text-zinc-100">
      <MobileNav currentPage="Import" />
      <MobileHeaderSpacer />

      {/* Desktop Header */}
      <header className="border-b border-zinc-800/50 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 min-h-[44px]">
            <Network className="w-8 h-8 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Lineage Lit
            </h1>
          </Link>
          <DesktopNav />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Import Your <span className="text-amber-400">Goodreads</span> Library
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto text-base sm:text-lg">
            Import your Goodreads export to discover connections between your reading history 
            and our creator database.
          </p>
        </div>

        {/* Instructions */}
        {uploadState.status === 'idle' && (
          <div className="bg-zinc-900/50 rounded-2xl p-6 sm:p-8 border border-zinc-800 mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-amber-400" />
              How to Export from Goodreads
            </h3>
            <ol className="space-y-3 text-zinc-400 text-sm sm:text-base">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-medium">1</span>
                <span>Go to Goodreads and sign in to your account</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-medium">2</span>
                <span>Navigate to <strong className="text-zinc-300">My Books → Import and Export</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-medium">3</span>
                <span>Click <strong className="text-zinc-300">"Export Library"</strong> to download your CSV file</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm font-medium">4</span>
                <span>Upload the file below — we&apos;ll match books to our creator database</span>
              </li>
            </ol>
          </div>
        )}

        {/* Upload Area */}
        {uploadState.status !== 'importing' && uploadState.status !== 'complete' && (
          <div
            className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all min-h-[240px] flex flex-col items-center justify-center ${
              dragActive 
                ? 'border-amber-500 bg-amber-500/5' 
                : uploadState.status === 'error'
                ? 'border-red-500/50 bg-red-500/5'
                : 'border-zinc-700 hover:border-zinc-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
            />
            
            {uploadState.status === 'error' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-red-400 mb-2">Upload Failed</h3>
                <p className="text-zinc-400 mb-4">{uploadState.message}</p>
                <button
                  onClick={reset}
                  className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition min-h-[48px]"
                >
                  Try Again
                </button>
              </>
            ) : uploadState.status === 'parsing' || uploadState.status === 'validating' || uploadState.status === 'uploading' ? (
              <>
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                  <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{uploadState.message}</h3>
                <p className="text-zinc-500 text-sm">This may take a moment...</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Drop your Goodreads CSV here</h3>
                <p className="text-zinc-500 mb-6">or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-amber-500 text-zinc-900 font-semibold rounded-lg hover:bg-amber-400 transition min-h-[48px] min-w-[160px]"
                >
                  Choose File
                </button>
                <p className="text-zinc-600 text-sm mt-4">Supports Goodreads export CSV files</p>
              </>
            )}
          </div>
        )}

        {/* Import Progress */}
        {uploadState.status === 'importing' && progress && (
          <div className="bg-zinc-900/50 rounded-2xl p-6 sm:p-8 border border-zinc-800">
            <div className="flex items-center gap-3 mb-6">
              <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
              <h3 className="text-lg font-semibold">Importing Books...</h3>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-400">Progress</span>
                <span className="text-amber-400">{Math.round((progress.processed / progress.total) * 100)}%</span>
              </div>
              <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${(progress.processed / progress.total) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatBox label="Total" value={progress.total} />
              <StatBox label="Processed" value={progress.processed} color="amber" />
              <StatBox label="Matched" value={progress.matched} color="green" />
              <StatBox label="Skipped" value={progress.skipped} color="zinc" />
            </div>
          </div>
        )}

        {/* Results */}
        {uploadState.status === 'complete' && stats && (
          <div className="space-y-6">
            {/* Success Header */}
            <div className="bg-zinc-900/50 rounded-2xl p-6 sm:p-8 border border-zinc-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Import Complete!</h3>
                    <p className="text-zinc-500 text-sm">{stats.totalBooks} books processed</p>
                  </div>
                </div>
                <button
                  onClick={reset}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition text-sm min-h-[44px]"
                >
                  Import Another File
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <ResultStat 
                  icon={<BookOpen className="w-5 h-5" />} 
                  value={stats.totalBooks} 
                  label="Total Books" 
                />
                <ResultStat 
                  icon={<Users className="w-5 h-5" />} 
                  value={Object.keys(stats.topAuthors).length} 
                  label="Unique Authors" 
                />
                <ResultStat 
                  icon={<Search className="w-5 h-5" />} 
                  value={highConfidenceMatches.length} 
                  label="High Matches" 
                  highlight
                />
                <ResultStat 
                  icon={<Star className="w-5 h-5" />} 
                  value={stats.averageRating.toFixed(1)} 
                  label="Avg Rating" 
                />
              </div>

              {/* Shelf Distribution */}
              <div className="border-t border-zinc-800 pt-6">
                <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4">Shelf Distribution</h4>
                <div className="space-y-3">
                  {Object.entries(stats.shelfCounts).map(([shelf, count]) => (
                    <div key={shelf}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-zinc-300 capitalize">{shelf.replace(/-/g, ' ')}</span>
                        <span className="text-zinc-500">{count} books</span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${(count / stats.totalBooks) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Creator Matches */}
            {matches.length > 0 && (
              <div className="bg-zinc-900/50 rounded-2xl p-6 sm:p-8 border border-zinc-800">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Search className="w-5 h-5 text-amber-400" />
                  Creator Matches
                </h3>
                
                {/* Match Summary */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400">{highConfidenceMatches.length}</div>
                    <div className="text-xs text-zinc-500 mt-1">High Confidence</div>
                  </div>
                  <div className="text-center p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                    <div className="text-2xl font-bold text-amber-400">{mediumConfidenceMatches.length}</div>
                    <div className="text-xs text-zinc-500 mt-1">Medium Confidence</div>
                  </div>
                  <div className="text-center p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                    <div className="text-2xl font-bold text-zinc-400">
                      {matches.filter(m => m.confidence === 'low').length}
                    </div>
                    <div className="text-xs text-zinc-500 mt-1">Not Found</div>
                  </div>
                </div>

                {/* Matched Creators List */}
                {highConfidenceMatches.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-zinc-500 mb-3">Matched to Our Database</h4>
                    <div className="grid gap-2">
                      {highConfidenceMatches.slice(0, 10).map((match, i) => (
                        <div 
                          key={i} 
                          className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-zinc-200 truncate">{match.bookTitle}</p>
                            <p className="text-sm text-zinc-500 truncate">{match.author}</p>
                          </div>
                          {match.creatorId && (
                            <Link
                              href={`/creators/${match.creatorId}`}
                              className="flex-shrink-0 px-3 py-1.5 bg-amber-500/10 text-amber-400 text-sm rounded-lg hover:bg-amber-500/20 transition min-h-[36px] flex items-center"
                            >
                              View Lineage
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                    {highConfidenceMatches.length > 10 && (
                      <p className="text-center text-zinc-500 text-sm py-2">
                        +{highConfidenceMatches.length - 10} more matches
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Errors */}
            {errors.length > 0 && (
              <div className="bg-red-500/5 rounded-2xl p-6 border border-red-500/20">
                <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Warnings ({errors.length})
                </h4>
                <ul className="space-y-2 text-sm text-red-400/80 max-h-40 overflow-y-auto">
                  {errors.slice(0, 5).map((error, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <X className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </li>
                  ))}
                  {errors.length > 5 && (
                    <li className="text-zinc-500">+{errors.length - 5} more warnings</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>
      <MobileBottomSpacer />
    </div>
  );
}

function StatBox({ label, value, color = 'zinc' }: { label: string; value: number; color?: 'zinc' | 'amber' | 'green' }) {
  const colorClasses = {
    zinc: 'bg-zinc-800 text-zinc-400',
    amber: 'bg-amber-500/10 text-amber-400',
    green: 'bg-green-500/10 text-green-400',
  };
  
  return (
    <div className={`p-4 rounded-xl ${colorClasses[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs opacity-70">{label}</div>
    </div>
  );
}

function ResultStat({ 
  icon, 
  value, 
  label, 
  highlight = false 
}: { 
  icon: React.ReactNode; 
  value: string | number; 
  label: string; 
  highlight?: boolean;
}) {
  return (
    <div className={`p-4 rounded-xl ${highlight ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-zinc-800/50'}`}>
      <div className={`mb-2 ${highlight ? 'text-amber-400' : 'text-zinc-400'}`}>{icon}</div>
      <div className={`text-2xl font-bold ${highlight ? 'text-amber-400' : 'text-zinc-100'}`}>{value}</div>
      <div className="text-xs text-zinc-500">{label}</div>
    </div>
  );
}
