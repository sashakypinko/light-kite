declare global {
  namespace Express {
    interface Request {
      userId?: string | null;
      userScopes?: string[];
    }
  }
}

export {};