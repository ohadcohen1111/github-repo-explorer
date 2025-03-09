import React, { useState, FormEvent } from 'react';
import { SearchForm, Input, Button } from '../styles/components';

interface SearchProps {
  onSearch: (username: string) => void;
  initialValue?: string;
}

const Search: React.FC<SearchProps> = ({ onSearch, initialValue = '' }) => {
  const [username, setUsername] = useState<string>(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  return (
    <SearchForm onSubmit={handleSubmit}>
      <Input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter GitHub username (e.g., facebook, vercel)"
        aria-label="GitHub username"
      />
      <Button type="submit">Search</Button>
    </SearchForm>
  );
};

export default Search;