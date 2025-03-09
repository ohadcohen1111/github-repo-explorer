// src/pages/RepositoryDetailPage.tsx
import React from 'react';
import RepositoryDetail from '../components/RepositoryDetail';
import { 
  AppContainer, 
  Header, 
  HeaderContent,
  PageTitle 
} from '../styles/components';

const RepositoryDetailPage: React.FC = () => {
  return (
    <AppContainer>
      <Header>
        <HeaderContent>
          <PageTitle>Repository Details</PageTitle>
        </HeaderContent>
      </Header>
      
      <RepositoryDetail />
    </AppContainer>
  );
};

export default RepositoryDetailPage;