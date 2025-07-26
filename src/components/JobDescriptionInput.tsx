import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { FileText, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ResumeDisplay from "./ResumeDisplay";

interface JobDescriptionInputProps {
    onGenerateResume: (jobDescription: string) => Promise<{ resume: string; improvements: string }>;
    isGenerating: boolean;
    hasResumeContent?: boolean;
}

const JobDescriptionInput = ({ onGenerateResume, isGenerating, hasResumeContent = false }: JobDescriptionInputProps) => {
    const [jobDescription, setJobDescription] = useState("");
    const [generatedResume, setGeneratedResume] = useState("");
    const [generatedImprovements, setGeneratedImprovements] = useState("");
    const [showGenerated, setShowGenerated] = useState(false);

    const handleGenerate = async () => {
        if (!jobDescription.trim()) {
            toast({
                title: "Job description required",
                description: "Please enter a job description to generate a tailored resume.",
                variant: "destructive",
            });
            return;
        }

        try {
            const result = await onGenerateResume(jobDescription);
            setGeneratedResume(result.resume);
            setGeneratedImprovements(result.improvements);
            setShowGenerated(true);
            toast({
                title: "Resume generated successfully!",
                description: "Your tailored resume has been created with improvement suggestions.",
            });
        } catch (error) {
            toast({
                title: "Generation failed",
                description: error instanceof Error ? error.message : "Failed to generate resume.",
                variant: "destructive",
            });
        }
    };



    const handleNewGeneration = () => {
        setShowGenerated(false);
        setGeneratedResume("");
        setGeneratedImprovements("");
        setJobDescription("");
    };



    return (
        <div className="space-y-6">
            {!showGenerated ? (
                <Card className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">Generate Tailored Resume</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Paste a job description below and I&apos;ll generate a tailored resume that matches the requirements.
                            {hasResumeContent
                                ? " I&apos;ll analyze your uploaded resume for skills gaps, missing projects, and enhancement opportunities."
                                : " Since no resume was uploaded, I&apos;ll create a complete professional resume based on the job description."
                            }
                        </p>
                        <details className="mt-2">
                            <summary className="text-sm text-primary cursor-pointer hover:underline">
                                Show sample job description
                            </summary>
                            <div className="mt-2 p-3 bg-muted rounded text-xs">
                                <p className="font-medium mb-2">Sample Job Description:</p>
                                <p className="whitespace-pre-wrap">
                                    {`Software Engineer - Frontend Development

We are seeking a talented Frontend Software Engineer to join our growing team. You will be responsible for building and maintaining web applications using modern JavaScript frameworks.

Requirements:
• 2+ years of experience with React.js, TypeScript, and modern web technologies
• Strong understanding of HTML, CSS, and JavaScript fundamentals
• Experience with state management (Redux, Context API)
• Knowledge of responsive design and cross-browser compatibility
• Familiarity with version control systems (Git)
• Experience with testing frameworks (Jest, React Testing Library)
• Understanding of web accessibility standards

Responsibilities:
• Develop and maintain user-facing features using React.js
• Collaborate with designers and backend developers
• Write clean, maintainable, and well-documented code
• Participate in code reviews and technical discussions
• Optimize applications for maximum speed and scalability
• Ensure cross-browser compatibility and responsive design

Nice to have:
• Experience with Next.js or similar frameworks
• Knowledge of GraphQL and REST APIs
• Understanding of CI/CD pipelines
• Experience with cloud platforms (AWS, Vercel)`}
                                </p>
                            </div>
                        </details>
                        <Textarea
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description here... Include requirements, responsibilities, and qualifications."
                            className="min-h-[200px]"
                            disabled={isGenerating}
                        />
                        <Button
                            onClick={handleGenerate}
                            disabled={isGenerating || !jobDescription.trim()}
                            className="w-full"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Generating Resume...
                                </>
                            ) : (
                                <>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Generate Tailored Resume
                                </>
                            )}
                        </Button>
                    </div>
                </Card>
            ) : (
                <ResumeDisplay
                    resume={generatedResume}
                    improvements={generatedImprovements}
                    onGenerateAnother={handleNewGeneration}
                    onBack={() => setShowGenerated(false)}
                />
            )}
        </div>
    );
};

export default JobDescriptionInput; 