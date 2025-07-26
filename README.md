# AI Resume Assistant

A React-based application that helps users optimize their resumes using AI. The app supports both OpenAI and Claude models for resume analysis and job recommendations.

## Features

- **PDF Resume Upload**: Upload and parse PDF resumes to extract text content
- **AI-Powered Analysis**: Get personalized resume feedback and optimization suggestions
- **Multi-Model Support**: Choose between OpenAI (GPT-4, GPT-3.5) and Claude models
- **ATS Optimization**: Ensure your resume passes through Applicant Tracking Systems
- **Job Matching**: Find jobs that match your skills and experience
- **Custom Resumes**: Generate tailored resumes for specific job descriptions

## DOCX Processing

The application supports DOCX resume uploads and extracts text content for AI analysis:

- DOCX files are validated for size and format
- Text content is extracted using mammoth library
- Extracted content is included in AI conversations for context
- AI provides personalized resume optimization and job recommendations based on the extracted content

## Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the proxy server** (for API calls):

   ```bash
   node server.js
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Configure API keys** in the Settings page:
   - OpenAI: Get your key from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Claude: Get your key from [console.anthropic.com](https://console.anthropic.com)

## Usage

1. Upload your PDF resume
2. Configure your AI API key in Settings
3. Choose your preferred AI model
4. Start chatting with the AI about your resume
5. Get personalized recommendations for optimization

## Project info

**URL**: https://lovable.dev/projects/5d3c83cf-783a-437e-83d7-7344eab03d83

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/5d3c83cf-783a-437e-83d7-7344eab03d83) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/5d3c83cf-783a-437e-83d7-7344eab03d83) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
