import React from 'react';
import Search from '../components/Search';
import RepositoryList from '../components/RepositoryList';
import { useGithub } from '../context/GithubContext';
import { AppContainer, Header, PageTitle, SearchContainer } from '../styles/components';

const HomePage: React.FC = () => {
  const { 
    repositories,
    username, 
    isLoading,
    isLoadingMore, 
    error,
    sortByStars,
    hasMore,
    searchRepositories,
    toggleSortByStars,
    loadMoreRepositories,
  } = useGithub();

  const handleSearch = (searchUsername: string) => {
    searchRepositories(searchUsername);
  };

  return (
    <AppContainer>
      <Header>
        <PageTitle>GitHub Repository Explorer</PageTitle>
      </Header>
      
      <SearchContainer>
        <Search onSearch={handleSearch} initialValue={username} />
      </SearchContainer>
      
      <RepositoryList
        repositories={repositories}
        username={username}
        isLoading={isLoading}
        isLoadingMore={isLoadingMore}
        error={error}
        sortByStars={sortByStars}
        hasMore={hasMore}
        toggleSortByStars={toggleSortByStars}
        loadMoreRepositories={loadMoreRepositories}
      />
    </AppContainer>
  );
};

export default HomePage;