const fs = require('fs');
const path = require('path');
const vm = require('vm');
const https = require('https');

console.log('countries-services loaded from', __filename);

function loadData() {
  const filePath = path.join(__dirname, 'data.js');
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    // Run the data.js in a sandbox to obtain the `data` variable it defines
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(content + '\nresult = data;', sandbox, { filename: 'data.js' });
    return sandbox.result || [];
  } catch (err) {
    console.warn('loadData: unable to read or execute data.js:', err.message);
    return [];
  }
}

function getAllCountries() {
  return loadData();
}

function fetchCountries() {
  console.log('fetchCountries() called');
  const endpoints = [
    'https://restcountries.com/v3.1/all',
    'https://restcountries.com/v5.1/all',
  ];

  function fetchFromUrl(url, redirectsLeft) {
    console.log('fetchFromUrl() called with url:', url);
    return new Promise((resolve) => {
      try {
        const options = new URL(url);
        const req = https.get({
          hostname: options.hostname,
          path: options.pathname + (options.search || ''),
          port: options.port || 443,
          headers: {
            'User-Agent': 'CountryExplorer/1.0',
            Accept: 'application/json',
          },
        }, function (res) {
          let data = '';

          res.on('data', function (chunk) {
            data += chunk;
          });

          res.on('end', function () {
            console.log('fetchCountries: url', url);
            console.log('fetchCountries: status', res.statusCode);
            console.log('fetchCountries: content-type', res.headers['content-type']);

            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && redirectsLeft > 0) {
              const next = res.headers.location.startsWith('http') ? res.headers.location : new URL(res.headers.location, url).toString();
              console.log('fetchCountries: redirecting to', next);
              fetchFromUrl(next, redirectsLeft - 1).then(resolve);
              return;
            }

            if (res.statusCode !== 200) {
              console.warn('fetchCountries: non-200 status', res.statusCode, 'for', url);
              resolve(null);
              return;
            }

            const ct = (res.headers['content-type'] || '').toLowerCase();
            if (!ct.includes('application/json')) {
              console.warn('fetchCountries: unexpected content-type', ct, 'for', url);
              resolve(null);
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (Array.isArray(parsed)) {
                resolve(parsed);
              } else {
                console.warn('fetchCountries: parsed result is not an array, falling back to local data');
                resolve(null);
              }
            } catch (err) {
              console.warn('fetchCountries: JSON parse failed for', url, err.message);
              resolve(null);
            }
          });
        });

        req.on('error', function (error) {
          console.warn('fetchCountries: request error for', url, error.message);
          resolve(null);
        });

        req.end();
      } catch (err) {
        console.warn('fetchCountries: request setup failed for', url, err.message);
        resolve(null);
      }
    });
  }

  return new Promise(async function (resolve) {
    for (const endpoint of endpoints) {
      const result = await fetchFromUrl(endpoint, 5);
      if (Array.isArray(result) && result.length > 0) {
        return resolve(result);
      }
    }
    console.warn('fetchCountries: all endpoints failed, using local data fallback');
    resolve(loadData());
  });
}

module.exports = {
  getAllCountries,
  fetchCountries,
};
