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




