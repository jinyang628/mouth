export async function fetchConfig() {
    try {
      const response = await fetch(chrome.runtime.getURL('config.json'));
      const config = await response.json();
      console.log('Configuration loaded:', config);
      return config;
    } catch (error) {
      console.error('Error loading the configuration:', error);
      return null;
    }
}
  