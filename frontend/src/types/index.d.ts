export interface User {
    userId: string;
    token: string;
  }
  
  export interface Note {
    _id: string;
    title: string;
    content: string;
    summary?: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  }
  