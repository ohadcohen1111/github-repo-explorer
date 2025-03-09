// src/components/RepositoryDetail.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Repository, Contributor } from '../types/github';
import { fetchRepositoryDetails, fetchRepositoryContributors } from '../services/githubApi';
import {
  RepoDetailContainer,
  RepoDetailHeader,
  RepoDetailName,
  RepoDetailDescription,
  RepoDetailStats,
  StatItem,
  BackButton,
  ExternalLink,
  ContributorsSection,
  ContributorsTitle,
  ContributorsList,
  ContributorCard,
  Avatar,
  ContributorInfo,
  ContributorName,
  ContributorCommits,
  LoadingContainer,
  Spinner,
  ErrorMessage
} from '../styles/components';

const RepositoryDetail: React.FC = () => {
  const { username, repoName } = useParams<{ username: string; repoName: string }>();
  const navigate = useNavigate();
  
  const [repoDetails, setRepoDetails] = useState<Repository | null>(null);
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!username || !repoName) {
        setError('Repository information is missing');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch repository details and contributors in parallel
        const [details, contribs] = await Promise.all([
          fetchRepositoryDetails(username, repoName),
          fetchRepositoryContributors(username, repoName)
        ]);
        
        setRepoDetails(details);
        setContributors(contribs);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch repository details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [username, repoName]);

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (!repoDetails) {
    return <ErrorMessage>Repository details not found</ErrorMessage>;
  }

  return (
    <div>
      <BackButton onClick={handleBack}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          style={{ marginRight: '6px' }}
        >
          <path
            fillRule="evenodd"
            d="M7.78 12.53a.75.75 0 01-1.06 0L2.47 8.28a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 1.06L4.81 7h7.44a.75.75 0 010 1.5H4.81l2.97 2.97a.75.75 0 010 1.06z"
            fill="currentColor"
          ></path>
        </svg>
        Back to search results
      </BackButton>

      <RepoDetailContainer>
        <RepoDetailHeader>
          <div>
            <RepoDetailName>{repoDetails.name}</RepoDetailName>
            <RepoDetailDescription>
              {repoDetails.description || 'No description available'}
            </RepoDetailDescription>
          </div>
          <ExternalLink href={repoDetails.html_url} target="_blank" rel="noopener noreferrer">
            View on GitHub
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              style={{ marginLeft: '6px' }}
            >
              <path
                fillRule="evenodd"
                d="M10.604 1h4.146a.25.25 0 01.25.25v4.146a.25.25 0 01-.427.177L13.03 4.03 9.28 7.78a.75.75 0 01-1.06-1.06l3.75-3.75-1.543-1.543A.25.25 0 0110.604 1zM3.75 2A1.75 1.75 0 002 3.75v8.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 12.25v-3.5a.75.75 0 00-1.5 0v3.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-8.5a.25.25 0 01.25-.25h3.5a.75.75 0 000-1.5h-3.5z"
                fill="white"
              ></path>
            </svg>
          </ExternalLink>
        </RepoDetailHeader>

        <RepoDetailStats>
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
            {repoDetails.stargazers_count.toLocaleString()} stars
          </StatItem>
          
          {repoDetails.language && (
            <StatItem>
              <span
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: '#3178c6',
                  display: 'inline-block',
                  marginRight: '4px'
                }}
              />
              {repoDetails.language}
            </StatItem>
          )}
          
          <StatItem>
            <svg
              aria-hidden="true"
              height="16"
              viewBox="0 0 16 16"
              width="16"
              style={{ marginRight: '4px', fill: 'currentColor' }}
            >
              <path d="M1.5 8a6.5 6.5 0 1113 0 6.5 6.5 0 01-13 0zM8 0a8 8 0 100 16A8 8 0 008 0zm.5 4.75a.75.75 0 00-1.5 0v3.5a.75.75 0 00.471.696l2.5 1a.75.75 0 00.557-1.392L8.5 7.742V4.75z"></path>
            </svg>
            Last updated: {formatDate(repoDetails.updated_at)}
          </StatItem>
        </RepoDetailStats>
      </RepoDetailContainer>

      <ContributorsSection>
        <ContributorsTitle>Top Contributors</ContributorsTitle>
        
        {contributors.length === 0 ? (
          <div>No contributors found</div>
        ) : (
          <ContributorsList>
            {contributors.slice(0, 10).map((contributor) => (
              <ContributorCard key={contributor.id}>
                <Avatar src={contributor.avatar_url} alt={`${contributor.login}'s avatar`} />
                <ContributorInfo>
                  <ContributorName 
                    href={contributor.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {contributor.login}
                  </ContributorName>
                  <ContributorCommits>
                    {contributor.contributions} {contributor.contributions === 1 ? 'commit' : 'commits'}
                  </ContributorCommits>
                </ContributorInfo>
              </ContributorCard>
            ))}
          </ContributorsList>
        )}
      </ContributorsSection>
    </div>
  );
};

export default RepositoryDetail;