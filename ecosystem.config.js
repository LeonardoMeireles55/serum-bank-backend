module.exports = {
    apps: [
      {
        name: 'serum-bank-api',
        script: 'dist/main.js',
        instances: '2',
        exec_mode: 'fork',
      },
    ],
  };