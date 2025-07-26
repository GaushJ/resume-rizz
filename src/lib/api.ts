interface Settings {
    apiKey: string;
    aiModel: string;
    systemPrompt: string;
    temperature: number;
    maxTokens: number;
    autoSave: boolean;
}

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

// Get settings from localStorage
const getSettings = (): Settings => {
    const savedSettings = localStorage.getItem('resumeai-settings');
    if (savedSettings) {
        return JSON.parse(savedSettings);
    }
    return {
        apiKey: "",
        aiModel: "gpt-4",
        systemPrompt: "You are an expert resume writer and career advisor. Help users optimize their resumes for ATS systems and specific job descriptions. Provide actionable feedback and suggestions.",
        temperature: 0.7,
        maxTokens: 2000,
        autoSave: true
    };
};

// OpenAI API call
const callOpenAI = async (messages: Message[], settings: Settings): Promise<string> => {
    const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            apiKey: settings.apiKey,
            model: settings.aiModel,
            messages: [
                { role: 'user', content: settings.systemPrompt },
                ...messages
            ],
            temperature: settings.temperature,
            maxTokens: settings.maxTokens,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
};

// Claude API call
const callClaude = async (messages: Message[], settings: Settings): Promise<string> => {
    // Map model names to Claude model identifiers
    const modelMap: { [key: string]: string } = {
        'claude-3-sonnet': 'claude-3-5-sonnet-20241022',
        'claude-3-haiku': 'claude-3-5-haiku-20241022',
    };

    const claudeModel = modelMap[settings.aiModel] || 'claude-3-5-sonnet-20241022';

    const response = await fetch('/api/anthropic', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            apiKey: settings.apiKey,
            model: claudeModel,
            messages: [
                { role: 'user', content: settings.systemPrompt },
                ...messages
            ],
            temperature: settings.temperature,
            maxTokens: settings.maxTokens,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(`Claude API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.content[0].text;
};

// Main API function that determines which service to use
export const sendMessage = async (
    userMessage: string,
    conversationHistory: Message[] = [],
    docxContent?: string
): Promise<string> => {
    const settings = getSettings();

    if (!settings.apiKey) {
        throw new Error('API key not configured. Please set your API key in Settings.');
    }

    // Create the full message content including DOCX if available
    let fullMessage = userMessage;
    if (docxContent) {
        fullMessage = `Resume Content:\n${docxContent}\n\nUser Question: ${userMessage}`;
        console.log(`Sending message with DOCX content (${docxContent.length} chars)`);
    } else {
        console.log('Sending message without DOCX content');
    }

    const messages: Message[] = [
        ...conversationHistory,
        { role: 'user', content: fullMessage }
    ];

    // Determine which API to use based on the model
    if (settings.aiModel.startsWith('claude')) {
        return await callClaude(messages, settings);
    } else {
        return await callOpenAI(messages, settings);
    }
};

// Helper function to check if API is configured
export const isApiConfigured = (): boolean => {
    const settings = getSettings();
    return !!settings.apiKey;
};

// Helper function to get current model info
export const getCurrentModelInfo = (): { model: string; provider: string } => {
    const settings = getSettings();
    const provider = settings.aiModel.startsWith('claude') ? 'Anthropic' : 'OpenAI';
    return { model: settings.aiModel, provider };
};

// Function to generate tailored resume based on job description
export const generateTailoredResume = async (
    jobDescription: string,
    resumeContent?: string
): Promise<{ resume: string; improvements: string }> => {
    const settings = getSettings();

    if (!settings.apiKey) {
        throw new Error('API key not configured. Please set your API key in Settings.');
    }

    const systemPrompt = `You are an expert resume writer specializing in LaTeX resume creation. Your task is to generate a tailored resume in LaTeX format based on a job description and optionally the user's existing resume content.

IMPORTANT: You must provide TWO responses:
1. A complete LaTeX resume document
2. A detailed analysis of improvements and suggestions

RESPONSE FORMAT:
===LATEX_RESUME===
[Complete LaTeX document here]
===IMPROVEMENTS===
[Detailed improvements and suggestions here]

ANALYSIS GUIDELINES:
- If the existing resume is inadequate, blank, or has insufficient information, create a complete professional resume
- Identify gaps in skills, experience, projects, and achievements
- Suggest specific improvements for each section
- Add relevant projects and achievements that match the job requirements
- Provide actionable suggestions for enhancement
- If the uploaded resume is minimal or lacks detail, enhance it with realistic but impressive content
- Add missing sections like projects, achievements, or skills that are relevant to the job
- Provide specific, actionable feedback on what was improved and why

SKILLS ANALYSIS:
- Analyze the job description for required technical skills, programming languages, tools, and frameworks
- Compare with the provided resume's skills section
- Add missing skills that are relevant to the job description
- Ensure skills are categorized properly (Technical, Programming, Tools, Soft Skills)
- Include both hard skills and soft skills mentioned in the job requirements

PROJECTS ANALYSIS:
- Count the number of projects in the provided resume
- If projects are less than 2-3, add relevant sample projects that demonstrate the required skills
- Projects should showcase the technical skills mentioned in the job description
- Include projects with live links, GitHub repositories, and quantifiable outcomes
- Projects should demonstrate problem-solving, technical implementation, and real-world application

LaTeX Resume Requirements:
- Use the exact template structure provided
- Include comprehensive sections: Summary, Education, Skills, Experience, Projects
- Add relevant projects and achievements if missing
- Ensure all sections are complete and professional
- Use quantifiable achievements and action verbs
- Include ATS-friendly keywords from the job description

Use this exact LaTeX template structure:
\\documentclass{resume}
\\usepackage[left=0.4 in,top=0.4in,right=0.4 in,bottom=0.4in]{geometry}
\\newcommand{\\tab}[1]{\\hspace{.2667\\textwidth}\\rlap{#1}} 
\\newcommand{\\itab}[1]{\\hspace{0em}\\rlap{#1}}

\\name{[Professional Name]}
\\address{[Phone Number] \\\\ [City, State/Country]}
\\address{\\href{mailto:[email]}{[email]} \\\\ \\href{https://linkedin.com/in/[profile]}{LinkedIn} \\\\ \\href{[portfolio-url]}{Portfolio}}

\\begin{document}

\\begin{rSection}{SUMMARY}
[2-3 sentence professional summary tailored to the specific job requirements]
\\end{rSection}

\\begin{rSection}{EDUCATION}
{\\bf [Degree Name]}, [University Name] \\hfill {[Graduation Year]}\\\\
[Major/Field of Study] \\\\

\\end{rSection}

\\begin{rSection}{SKILLS}
\\begin{tabular}{ @{} >{\\bfseries}l @{\\hspace{6ex}} l }
Technical Skills & [Relevant technical skills from job description]\\\\
Programming & [Programming languages and frameworks]\\\\
Tools & [Development tools, software, platforms]\\\\
Soft Skills & [Leadership, communication, problem-solving]
\\end{tabular}
\\end{rSection}

\\begin{rSection}{EXPERIENCE}
{\\bf [Job Title]} \\hfill [Start Date - End Date]\\\\
[Company Name] \\hfill [Location] \\\\
\\begin{itemize}
    \\itemsep -3pt {} 
    \\item [Achievement-focused bullet point with quantifiable results]
    \\item [Another achievement with specific metrics]
    \\item [Third achievement relevant to the job]
\\end{itemize}

{\\bf [Previous Job Title]} \\hfill [Start Date - End Date]\\\\
[Previous Company] \\hfill [Location] \\\\
\\begin{itemize}
    \\itemsep -3pt {} 
    \\item [Relevant achievement]
    \\item [Another relevant achievement]
\\end{itemize}
\\end{rSection}

\\begin{rSection}{PROJECTS}
\\vspace{-1.25em}
\\item \\textbf{[Project Name].} {[Project description with technologies used and outcomes achieved. Include live links if available.]}
\\end{rSection}

\\end{document}

CRITICAL GUIDELINES:
1. Analyze the job description thoroughly and extract key requirements, skills, and responsibilities
2. If existing resume is inadequate, create a complete professional resume with realistic but impressive content
3. Add missing projects, achievements, and skills that align with the job requirements
4. Use action verbs and quantifiable achievements (%, $, numbers)
5. Include relevant keywords from the job description for ATS optimization
6. Ensure all LaTeX syntax is correct and the document will compile
7. Focus on achievements and results rather than just responsibilities
8. Keep bullet points concise but impactful
9. Provide specific, actionable improvement suggestions
10. If the uploaded resume lacks detail, enhance it with comprehensive content
11. Add relevant projects and achievements that demonstrate the required skills
12. Ensure the resume is competitive and showcases the candidate's potential

SKILLS ENHANCEMENT:
- Extract all technical skills, programming languages, frameworks, and tools from the job description
- Compare with the provided resume's skills section
- Add any missing skills that are relevant to the job
- Ensure skills are properly categorized and comprehensive
- Include both technical and soft skills mentioned in the job requirements

PROJECTS ENHANCEMENT:
- Count existing projects in the provided resume
- If projects are less than 2-3, add relevant sample projects
- Projects should demonstrate the technical skills from the job description
- Include projects with:
  * Clear problem statements and solutions
  * Technologies used (matching job requirements)
  * Quantifiable outcomes and metrics
  * Live links or GitHub repositories
  * Real-world application and impact
- Projects should showcase problem-solving, technical implementation, and innovation

Job Description: ${jobDescription}

${resumeContent ? `Existing Resume Content:\n${resumeContent}` : 'No existing resume content provided - create a complete professional resume based on the job description.'}

IMPROVEMENTS ANALYSIS FORMAT:
In the improvements section, provide detailed analysis in this format:

SKILLS ANALYSIS:
- List all skills found in the job description
- Compare with the provided resume's skills
- Identify missing skills that should be added
- Suggest specific skills to include

PROJECTS ANALYSIS:
- Count the number of projects in the provided resume
- If projects are less than 2-3, explain why more projects are needed
- Suggest specific project types that would demonstrate the required skills
- Provide project ideas that showcase the job requirements

EXPERIENCE ENHANCEMENTS:
- Identify gaps in work experience descriptions
- Suggest improvements to make achievements more quantifiable
- Recommend action verbs and metrics to include

OTHER IMPROVEMENTS:
- Any additional suggestions for resume enhancement
- ATS optimization recommendations
- Format and presentation improvements

Generate the response in the exact format specified above.`;

    const messages: Message[] = [
        { role: 'user', content: systemPrompt }
    ];

    // Determine which API to use based on the model
    let response: string;
    if (settings.aiModel.startsWith('claude')) {
        response = await callClaude(messages, settings);
    } else {
        response = await callOpenAI(messages, settings);
    }

    // Parse the response to extract LaTeX resume and improvements
    const latexMatch = response.match(/===LATEX_RESUME===\s*([\s\S]*?)\s*===IMPROVEMENTS===/);
    const improvementsMatch = response.match(/===IMPROVEMENTS===\s*([\s\S]*?)$/);

    const resume = latexMatch ? latexMatch[1].trim() : response;
    const improvements = improvementsMatch ? improvementsMatch[1].trim() : 'No specific improvements identified.';

    return { resume, improvements };
}; 