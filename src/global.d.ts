  
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      FRONTEND_HOST: string;
      PORT: string;
      API_HOST: string;
      DB_HOST: string;
      DB_NAME: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASS: string;
      SESSION_NAME: string;
      SESSION_SECRET: string;
      SAME_SITE: "lax" | "strict" | "none";
      GOOGLE_OAUTH2_CLIENT_ID: string;
      CRYPTO_SECRET: string;
    }
  }
}

export {}