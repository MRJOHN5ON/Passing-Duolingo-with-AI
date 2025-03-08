# Duolingo Automation with AI

A demonstration of automating Duolingo's onboarding process and first lesson using Playwright and Mistral AI.

## Overview

This project showcases how to automate Duolingo's Russian language course by:
1. Automating the complete signup flow
2. Using Mistral AI to translate Russian words
3. Automatically selecting correct multiple-choice answers

## Development Process & Contribution

I personally wrote the automation code that handles:
- Initial Duolingo navigation
- Complete signup flow automation
- Language selection and preferences setup
- Reaching the first lesson question

For the critical AI integration part, I collaborated with Claude 3.7 Sonnet Agent to perfect the implementation of the Mistral AI API call and response handling.

## Technical Approach

### Custom Mistral AI Agent
The key innovation in this project was creating a specialized Mistral AI agent with a specific system prompt:
```translate to informal english only providing one word as the answer```

This was crucial because:
- Standard AI translations typically return verbose explanations
- For automation, we needed exact single-word matches to select the correct button
- Example: When given "Привет", we needed just "hi" instead of a full linguistic explanation

This constrained response format allows the automation to accurately match the translation to the multiple-choice buttons in Duolingo's interface.

### Tools Used
- Playwright for browser automation
- Mistral AI for translations
- Node.js environment
- Environment variables for secure API key handling


## Acknowledgments

Special thanks to Claude 3.7 Sonnet Agent for assistance in perfecting the Mistral AI integration and response handling logic.
