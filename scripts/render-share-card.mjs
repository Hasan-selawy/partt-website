import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

await mkdir('.local', { recursive: true });
const htmlPath = resolve('.local/share-card.html');
await writeFile(htmlPath, `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  @font-face{font-family:Poppins;src:url("../assets/fonts/poppins-regular.woff2");font-weight:400;font-display:block}
  *{box-sizing:border-box}body{margin:0;background:#111}
  #card{width:1200px;height:630px;background:#0B0344;display:flex;flex-direction:column;justify-content:center;padding:88px 96px}
  #card img{width:640px;height:auto;display:block}
  #card i{display:block;width:72px;height:6px;background:#E7292B;margin:32px 0 24px}
  #card p{margin:0;color:#FFFFF9;font-family:Poppins,sans-serif;font-size:34px;line-height:1.3}
  #card small{display:block;margin-top:16px;color:#FFFFF9;font-family:Poppins,sans-serif;font-size:18px;letter-spacing:.08em}
  #icon{width:512px;height:512px;background:#0B0344;display:grid;place-items:center}
  #icon img{width:300px;height:auto;display:block}
</style>
</head>
<body>
<section id="card"><img src="../assets/logo.svg" alt=""><i></i><p>Part of your team.</p><small>Strategic marketing agency · Amman, Jordan</small></section>
<section id="icon"><img src="../assets/mark.svg" alt=""></section>
</body>
</html>`);

const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 1300 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(htmlPath).href);
await page.evaluate(() => document.fonts.ready);
const loaded = await page.evaluate(() => ({
  logo: document.querySelector('#card img').naturalWidth,
  mark: document.querySelector('#icon img').naturalWidth,
  font: document.fonts.check('34px Poppins'),
}));
if (!loaded.logo || !loaded.mark || !loaded.font) throw new Error(`Share card assets did not load: ${JSON.stringify(loaded)}`);
await page.locator('#card').screenshot({ path: resolve('assets/og.png') });
await page.locator('#icon').screenshot({ path: resolve('assets/icon-512.png') });
await browser.close();
console.log('Wrote assets/og.png and assets/icon-512.png');
