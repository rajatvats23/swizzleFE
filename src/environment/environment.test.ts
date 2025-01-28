export const environment = {
    production: false,
    test: true,
    apiUrl: 'https://test-api.example.com/api',
    version: '1.0.0',
    defaultLanguage: 'en',
    // Add test-specific configuration here
    enableDebugTools: true,
    logLevel: 'debug',
    mockData: true,
    testUser: {
      email: 'test@example.com',
      role: 'admin'
    }
  };