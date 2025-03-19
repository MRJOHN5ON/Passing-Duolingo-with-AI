# Duolingo AI Automation with Screenshot Analysis

This branch demonstrates an advanced approach to automating Duolingo challenges using AI-powered screenshot analysis.

## Evolution of this Branch

This implementation was created through "vibe coding" - an intuitive, collaborative coding process where I worked with Claude (an AI assistant) to transform the original text-based approach into a screenshot-based solution. By referencing the [Mistral AI vision documentation](https://docs.mistral.ai/capabilities/vision/#passing-a-base64-encoded-image), we evolved the codebase to use image recognition instead of text extraction.

The documentation provided critical guidance on how to properly encode and send screenshots to the Mistral AI API, enabling the AI to "see" the Duolingo challenges just as a human would.

## How It Works

Instead of extracting text elements from the DOM (which can break when UI changes), this approach:

1. Takes screenshots of Duolingo challenge screens
2. Converts these screenshots to base64 format (as specified in Mistral's documentation)
3. Sends the encoded images to Mistral AI's vision-capable models
4. The AI analyzes the entire visual context to determine the correct answers
5. The automation clicks the appropriate buttons based on the AI's response

## Benefits Over Text-Based Approach

- **More robust against UI changes**: Since we're analyzing the visual appearance rather than DOM elements
- **Complete context awareness**: The AI sees everything a human would see, including images, fonts, colors and layout
- **Simpler code**: No need for complex selectors to extract specific text elements
- **More adaptable**: Works across different challenge types without needing specific customization
- **Future-proof**: Even if Duolingo redesigns their UI, the approach will still work

## Technical Implementation

- Uses Mistral's Small 2503 model for efficient image processing (consumes ~3x fewer tokens than Pixtral)
- Images are properly sized and encoded following Mistral's documentation
- Clear prompting ensures the AI returns only the exact text needed for answering
- Intelligent parsing of multi-word responses for complex challenges

## Requirements

- Mistral API key with access to vision-capable models
- Playwright for browser automation
- Node.js environment

## Setup and Running

1. Install dependencies: `npm install`
2. Add your Mistral API key to `.env`: `MISTRAL_API_KEY=your_key_here`
3. Run the test: `npx playwright test`

## Future Improvements

- Fine-tune clip regions for more token-efficient screenshots
- Add support for more complex Duolingo challenge types
- Implement recovery strategies for rare cases where the AI might misinterpret

## References

This implementation references the [Mistral AI Vision documentation](https://docs.mistral.ai/capabilities/vision/#passing-a-base64-encoded-image) for properly encoding and sending screenshot data.
