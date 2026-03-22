const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'nq6iti',
  allowCypressEnv: false,
  e2e: {
    baseUrl: 'https://engage-sphere.vercel.app/',
    expose: {
      apiUrl: 'https://whispering-meadow-44853-562f20cee791.herokuapp.com'
    },
    fixturesFolder: false,
    supportFile: false,
  },
  retries: {
    openMode: 0,
    runMode: 2,
  },
})
