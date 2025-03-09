// src/components/RepositoryList.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Repository } from '../types/github';
import InfiniteScroll from './InfiniteScroll';
import {
  RepositoriesHeader,
  RepositoriesTitle,
  SortButton,
  RepositoryGrid,
  RepositoryCard,
  RepoName,
  RepoDescription,
  RepoStats,
  StatItem,
  LoadingContainer,
  Spinner,
  ErrorMessage,
} from '../styles/components';

interface RepositoryListProps {
  repositories: Repository[];
  username: string;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  sortByStars: boolean;
  hasMore: boolean;
  toggleSortByStars: () => void;
  loadMoreRepositories: () => void;
  refreshRepositories: () => void;
}

const RepositoryList: React.FC<RepositoryListProps> = ({
  repositories,
  username,
  isLoading,
  isLoadingMore,
  error,
  sortByStars,
  hasMore,
  toggleSortByStars,
  loadMoreRepositories,
}) => {
  if (isLoading && repositories.length === 0) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (repositories.length === 0 && username) {
    return <div>No repositories found for {username}</div>;
  }

  if (repositories.length === 0) {
    return null;
  }

  return (
    <div>
      <RepositoriesHeader>
        <RepositoriesTitle>Repositories for {username}</RepositoriesTitle>
        <div>
          <SortButton onClick={toggleSortByStars}>
            Sort by Stars {sortByStars ? '↓' : '↑'}
          </SortButton>
        </div>
      </RepositoriesHeader>

      <InfiniteScroll 
        loadMore={loadMoreRepositories} 
        hasMore={hasMore} 
        isLoading={isLoadingMore}
      >
        <RepositoryGrid>
          {repositories.map((repo) => (
            <Link 
              to={`/repository/${username}/${repo.name}`} 
              key={repo.id}
              style={{ textDecoration: 'none' }}
            >
              <RepositoryCard>
                <RepoName>{repo.name}</RepoName>
                <RepoDescription title={repo.description || "No description available"}> 
                  {repo.description || 'No description available'}
                </RepoDescription>
                <RepoStats>
                  <StatItem>
                    <svg
                      aria-hidden="true"
                      height="16"
                      viewBox="0 0 16 16"
                      width="16"
                      style={{ marginRight: '4px', fill: '#e3b341' }}
                    >
                      <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"></path>
                    </svg>
                    {repo.stargazers_count.toLocaleString()}
                  </StatItem>
                  {repo.language && (
                    <StatItem>
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: '#3178c6', // Default to TypeScript blue
                          display: 'inline-block',
                          marginRight: '4px'
                        }}
                      />
                      {repo.language}
                    </StatItem>
                  )}
                </RepoStats>
              </RepositoryCard>
            </Link>
          ))}
        </RepositoryGrid>
      </InfiniteScroll>
    </div>
  );
};

export default RepositoryList;