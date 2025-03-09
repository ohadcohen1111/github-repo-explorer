import React, { createContext, useContext, useState, ReactNode, useRef } from 'react';
import { Repository } from '../types/github';
import { 
  fetchUserRepositories,
} from '../services/githubApi';

interface GithubContextType {
  repositories: Repository[];
  username: string;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  sortByStars: boolean;
  hasMore: boolean;
  searchRepositories: (username: string) => Promise<void>;
  loadMoreRepositories: () => Promise<void>;
  toggleSortByStars: () => void;
}

const GithubContext = createContext<GithubContextType | undefined>(undefined);

export const useGithub = (): GithubContextType => {
  const context = useContext(GithubContext);
  if (!context) {
    throw new Error('useGithub must be used within a GithubProvider');
  }
  return context;
};

interface GithubProviderProps {
  children: ReactNode;
}

export const GithubProvider: React.FC<GithubProviderProps> = ({ children }) => {
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [username, setUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sortByStars, setSortByStars] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  // Using a ref to track current page
  const currentPageRef = useRef<number>(1);

  // Search for repositories by username
  const searchRepositories = async (user: string) => {
    if (!user.trim()) return;

    setIsLoading(true);
    setError(null);
    
    // Reset pagination when searching for a new user
    currentPageRef.current = 1;
    setHasMore(true);
    
    try {
      const data = await fetchUserRepositories(user, 1);
      setRepositories(data);
      setUsername(user);
      
      // If first page is empty or has less items than expected, there are no more pages
      setHasMore(data.length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Load more repositories (next page)
  const loadMoreRepositories = async () => {
    if (isLoadingMore || !username || !hasMore) return;

    setIsLoadingMore(true);
    
    try {
      const nextPage = currentPageRef.current + 1;
      const data = await fetchUserRepositories(username, nextPage);
      
      if (data.length > 0) {
        setRepositories(prev => [...prev, ...data]);
        currentPageRef.current = nextPage;
        
        // Check if more pages exist based on results
        setHasMore(data.length > 0);
      } else {
        // If we got no results, there are no more pages
        setHasMore(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Toggle sort by stars
  const toggleSortByStars = () => {
    setSortByStars(prev => !prev);
  };

  // Get sorted repositories based on sortByStars flag
  const sortedRepositories = sortByStars
    ? [...repositories].sort((a, b) => b.stargazers_count - a.stargazers_count)
    : repositories;

  const value = {
    repositories: sortedRepositories,
    username,
    isLoading,
    isLoadingMore,
    error,
    sortByStars,
    hasMore,
    searchRepositories,
    loadMoreRepositories,
    toggleSortByStars,
  };

  return <GithubContext.Provider value={value}>{children}</GithubContext.Provider>;
};