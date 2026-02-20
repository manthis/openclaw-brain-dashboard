import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();
  
  console.log('Navigating to login page...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  // Attendre le formulaire de login
  await page.waitForSelector('input[type="password"]', { timeout: 10000 });
  console.log('Login page loaded');
  
  // Trouver les champs de manière plus flexible
  const inputs = await page.locator('input').all();
  console.log(`Found ${inputs.length} input fields`);
  
  // Le premier input devrait être le username
  if (inputs.length >= 2) {
    await inputs[0].fill('admin');
    console.log('Username filled');
    await inputs[1].fill('changeme');
    console.log('Password filled');
  }
  
  // Cliquer sur le bouton de connexion
  await page.click('button[type="submit"]');
  console.log('Login button clicked');
  
  // Attendre la navigation (peut être vers / ou /dashboard)
  await page.waitForTimeout(3000);
  console.log('Waited for navigation, current URL:', page.url());
  
  // Naviguer vers la page Skills
  console.log('Navigating to skills page...');
  await page.goto('http://localhost:3000/skills', { waitUntil: 'networkidle' });
  
  // Attendre que les skills soient chargés
  await page.waitForTimeout(3000);
  console.log('Skills page loaded');
  
  // Prendre un screenshot de toute la page
  await page.screenshot({ 
    path: 'docs/screenshots/skills.png',
    fullPage: true
  });
  
  console.log('Screenshot saved to docs/screenshots/skills.png');
  
  await browser.close();
})();
