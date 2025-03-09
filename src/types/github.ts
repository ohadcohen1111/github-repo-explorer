export interface Repository {
    id: number;
    name: string;
    description: string | null;
    stargazers_count: number;
    language: string | null;
    html_url: string;
    updated_at: string;
    owner: {
      login: string;
    };
  }
  
  export interface Contributor {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
    contributions: number;
  }
  
  export interface GithubError {
    message: string;
    documentation_url?: string;
  }