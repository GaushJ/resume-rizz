"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit, Briefcase, Save, X, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { sendMessage, isApiConfigured } from "@/lib/api";
import ResumeModal from "@/components/ResumeModal";

interface JobDescription {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  createdAt: Date;
}

const Jobs = () => {
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [generatingResume, setGeneratingResume] = useState<string | null>(null);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [generatedResume, setGeneratedResume] = useState<{
    content: string;
    jobTitle: string;
    company: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: ""
  });

  const handleAddJob = () => {
    if (!formData.title || !formData.company || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newJob: JobDescription = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date()
    };

    setJobDescriptions(prev => [...prev, newJob]);
    setFormData({ title: "", company: "", description: "", requirements: "" });
    setShowAddForm(false);

    toast({
      title: "Job added successfully!",
      description: "The job description has been added to your list."
    });
  };

  const handleEditJob = (id: string) => {
    const job = jobDescriptions.find(j => j.id === id);
    if (job) {
      setFormData({
        title: job.title,
        company: job.company,
        description: job.description,
        requirements: job.requirements
      });
      setEditingId(id);
    }
  };

  const handleUpdateJob = () => {
    if (!formData.title || !formData.company || !formData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setJobDescriptions(prev => prev.map(job =>
      job.id === editingId
        ? { ...job, ...formData }
        : job
    ));

    setEditingId(null);
    setFormData({ title: "", company: "", description: "", requirements: "" });

    toast({
      title: "Job updated successfully!",
      description: "The job description has been updated."
    });
  };

  const handleDeleteJob = (id: string) => {
    setJobDescriptions(prev => prev.filter(job => job.id !== id));
    toast({
      title: "Job deleted",
      description: "The job description has been removed."
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAddForm(false);
    setFormData({ title: "", company: "", description: "", requirements: "" });
  };

  const handleGenerateResume = async (job: JobDescription) => {
    if (!isApiConfigured()) {
      toast({
        title: "API not configured",
        description: "Please configure your AI API key in Settings to generate custom resumes.",
        variant: "destructive"
      });
      return;
    }

    setGeneratingResume(job.id);

    try {
      // Create a comprehensive prompt for resume generation
      const jobPrompt = `Generate a customized resume for the following job:

Job Title: ${job.title}
Company: ${job.company}

Job Description:
${job.description}

${job.requirements ? `Requirements:
${job.requirements}` : ''}

Please create a professional resume that:
1. Highlights relevant skills and experiences that match this job description
2. Uses keywords from the job posting to optimize for ATS systems
3. Tailors the summary and experience sections to align with the company's needs
4. Includes a compelling cover letter section
5. Formats the resume in a clean, professional structure

Please provide the resume in a structured format with clear sections.`;

      const response = await sendMessage(jobPrompt, []);

      // Store the generated resume and show modal
      setGeneratedResume({
        content: response,
        jobTitle: job.title,
        company: job.company
      });
      setShowResumeModal(true);

      toast({
        title: "Custom Resume Generated!",
        description: "Your personalized resume has been created based on the job description.",
      });

    } catch (error) {
      console.error('Error generating resume:', error);
      toast({
        title: "Error generating resume",
        description: error instanceof Error ? error.message : "Failed to generate custom resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setGeneratingResume(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Job Management</h1>
          <p className="text-muted-foreground">
            Add and manage job descriptions to generate customized resumes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add/Edit Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                {editingId ? 'Edit Job' : 'Add New Job'}
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>

                <div>
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="e.g. Tech Corp"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Job Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Paste the job description here..."
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="Key requirements and qualifications..."
                    rows={4}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={editingId ? handleUpdateJob : handleAddJob}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingId ? 'Update' : 'Add'} Job
                  </Button>

                  {(editingId || showAddForm) && (
                    <Button variant="outline" onClick={cancelEdit}>
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Job List */}
          <div className="lg:col-span-2">
            {jobDescriptions.length === 0 ? (
              <Card className="p-8 text-center">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No jobs added yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add job descriptions to start generating customized resumes
                </p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Job
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {jobDescriptions.map((job) => (
                  <Card key={job.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <p className="text-muted-foreground">{job.company}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Added {job.createdAt.toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditJob(job.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteJob(job.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm mb-1">Description</h4>
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {job.description}
                        </p>
                      </div>

                      {job.requirements && (
                        <div>
                          <h4 className="font-medium text-sm mb-1">Requirements</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {job.requirements}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleGenerateResume(job)}
                        disabled={generatingResume === job.id}
                      >
                        {generatingResume === job.id ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          "Generate Custom Resume"
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resume Modal */}
      {generatedResume && (
        <ResumeModal
          isOpen={showResumeModal}
          onClose={() => {
            setShowResumeModal(false);
            setGeneratedResume(null);
          }}
          resumeContent={generatedResume.content}
          jobTitle={generatedResume.jobTitle}
          company={generatedResume.company}
        />
      )}
    </div>
  );
};

export default Jobs;