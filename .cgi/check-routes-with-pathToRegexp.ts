// path: src/core/utils/check-routes-with-pathToRegexp.ts
import { pathToRegexp } from 'path-to-regexp';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROUTES_DIR = path.resolve(__dirname, '../src/api/v1/routes');
const extensions = ['.ts', '.js'];

async function getAllRouteFiles(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
        entries.map((entry) => {
            const res = path.resolve(dir, entry.name);
            return entry.isDirectory() ? getAllRouteFiles(res) : [res];
        })
    );
    return files.flat().filter((f) => extensions.includes(path.extname(f)));
}

async function loadRouter(file: string) {
    try {
        const mod = await import(file);
        const router = mod.default;
        if (!router || !router.stack || !Array.isArray(router.stack)) {
            console.warn(`[SKIP] ${file} does not export a valid Express Router.`);
            return;
        }

        console.log(`\n[CHECKING] ${file}`);

        for (const layer of router.stack) {
            try {
                const routePath =
                    layer?.route?.path ??
                    (typeof layer?.regexp?.source === 'string' ? layer.regexp.source : '');

                if (routePath && typeof routePath === 'string') {
                    // Test with pathToRegexp
                    pathToRegexp(routePath);
                }
            } catch (e) {
                console.error(`[❌ ERROR] Invalid path in router ${file}`);
                console.error(`  Path: ${layer?.route?.path}`);
                console.error(`  Message: ${e.message}`);
            }
        }
    } catch (e) {
        console.error(`[FAILED] Could not import ${file}:`, e.message);
    }
}

(async () => {
    console.log(`🔍 Scanning routers in ${ROUTES_DIR}`);
    const files = await getAllRouteFiles(ROUTES_DIR);
    for (const file of files) {
        await loadRouter(pathToFileURL(file).href);
    }
})();
