const env = {
  development: {
    apiUrl: "http://localhost:5000/api",
  },
  production: {
    apiUrl: "https://brookstone-backend.vercel.app/api",
  },
};

const getEnvConfig = () => {
  const environment = import.meta.env.MODE || "development";
  return env[environment];
};

export default getEnvConfig;
