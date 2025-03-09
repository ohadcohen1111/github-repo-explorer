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

// Cache TTL in milliseconds (5 minutes)
const CACHE_TTL = 5 * 60 * 1000;

/**
 * Cache item interface with timestamp for TTL implementation
 */
interface CacheItem<T> {
  data: T;
  timestamp: number;
}

/**
 * LocalStorage cache utility functions
 */
const cacheUtils = {
  // Set item in localStorage with timestamp
  setCache: <T>(key: string, data: T): void => {
    try {
      const cacheItem: CacheItem<T> = {
        data,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Get item from localStorage with TTL check
  getCache: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const cacheItem = JSON.parse(item) as CacheItem<T>;
      
      // Check if cache is expired
      if (Date.now() - cacheItem.timestamp > CACHE_TTL) {
        // Cache expired, remove it
        localStorage.removeItem(key);
        return null;
      }
      
      return cacheItem.data;
    } catch (error) {
      console.error('Error retrieving from localStorage:', error);
      return null;
    }
  },
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
  const cachedData = cacheUtils.getCache<Repository[]>(cacheKey);
  if (cachedData) {
    console.log(`Using cached repositories data (page ${page}), valid for 5 minutes`);
    return cachedData;
  }
  
  try {
    const response = await githubClient.get<Repository[]>(`/users/${username}/repos`, {
      params: {
        per_page: PER_PAGE,
        page: page
      }
    });
    
    // Store repositories in localStorage with timestamp
    cacheUtils.setCache(cacheKey, response.data);
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
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
  const cachedData = cacheUtils.getCache<Repository>(cacheKey);
  if (cachedData) {
    console.log('Using cached repository details, valid for 5 minutes');
    return cachedData;
  }
  
  try {
    const response = await githubClient.get<Repository>(`/repos/${username}/${repo}`);
    
    // Store in localStorage with timestamp
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
  const cachedData = cacheUtils.getCache<Contributor[]>(cacheKey);
  if (cachedData) {
    console.log('Using cached contributors data, valid for 5 minutes');
    return cachedData;
  }
  
  try {
    const response = await githubClient.get<Contributor[]>(`/repos/${username}/${repo}/contributors`);
    
    // Store in localStorage with timestamp
    cacheUtils.setCache(cacheKey, response.data);
    
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};
