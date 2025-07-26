import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Copy, Download, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
    resumeContent: string;
    jobTitle: string;
    company: string;
}

const ResumeModal = ({ isOpen, onClose, resumeContent, jobTitle, company }: ResumeModalProps) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(resumeContent);
            setCopied(true);
            toast({
                title: "Resume copied!",
                description: "The resume content has been copied to your clipboard.",
            });
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            toast({
                title: "Copy failed",
                description: "Failed to copy resume to clipboard.",
                variant: "destructive",
            });
        }
    };

    const handleDownload = () => {
        const blob = new Blob([resumeContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `resume-${jobTitle}-${company}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
            title: "Resume downloaded!",
            description: "Your custom resume has been downloaded.",
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        <span>Custom Resume for {jobTitle} at {company}</span>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="w-4 h-4" />
                        </Button>
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex space-x-2">
                        <Button onClick={handleCopy} variant="outline" size="sm">
                            <Copy className="w-4 h-4 mr-2" />
                            {copied ? "Copied!" : "Copy"}
                        </Button>
                        <Button onClick={handleDownload} variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                    </div>

                    <Card className="p-6">
                        <div className="whitespace-pre-wrap font-mono text-sm">
                            {resumeContent}
                        </div>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ResumeModal; 