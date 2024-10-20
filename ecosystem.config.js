module.exports = {
    apps: [
      {
        name: 'serum-bank-api',
        script: 'dist/main.js',
        instances: '1',
        exec_mode: 'fork',
      },
    ],
  };