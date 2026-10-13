// Mirrors the production web build into the Tauri Android project so the
// APK serves the current frontend from its bundled assets.
// Usage: bun run build:production && bun run android:sync-assets
import { cpSync, existsSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'dist');
const dest = join(root, 'tauri', 'gen', 'android', 'app', 'src', 'main', 'assets');

if (!existsSync(src)) {
  throw new Error(`Missing ${src}. Run 'bun run build:production' first.`);
}

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });
