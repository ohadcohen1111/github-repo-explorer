import axios, { AxiosError } from 'axios';
import { Repository, Contributor, GithubError } from '../types/github';

// Create axios instance with base URL
const githubClient = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Accept: 'application/vnd.github.v3+json',
  },
});

// Pagination settings
const PER_PAGE = 10;

/**
 * LocalStorage cache utility functions
 */
const cacheUtils = {
  // Set item in localStorage
  setCache: <T>(key: string, data: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Get item from localStorage
  getCache: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return null;
    }
  },

  // Check if key exists in localStorage
  hasCache: (key: string): boolean => {
    return localStorage.getItem(key) !== null;
  },

  // Remove item from localStorage
  removeCache: (key: string): void => {
    localStorage.removeItem(key);
  },

  // Clear all cache
  clearCache: (): void => {
    // Only clear GitHub API related items
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('repos-') || key.startsWith('repo-details-') || key.startsWith('contributors-'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
};

/**
 * Handle GitHub API errors
 */
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<GithubError>;
    if (axiosError.response?.data?.message) {
      throw new Error(`GitHub API: ${axiosError.response.data.message}`);
    }
  }
  throw error instanceof Error ? error : new Error('An unknown error occurred');
};

/**
 * Check if we have reached the end of available repositories
 */
export const isLastPage = (username: string): boolean => {
  const key = `repos-${username}-meta`;
  const meta = cacheUtils.getCache<{ hasMore: boolean }>(key);
  return meta ? !meta.hasMore : false;
};

/**
 * Fetch repositories for a GitHub username with pagination
 */
export const fetchUserRepositories = async (
  username: string, 
  page: number = 1
): Promise<Repository[]> => {
  if (!username.trim()) {
    throw new Error('Username is required');
  }
  
  const cacheKey = `repos-${username}-page-${page}`;
  
  // Check cache first
  if (cacheUtils.hasCache(cacheKey)) {
    console.log(`Using cached repositories data from localStorage for page ${page}`);
    const cachedData = cacheUtils.getCache<Repository[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }
  
  try {
    const response = await githubClient.get<Repository[]>(`/users/${username}/repos`, {
      params: {
        per_page: PER_PAGE,
        page: page
      }
    });
    
    // Store repositories in localStorage
    cacheUtils.setCache(cacheKey, response.data);
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Fetch all pages of a user's repositories (for special cases)
 * Warning: This can result in many API calls for users with many repos
 */
export const fetchAllUserRepositories = async (username: string): Promise<Repository[]> => {
  let allRepos: Repository[] = [];
  let page = 1;
  let hasMore = true;
  
  while (hasMore) {
    const repos = await fetchUserRepositories(username, page);
    if (repos.length === 0) {
      hasMore = false;
    } else {
      allRepos = [...allRepos, ...repos];
      page++;
      hasMore = repos.length === PER_PAGE;
    }
  }
  
  return allRepos;
};

/**
 * Fetch repository details
 */
export const fetchRepositoryDetails = async (username: string, repo: string): Promise<Repository> => {
  if (!username.trim() || !repo.trim()) {
    throw new Error('Username and repository name are required');
  }
  
  const cacheKey = `repo-details-${username}-${repo}`;
  
  // Check cache first
  if (cacheUtils.hasCache(cacheKey)) {
    console.log('Using cached repository details from localStorage');
    const cachedData = cacheUtils.getCache<Repository>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }
  
  try {
    const response = await githubClient.get<Repository>(`/repos/${username}/${repo}`);
    
    // Store in localStorage
    cacheUtils.setCache(cacheKey, response.data);
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Fetch contributors for a repository
 */
export const fetchRepositoryContributors = async (username: string, repo: string): Promise<Contributor[]> => {
  if (!username.trim() || !repo.trim()) {
    throw new Error('Username and repository name are required');
  }
  
  const cacheKey = `contributors-${username}-${repo}`;
  
  // Check cache first
  if (cacheUtils.hasCache(cacheKey)) {
    console.log('Using cached contributors data from localStorage');
    const cachedData = cacheUtils.getCache<Contributor[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }
  }
  
  try {
    const response = await githubClient.get<Contributor[]>(`/repos/${username}/${repo}/contributors`);
    
    // Store in localStorage
    cacheUtils.setCache(cacheKey, response.data);
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Clear all cache
 */
export const clearCache = (): void => {
  cacheUtils.clearCache();
};

/**
 * Clear cache for a specific username
 */
export const clearUserCache = (username: string): void => {
  // Clear all pages of repos
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(`repos-${username}`)) {
      localStorage.removeItem(key);
    }
  }
};