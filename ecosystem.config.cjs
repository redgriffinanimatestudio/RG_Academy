module.exports = {
  apps: [
    {
      name: "rg-academy",
      script: "./server.ts",
      interpreter: "node_modules/.bin/tsx",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        SKIP_VITE: "true"
      }
    }
  ]
};
