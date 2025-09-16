// path: src/core/utils/test-routes.js
#!/usr/bin/env node

import fetch from "node-fetch";

const args = process.argv.slice(2);

const showBody = args.includes("--show-body");

const baseUrl = args.find(arg => arg.startsWith("--base="))?.split("=")[1] || "http://localhost:3000";

const routes = [
  "/api/v1/product/223916438",
  "/api/v1/product/370275786",
  "/api/v1/stream/product?id=123",
  "/api/v1/other-route",
];

const TIMEOUT = 10000; // 10 секунд

async function fetchWithTimeout(url, options = {}) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Timeout reached"));
    }, TIMEOUT);

    fetch(url, options)
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

async function testRoute(route) {
  const url = baseUrl + route;
  try {
    const res = await fetchWithTimeout(url);
    const status = res.status;
    if (showBody) {
      const text = await res.text();
      console.log(`[${status}] ${route}\nResponse body:\n${text}\n`);
    } else {
      console.log(`[${status}] ${route}`);
    }
    return status;
  } catch (e) {
    console.error(`[ERR] ${route} - ${e.message || e.toString()}`);
    return null;
  }
}

async function main() {
  console.log(`Testing routes on base URL: ${baseUrl}`);
  console.log(`Show response body: ${showBody ? "Yes" : "No"}`);
  console.log("");

  const results = {};

  for (const route of routes) {
    const status = await testRoute(route);
    if (status) {
      results[status] = (results[status] || 0) + 1;
    }
  }

  console.log("\nSummary:");
  Object.entries(results).forEach(([status, count]) => {
    console.log(`Status ${status}: ${count} route(s)`);
  });
}

main();
