import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
    Download,
    Copy,
    FileText,
    Lightbulb,
    CheckCircle,
    AlertCircle,
    ArrowLeft,
    RefreshCw
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ResumeDisplayProps {
    resume: string;
    improvements: string;
    onGenerateAnother: () => void;
    onBack: () => void;
}

const ResumeDisplay = ({ resume, improvements, onGenerateAnother, onBack }: ResumeDisplayProps) => {
    const [copied, setCopied] = useState(false);

    const handleDownload = () => {
        const blob = new Blob([resume], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tailored-resume.tex';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
            title: "Resume downloaded",
            description: "Your tailored resume has been downloaded as a LaTeX file.",
        });
    };

    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(resume);
            setCopied(true);
            toast({
                title: "Copied to clipboard",
                description: "The LaTeX resume has been copied to your clipboard.",
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast({
                title: "Copy failed",
                description: "Failed to copy to clipboard. Please try downloading instead.",
                variant: "destructive",
            });
        }
    };

    const parseImprovements = (improvementsText: string) => {
        // Split by common section separators
        const sections = improvementsText
            .split(/\n\n+|\n•\s|\n-\s|\n\*\s/)
            .filter(section => section.trim())
            .map(section => section.trim());

        return sections.map((section, index) => {
            const lines = section.split('\n');
            let title = '';
            let content = '';

            // Try to extract title from first line
            if (lines.length > 0) {
                const firstLine = lines[0].trim();
                // Check if first line looks like a title (ends with colon, is short, or contains keywords)
                if (firstLine.endsWith(':') || firstLine.length < 50 ||
                    /^(summary|skills|experience|education|projects|improvements|suggestions|analysis)/i.test(firstLine)) {
                    title = firstLine.replace(/[:•\-\*]\s*$/, '').trim();
                    content = lines.slice(1).join('\n').trim();
                } else {
                    // If no clear title, use first few words as title
                    title = firstLine.split(' ').slice(0, 3).join(' ') + '...';
                    content = section;
                }
            }

            // If no title was found, create a generic one
            if (!title) {
                title = `Improvement ${index + 1}`;
                content = section;
            }

            // Categorize sections for better display
            const category = getCategory(title);
            return { id: index, title, content, category };
        });
    };

    const getCategory = (title: string) => {
        const lowerTitle = title.toLowerCase();
        if (lowerTitle.includes('skill') || lowerTitle.includes('technical')) return 'skills';
        if (lowerTitle.includes('project')) return 'projects';
        if (lowerTitle.includes('experience') || lowerTitle.includes('work')) return 'experience';
        if (lowerTitle.includes('education')) return 'education';
        if (lowerTitle.includes('summary') || lowerTitle.includes('overview')) return 'summary';
        return 'general';
    };

    const improvementSections = parseImprovements(improvements);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Main Resume Section */}
            <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={onBack}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <h2 className="text-xl font-semibold">Generated Resume</h2>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={onGenerateAnother}>
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Generate Another
                        </Button>
                        <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
                            <Copy className="w-4 h-4 mr-2" />
                            {copied ? "Copied!" : "Copy"}
                        </Button>
                        <Button size="sm" onClick={handleDownload}>
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </div>

                <Card className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-primary" />
                            <span className="font-medium">LaTeX Resume</span>
                        </div>
                        <Badge variant="secondary">Ready to compile</Badge>
                    </div>
                    <ScrollArea className="h-[600px]">
                        <pre className="whitespace-pre-wrap text-sm font-mono bg-muted p-4 rounded border overflow-auto">
                            {resume}
                        </pre>
                    </ScrollArea>
                </Card>
            </div>

            {/* Improvements Sidebar */}
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold">Analysis & Improvements</h3>
                </div>

                {/* Summary Stats */}
                {improvementSections.length > 0 && (
                    <Card className="p-3 bg-muted/50">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="text-center">
                                <div className="font-semibold text-blue-600">
                                    {improvementSections.filter(s => s.category === 'skills').length}
                                </div>
                                <div className="text-muted-foreground">Skills</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-green-600">
                                    {improvementSections.filter(s => s.category === 'projects').length}
                                </div>
                                <div className="text-muted-foreground">Projects</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-purple-600">
                                    {improvementSections.filter(s => s.category === 'experience').length}
                                </div>
                                <div className="text-muted-foreground">Experience</div>
                            </div>
                            <div className="text-center">
                                <div className="font-semibold text-orange-600">
                                    {improvementSections.filter(s => !['skills', 'projects', 'experience'].includes(s.category)).length}
                                </div>
                                <div className="text-muted-foreground">Other</div>
                            </div>
                        </div>
                    </Card>
                )}

                <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                        {improvementSections.length > 0 ? (
                            <>
                                {/* Skills Section */}
                                {improvementSections.filter(s => s.category === 'skills').length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-primary flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Skills Analysis & Enhancements
                                        </h4>
                                        {improvementSections.filter(s => s.category === 'skills').map((section) => (
                                            <Card key={section.id} className="p-3 border-l-4 border-l-blue-500">
                                                <h5 className="font-medium text-sm mb-2">{section.title}</h5>
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                    {section.content}
                                                </p>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {/* Projects Section */}
                                {improvementSections.filter(s => s.category === 'projects').length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-primary flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Projects Analysis & Additions
                                        </h4>
                                        {improvementSections.filter(s => s.category === 'projects').map((section) => (
                                            <Card key={section.id} className="p-3 border-l-4 border-l-green-500">
                                                <h5 className="font-medium text-sm mb-2">{section.title}</h5>
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                    {section.content}
                                                </p>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {/* Experience Section */}
                                {improvementSections.filter(s => s.category === 'experience').length > 0 && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-primary flex items-center">
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            Experience Enhancements
                                        </h4>
                                        {improvementSections.filter(s => s.category === 'experience').map((section) => (
                                            <Card key={section.id} className="p-3 border-l-4 border-l-purple-500">
                                                <h5 className="font-medium text-sm mb-2">{section.title}</h5>
                                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                                    {section.content}
                                                </p>
                                            </Card>
                                        ))}
                                    </div>
                                )}

                                {/* Other Improvements */}
                                {improvementSections.filter(s => !['skills', 'projects', 'experience'].includes(s.category)).map((section) => (
                                    <Card key={section.id} className="p-3 border-l-4 border-l-orange-500">
                                        <div className="flex items-start space-x-2 mb-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <h5 className="font-medium text-sm">{section.title}</h5>
                                        </div>
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                            {section.content}
                                        </p>
                                    </Card>
                                ))}
                            </>
                        ) : (
                            <Card className="p-4">
                                <div className="flex items-start space-x-2">
                                    <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-sm">No Specific Improvements</h4>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            The resume appears to be well-structured and complete for this job description.
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default ResumeDisplay; 