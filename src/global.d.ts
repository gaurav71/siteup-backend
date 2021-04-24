  
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT: string;
      DB_HOST: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      REDIS_PASS: string;
      SESSION_NAME: string;
      SESSION_SECRET: string;
      SAME_SITE: "lax" | "strict" | "none";
    }
  }
}

export {}