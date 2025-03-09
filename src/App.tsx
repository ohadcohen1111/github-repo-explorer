// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GithubProvider } from './context/GithubContext';
import { ThemeProvider } from './context/ThemeContext';
import GlobalStyles from './styles/GlobalStyles';
import HomePage from './pages/HomePage';
import RepositoryDetailPage from './pages/RepositoryDetailPage';
import ThemeToggle from './components/ThemeToggle';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <ThemeToggle />
      <BrowserRouter>
        <GithubProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/repository/:username/:repoName" element={<RepositoryDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </GithubProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;