import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, File, X, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  uploadedFile?: File | null;
  isParsing?: boolean;
}

const FileUpload = ({ onFileUpload, uploadedFile, isParsing }: FileUploadProps) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.endsWith('.docx')) {
        onFileUpload(file);
        toast({
          title: "Resume uploaded successfully!",
          description: "Your resume has been uploaded and is ready for analysis.",
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a DOCX file.",
          variant: "destructive",
        });
      }
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    noClick: true, // Prevent clicking on the dropzone from opening file dialog
  });

  const removeFile = () => {
    onFileUpload(null as any);
    toast({
      title: "Resume removed",
      description: "Your resume has been removed. Upload a new one to continue.",
    });
  };

  if (uploadedFile) {
    return (
      <Card className="p-6 border-2 border-success">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              {isParsing ? (
                <div className="w-5 h-5 border-2 border-success border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle className="w-5 h-5 text-success" />
              )}
            </div>
            <div>
              <p className="font-medium text-foreground">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                {isParsing && " • Parsing..."}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={removeFile} disabled={isParsing}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card
      {...getRootProps()}
      className={`p-8 border-2 border-dashed cursor-pointer transition-all hover:border-primary/50 ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'
        }`}
    >
      <input {...getInputProps()} />
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Upload Your Resume</h3>
        <p className="text-muted-foreground mb-4">
          Drag and drop your DOCX resume here, or click to browse
        </p>
        <Button variant="outline" onClick={open}>
          <File className="w-4 h-4 mr-2" />
          Choose File
        </Button>
        <p className="text-xs text-muted-foreground mt-2">
          Supports DOCX files up to 10MB
        </p>
      </div>
    </Card>
  );
};

export default FileUpload;