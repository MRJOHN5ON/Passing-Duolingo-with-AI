// @ts-check
import { test, expect } from '@playwright/test';
import { Mistral } from '@mistralai/mistralai';
import dotenv from 'dotenv';


dotenv.config();

const apiKey = process.env.MISTRAL_API_KEY;

test('sign up as new user and pass the first exam using AI', async ({ page }) => {
  // Initialize Mistral client
  const client = new Mistral({ apiKey });

  // Navigate to Duolingo
  await page.goto('https://www.duolingo.com/');
  await page.locator('a[data-test="get-started-top"]').first().click();
  await expect(page).toHaveURL('https://www.duolingo.com/register')
  await page.locator('button[data-test="language-card language-ru"]').click();
  await expect(page).toHaveURL('https://www.duolingo.com/welcome')
  const continueBtn = page.getByRole('button', { name: 'Continue' });

  await continueBtn.click()
  await continueBtn.click()
  await expect(page).toHaveURL('https://www.duolingo.com/welcome?welcomeStep=hdyhau')
  await page.locator('div[data-test="hdyhau-tv"]').click()
  await continueBtn.click()
  await expect(page).toHaveURL('https://www.duolingo.com/welcome?welcomeStep=learningReason')
  await page.getByRole('radio', { name: 'Just for fun' }).click()
  await continueBtn.click()
  await expect(page).toHaveURL('https://www.duolingo.com/welcome?welcomeStep=proficiency')
  await page.locator('div._26D82._1FwHd').first().click()
  await continueBtn.click()
  await expect(page).toHaveURL('https://www.duolingo.com/welcome?welcomeStep=courseOverview')
  await continueBtn.click()
  await expect(page).toHaveURL('https://www.duolingo.com/welcome?welcomeStep=dailyGoal')
  await page.locator('div._26D82._1FwHd').first().click()
  await continueBtn.click()
  await expect(page).toHaveURL('https://www.duolingo.com/welcome?welcomeStep=notificationPrimer')
  await page.getByText('ALLOW').click()
  await page.locator('div._26D82._1FwHd').first().click()
  await continueBtn.click()
  await continueBtn.click()
  await continueBtn.click()

  const phraseToTranslate = await page.locator('[data-test="hint-token"]').getAttribute('aria-label');

  
  const chatResponse = await client.agents.complete({
    agentId: "ag:9ddbf34f:20250308:untitled-agent:6a9aabb6",
    messages: [
      { role: 'user', content: `Translate "${phraseToTranslate}" to informal English (one word only)` }
    ]
  });

  // Safely check if chatResponse.choices exists before accessing
  let translatedText = '';
  const content = chatResponse?.choices?.[0]?.message?.content;
  
  if (typeof content === 'string') {
    translatedText = content.trim();
  } else if (Array.isArray(content)) {
    // Join content chunks if it's an array
    translatedText = content.map(chunk => {
      if (typeof chunk === 'string') return chunk;
      // Handle different chunk types safely
      if (chunk.type === 'text' && 'text' in chunk) return chunk.text;
      return '';
    }).join('').trim();
  }

  if (!translatedText) {
    console.error('Translation failed or returned empty.');
    return;
  }

  console.log(`Translated phrase: ${translatedText}`);

  // Find the challenge button using class and text content
  const translatedButton = page.locator('button._3fmUm').filter({
    hasText: new RegExp(`^${translatedText}$`, 'i')
  });

  // Wait for the button to be visible and click it
  
  await translatedButton.click();
  await page.locator('button[data-test="player-next"]').click()
  await page.locator('button[data-test="hearts-intro-continue-button"]').click()

});
