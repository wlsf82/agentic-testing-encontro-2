const { defineConfig } = require('cypress')

module.exports = defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: 'https://engage-sphere.vercel.app/',
    fixturesFolder: false,
    supportFile: false,
  },
  retries: {
    openMode: 0,
    runMode: 2,
  },
})
