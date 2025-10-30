// Search utilities for autocomplete and fuzzy matching

/**
 * Calculate Levenshtein distance between two strings
 * (measures how many edits needed to transform one string to another)
 */
export function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,      // deletion
        matrix[i][j - 1] + 1,      // insertion
        matrix[i - 1][j - 1] + cost // substitution
      );
    }
  }

  return matrix[len1][len2];
}

/**
 * Calculate similarity score between two strings (0-1, higher is more similar)
 */
export function similarityScore(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

/**
 * Check if a string fuzzy matches another (handles typos)
 * @param search - The search term (possibly with typos)
 * @param target - The target string to match against
 * @param threshold - Similarity threshold (0-1, default 0.7)
 */
export function fuzzyMatch(search: string, target: string, threshold: number = 0.7): boolean {
  const searchLower = search.toLowerCase();
  const targetLower = target.toLowerCase();
  
  // Exact match
  if (targetLower.includes(searchLower)) return true;
  
  // Check each word in target
  const targetWords = targetLower.split(/\s+/);
  for (const word of targetWords) {
    if (word.includes(searchLower)) return true;
    
    // Fuzzy match on individual words
    const score = similarityScore(searchLower, word);
    if (score >= threshold) return true;
  }
  
  // Check full string similarity
  const fullScore = similarityScore(searchLower, targetLower);
  return fullScore >= threshold;
}

/**
 * Find best matching suggestion for a search term
 * @param search - The search term (possibly with typos)
 * @param candidates - Array of possible matches
 * @param threshold - Minimum similarity score (default 0.6)
 */
export function findBestMatch(
  search: string, 
  candidates: string[], 
  threshold: number = 0.6
): { match: string; score: number } | null {
  let bestMatch: string | null = null;
  let bestScore = 0;
  
  const searchLower = search.toLowerCase();
  
  for (const candidate of candidates) {
    const candidateLower = candidate.toLowerCase();
    
    // Exact substring match gets highest score
    if (candidateLower.includes(searchLower)) {
      return { match: candidate, score: 1.0 };
    }
    
    // Check each word
    const words = candidateLower.split(/\s+/);
    for (const word of words) {
      const score = similarityScore(searchLower, word);
      if (score > bestScore && score >= threshold) {
        bestScore = score;
        bestMatch = candidate;
      }
    }
    
    // Check full string
    const fullScore = similarityScore(searchLower, candidateLower);
    if (fullScore > bestScore && fullScore >= threshold) {
      bestScore = fullScore;
      bestMatch = candidate;
    }
  }
  
  return bestMatch ? { match: bestMatch, score: bestScore } : null;
}

/**
 * Extract unique search terms from products
 * (for autocomplete suggestions)
 */
export function extractSearchTerms(products: any[]): string[] {
  const terms = new Set<string>();
  
  for (const product of products) {
    // Add product title
    if (product.title) {
      terms.add(product.title.toLowerCase());
      // Add individual words from title
      product.title.toLowerCase().split(/\s+/).forEach((word: string) => {
        if (word.length > 2) terms.add(word);
      });
    }
    
    // Add brand
    if (product.brand) {
      terms.add(product.brand.toLowerCase());
    }
    
    // Add category
    if (product.category) {
      terms.add(product.category.toLowerCase());
    }
    
    // Add categories array
    if (Array.isArray(product.categories)) {
      product.categories.forEach((cat: any) => {
        if (cat.name) terms.add(cat.name.toLowerCase());
      });
    }
  }
  
  return Array.from(terms).sort();
}

/**
 * Get autocomplete suggestions based on partial input
 * @param input - Partial search term
 * @param allTerms - All available search terms
 * @param maxSuggestions - Maximum number of suggestions to return
 */
export function getAutocompleteSuggestions(
  input: string,
  allTerms: string[],
  maxSuggestions: number = 5
): string[] {
  if (!input || input.length < 2) return [];
  
  const inputLower = input.toLowerCase();
  const suggestions: { term: string; score: number }[] = [];
  
  for (const term of allTerms) {
    const termLower = term.toLowerCase();
    
    // Exact prefix match (highest priority)
    if (termLower.startsWith(inputLower)) {
      suggestions.push({ term, score: 1.0 });
    }
    // Contains match (medium priority)
    else if (termLower.includes(inputLower)) {
      suggestions.push({ term, score: 0.8 });
    }
    // Fuzzy match (low priority)
    else {
      const score = similarityScore(inputLower, termLower);
      if (score >= 0.7) {
        suggestions.push({ term, score: score * 0.6 });
      }
    }
  }
  
  // Sort by score (descending) and return top N
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions)
    .map(s => s.term);
}

/**
 * Common typo corrections
 */
const COMMON_TYPOS: Record<string, string> = {
  'labtob': 'laptop',
  'labtop': 'laptop',
  'laptob': 'laptop',
  'laptp': 'laptop',
  'phoen': 'phone',
  'pone': 'phone',
  'fone': 'phone',
  'boook': 'book',
  'bok': 'book',
  'buk': 'book',
  'camra': 'camera',
  'cemera': 'camera',
  'headfone': 'headphone',
  'hedphone': 'headphone',
  'watcg': 'watch',
  'wach': 'watch',
  'tabel': 'tablet',
  'tabelt': 'tablet',
};

/**
 * Auto-correct common typos
 */
export function autoCorrectTypo(input: string): string {
  const inputLower = input.toLowerCase().trim();
  
  // Check for exact typo match
  if (COMMON_TYPOS[inputLower]) {
    return COMMON_TYPOS[inputLower];
  }
  
  // Check for typos in individual words
  const words = inputLower.split(/\s+/);
  const correctedWords = words.map(word => COMMON_TYPOS[word] || word);
  
  if (correctedWords.some((w, i) => w !== words[i])) {
    return correctedWords.join(' ');
  }
  
  return input;
}

