const env = {
  development: {
    apiUrl: 'https://crm-backend-iamrahul-1.vercel.app/api',
  },
  production: {
    apiUrl: 'https://crm-backend-iamrahul-1.vercel.app/api',
  },
};

const getEnvConfig = () => {
  const environment = import.meta.env.MODE || 'development';
  return env[environment];
};

export default getEnvConfig;
