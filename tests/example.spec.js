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

  // First challenge - using screenshot approach
  // Wait for challenge to appear - updated selector based on actual HTML structure
  await page.waitForSelector('[data-test="challenge challenge-translate"]', { timeout: 10000 });
  
  // Take a screenshot of the challenge area
  const screenshotBuffer1 = await page.screenshot({
    fullPage: false,
    clip: {
      x: 0,
      y: 0,
      width: 800,  // Adjust these values based on your screen
      height: 600
    }
  });
  
  // Convert the screenshot to base64 for sending to the AI
  const base64Screenshot1 = screenshotBuffer1.toString('base64');

  // Send the screenshot to Mistral for analysis
  const chatResponse1 = await client.chat.complete({
    model: "mistral-small-latest", // Use a model with vision capabilities
    messages: [
      { 
        role: 'user', 
        content: [
          { type: 'text', text: 'Look at this Duolingo challenge screenshot and tell me which word or phrase I should select as the answer. Return only the exact word(s) to click, nothing else.' },
          { type: 'image_url', imageUrl: `data:image/png;base64,${base64Screenshot1}` }
        ]
      }
    ]
  });

  // Handle various types that might be returned and convert to string safely
  const responseContent = chatResponse1?.choices?.[0]?.message?.content || '';
  const answerText1 = typeof responseContent === 'string' ? responseContent.trim() : String(responseContent).trim();
  
  if (!answerText1) {
    console.error('AI analysis failed or returned empty for first challenge.');
    return;
  }

  console.log(`AI suggested answer for first challenge: ${answerText1}`);

  // Find and click the button with the text provided by the AI - using a more specific selector
  const answerButton1 = page.locator(`[data-test="${answerText1}-challenge-tap-token"]`);
  
  await answerButton1.click();
  await page.locator('button[data-test="player-next"]').click();
  await page.locator('button[data-test="hearts-intro-continue-button"]').click();
  await continueBtn.click();

  // Second challenge - wait for it to appear - updated selector
  await page.waitForSelector('[data-test="challenge challenge-translate"]', { timeout: 10000 });
  
  // Take a screenshot of the second challenge
  const screenshotBuffer2 = await page.screenshot({
    fullPage: false,
    clip: {
      x: 0,
      y: 0,
      width: 800,
      height: 600
    }
  });
  
  // Convert the screenshot to base64
  const base64Screenshot2 = screenshotBuffer2.toString('base64');

  // Send to Mistral for analysis
  const chatResponse2 = await client.chat.complete({
    model: "mistral-small-latest", // Use a model with vision capabilities
    messages: [
      { 
        role: 'user', 
        content: [
          { type: 'text', text: 'This is a Duolingo challenge. Tell me which words I need to select in order, to form the correct translation. Return only the exact words separated by comma, no explanations.' },
          { type: 'image_url', imageUrl: `data:image/png;base64,${base64Screenshot2}` }
        ]
      }
    ]
  });

  // Handle various types that might be returned and convert to string safely
  const responseContent2 = chatResponse2?.choices?.[0]?.message?.content || '';
  const answerText2 = typeof responseContent2 === 'string' ? responseContent2.trim() : String(responseContent2).trim();
  
  if (!answerText2) {
    console.error('AI analysis failed or returned empty for second challenge.');
    return;
  }

  console.log(`AI suggested answers for second challenge: ${answerText2}`);

  // If the AI returned multiple words separated by commas, split them
  const wordsTap = answerText2.split(',').map(word => word.trim());
  
  // Click each word in order - using more specific selectors
  for (const word of wordsTap) {
    // Try to find the button with the specific data-test attribute first
    const wordButton = page.locator(`[data-test="${word}-challenge-tap-token"]`);
    
    // If it exists, click it, otherwise try the more generic selector
    if (await wordButton.count() > 0) {
      await wordButton.click();
    } else {
      // Fallback to the previous approach
      const backupButton = page.locator('button._3fmUm').filter({
        hasText: new RegExp(`^${word}$`, 'i')
      });
      await backupButton.click();
    }
    
    // Short delay between clicks to avoid race conditions
    await page.waitForTimeout(300);
  }
  
  // Click the check button or next button
  await page.locator('button[data-test="player-next"], button[data-test="check-button"]').click();
});
