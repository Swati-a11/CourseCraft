import test from 'node:test';
import assert from 'node:assert/strict';
import cors from 'cors';
import { corsOptions } from '../middleware/corsOptions.js';

function preflight(origin, method) {
  return new Promise((resolve, reject) => {
    const headers = {};
    const req = { method: 'OPTIONS', headers: { origin, 'access-control-request-method': method, 'access-control-request-headers': 'authorization,content-type' } };
    const res = {
      statusCode: 200,
      setHeader(name, value) { headers[name.toLowerCase()] = value; },
      getHeader(name) { return headers[name.toLowerCase()]; },
      end() { resolve({ headers, statusCode: this.statusCode }); },
    };
    cors(corsOptions)(req, res, error => error ? reject(error) : resolve({ headers, statusCode: res.statusCode }));
  });
}

test('study plan PATCH preflight allows the browser to send its update', async () => {
  const { headers, statusCode } = await preflight('http://127.0.0.1:5173', 'PATCH');
  assert.equal(statusCode, 204);
  assert.equal(headers['access-control-allow-origin'], 'http://127.0.0.1:5173');
  assert.ok(headers['access-control-allow-methods'].split(',').includes('PATCH'));
  assert.match(headers['access-control-allow-headers'], /Authorization/i);
});

test('an unapproved origin is not granted access', async () => {
  const { headers } = await preflight('https://example.com', 'PATCH');
  assert.equal(headers['access-control-allow-origin'], undefined);
});
