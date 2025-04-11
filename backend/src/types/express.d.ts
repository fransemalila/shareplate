import 'express-session';

declare module 'express-session' {
  interface SessionData {
    appleEmail?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      session: Session & {
        appleEmail?: string;
      };
    }
  }
} 