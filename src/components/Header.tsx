"use client";

import { Button } from "@/components/ui/button";
import { Settings, FileText, Briefcase } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ResumeAI
            </span>
          </Link>

          <nav className="flex items-center space-x-4">
            <Button
              variant={isActive("/") ? "default" : "ghost"}
              asChild
            >
              <Link href="/">
                <FileText className="w-4 h-4 mr-2" />
                Upload Resume
              </Link>
            </Button>

            <Button
              variant={isActive("/jobs") ? "default" : "ghost"}
              asChild
            >
              <Link href="/jobs">
                <Briefcase className="w-4 h-4 mr-2" />
                Job Management
              </Link>
            </Button>

            <Button
              variant={isActive("/settings") ? "default" : "ghost"}
              asChild
            >
              <Link href="/settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;