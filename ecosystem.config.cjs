module.exports = {
  apps: [
    {
      name: "rg-academy",
      script: "./index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        SKIP_VITE: "true"
      }
    }
  ]
};
