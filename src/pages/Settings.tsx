"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Key, Brain, Save, Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Header from "@/components/Header";

interface Settings {
  apiKey: string;
  aiModel: string;
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  autoSave: boolean;
}

const Settings = () => {
  const [settings, setSettings] = useState<Settings>({
    apiKey: "",
    aiModel: "gpt-4",
    systemPrompt: "You are an expert resume writer and career advisor. Help users optimize their resumes for ATS systems and specific job descriptions. Provide actionable feedback and suggestions.",
    temperature: 0.7,
    maxTokens: 2000,
    autoSave: true
  });

  const [showApiKey, setShowApiKey] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('resumeai-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSetting = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('resumeai-settings', JSON.stringify(settings));
    setHasChanges(false);
    toast({
      title: "Settings saved successfully!",
      description: "Your AI configuration has been updated."
    });
  };

  const resetSettings = () => {
    const defaultSettings: Settings = {
      apiKey: "",
      aiModel: "gpt-4",
      systemPrompt: "You are an expert resume writer and career advisor. Help users optimize their resumes for ATS systems and specific job descriptions. Provide actionable feedback and suggestions.",
      temperature: 0.7,
      maxTokens: 2000,
      autoSave: true
    };
    setSettings(defaultSettings);
    setHasChanges(true);
    toast({
      title: "Settings reset",
      description: "All settings have been reset to defaults."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Configure your AI model and preferences
            </p>
          </div>

          <div className="space-y-6">
            {/* API Configuration */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Key className="w-5 h-5 mr-2" />
                API Configuration
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <Input
                        id="apiKey"
                        type={showApiKey ? "text" : "password"}
                        value={settings.apiKey}
                        onChange={(e) => updateSetting('apiKey', e.target.value)}
                        placeholder={settings.aiModel.startsWith('claude') ? "sk-ant-..." : "sk-..."}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your API key is stored locally and never sent to our servers
                  </p>
                </div>

                <div>
                  <Label htmlFor="aiModel">AI Model</Label>
                  <Select value={settings.aiModel} onValueChange={(value) => updateSetting('aiModel', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4 (Recommended)</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                      <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* AI Behavior */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI Behavior
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="systemPrompt">System Prompt</Label>
                  <Textarea
                    id="systemPrompt"
                    value={settings.systemPrompt}
                    onChange={(e) => updateSetting('systemPrompt', e.target.value)}
                    rows={4}
                    placeholder="Define how the AI should behave..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="temperature">Creativity (Temperature)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      min="0"
                      max="2"
                      step="0.1"
                      value={settings.temperature}
                      onChange={(e) => updateSetting('temperature', parseFloat(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      0 = Focused, 1 = Balanced, 2 = Creative
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="maxTokens">Max Response Length</Label>
                    <Input
                      id="maxTokens"
                      type="number"
                      min="100"
                      max="4000"
                      step="100"
                      value={settings.maxTokens}
                      onChange={(e) => updateSetting('maxTokens', parseInt(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Longer responses use more tokens
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* General Preferences */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">General Preferences</h3>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoSave">Auto-save conversations</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically save your chat history locally
                  </p>
                </div>
                <Switch
                  id="autoSave"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                />
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <Button variant="outline" onClick={resetSettings}>
                Reset to Defaults
              </Button>

              <Button
                onClick={saveSettings}
                disabled={!hasChanges}
                className="flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
            </div>

            {/* Help Text */}
            <Card className="p-4 bg-muted/50">
              <h4 className="font-medium mb-2">Need an API key?</h4>
              <p className="text-sm text-muted-foreground">
                {settings.aiModel.startsWith('claude') ? (
                  <>
                    Get your Anthropic API key from{" "}
                    <a
                      href="https://console.anthropic.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      console.anthropic.com
                    </a>
                    . Your key should start with &quot;sk-ant-&quot;.
                  </>
                ) : (
                  <>
                    Get your OpenAI API key from{" "}
                    <a
                      href="https://platform.openai.com/api-keys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      platform.openai.com/api-keys
                    </a>
                    . Your key should start with &quot;sk-&quot;.
                  </>
                )}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;