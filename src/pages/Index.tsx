"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Target, Zap } from "lucide-react";
import Header from "@/components/Header";
import FileUpload from "@/components/FileUpload";
import ChatInterface from "@/components/ChatInterface";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import { sendMessage, generateTailoredResume, isApiConfigured } from "@/lib/api";
import { extractDocxText } from "@/lib/docxParser";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [docxContent, setDocxContent] = useState<string>("");
  const [showChat, setShowChat] = useState(false);
  const [isParsingDocx, setIsParsingDocx] = useState(false);
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [isGeneratingResume, setIsGeneratingResume] = useState(false);

  const handleFileUpload = async (file: File | null) => {
    setUploadedFile(file);
    if (file) {
      setIsParsingDocx(true);
      try {
        // Extract DOCX content
        const content = await extractDocxText(file);
        setDocxContent(content);
        setShowChat(true);
        console.log('DOCX content extracted and stored');
        toast({
          title: "Resume analyzed successfully!",
          description: `Extracted ${content.length} characters from your resume. The AI can now provide personalized recommendations based on your resume content.`,
        });
      } catch (error) {
        console.error('Error extracting DOCX content:', error);
        // Still show chat but without DOCX content
        setDocxContent("");
        setShowChat(true);
        console.log('Continuing without DOCX content due to parsing error');
        toast({
          title: "DOCX parsing failed",
          description: error instanceof Error ? error.message : "Could not extract text from DOCX, but you can still use the chat.",
          variant: "destructive",
        });
      } finally {
        setIsParsingDocx(false);
      }
    } else {
      setDocxContent("");
    }
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      // Check if API is configured
      if (!isApiConfigured()) {
        return "I understand your request. However, to provide accurate resume analysis and job recommendations, please configure your AI API key in the Settings page.";
      }

      // Send message to the appropriate API with DOCX content
      const response = await sendMessage(message, [], docxContent);
      return response;

    } catch (error) {
      console.error('Error sending message:', error);
      return `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your API configuration in Settings.`;
    }
  };

  const handleGenerateResume = async (jobDescription: string): Promise<{ resume: string; improvements: string }> => {
    try {
      setIsGeneratingResume(true);
      const result = await generateTailoredResume(jobDescription, docxContent);
      return result;
    } catch (error) {
      console.error('Error generating resume:', error);
      throw error;
    } finally {
      setIsGeneratingResume(false);
    }
  };

  const features = [
    {
      icon: Target,
      title: "Fix your resume",
      description: "AI analyzes your resume and give suggestions to improve it."
    },
    {
      icon: Sparkles,
      title: "ATS Optimization",
      description: "Ensure your resume passes through Applicant Tracking Systems"
    },
    {
      icon: Zap,
      title: "Custom Resumes",
      description: "Generate tailored resumes for each job description automatically"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {!showChat ? (
          // Landing/Upload Section
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                AI-Powered Resume Optimization
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Upload your resume and let AI find the perfect jobs, optimize for ATS,
                and generate customized versions for every opportunity.
              </p>
            </div>

            {/* Upload Section */}
            <div className="max-w-2xl mx-auto">
              <FileUpload onFileUpload={handleFileUpload} uploadedFile={uploadedFile} isParsing={isParsingDocx} />

              <div className="mt-6 text-center space-y-4">
                {uploadedFile && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={() => setShowChat(true)} size="lg">
                      Start AI Analysis
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        ) : showJobDescription ? (
          // Job Description Input Section
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Generate Tailored Resume</h2>
                  <p className="text-muted-foreground">
                    File: {uploadedFile?.name}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowJobDescription(false)}
                  >
                    Back to Analysis
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowChat(false)}
                  >
                    Upload Different Resume
                  </Button>
                </div>
              </div>
            </div>

            <JobDescriptionInput
              onGenerateResume={handleGenerateResume}
              isGenerating={isGeneratingResume}
              hasResumeContent={!!docxContent}
            />
          </div>
        ) : (
          // Chat Interface Section
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Resume Analysis</h2>
                  <p className="text-muted-foreground">
                    File: {uploadedFile?.name}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowJobDescription(true)}
                  >
                    Generate Tailored Resume
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowChat(false)}
                  >
                    Upload Different Resume
                  </Button>
                </div>
              </div>
            </div>

            <ChatInterface
              initialMessage={
                docxContent
                  ? "Hello! I've analyzed your resume and I'm ready to help you optimize it for job applications. I can help you find matching jobs, optimize for ATS systems, and create customized versions. What would you like to focus on first?"
                  : "Hello! I can help you with resume optimization and job recommendations. However, I don't see any resume content to analyze. Please upload a DOCX resume for better assistance."
              }
              onSendMessage={handleSendMessage}
              hasPdfContent={!!docxContent}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
