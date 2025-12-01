"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { campaignAPI } from "@/lib/api";

interface EmailEntryProps {
  onSessionCreated: () => void;
  isRegistration?: boolean;
}

export default function EmailEntry({ onSessionCreated, isRegistration = false }: EmailEntryProps) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRegistration, setShowRegistration] = useState(isRegistration);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!fullName) {
      toast({
        title: "Missing Information",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return;
    }
    
    if (showRegistration) {
      // Validate required fields for registration
      if (!company || !jobTitle) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
    }
    
    if (!email || !isEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (showRegistration) {
        // Register the user first with full details
        await campaignAPI.register(
          email, 
          fullName || undefined,
          company || undefined,
          jobTitle || undefined,
          businessPhone || undefined
        );
      } else {
        // For existing users, we still need to send full name for session creation
        // The backend will update the user's full name if provided
        if (fullName) {
          await campaignAPI.register(
            email, 
            fullName,
            undefined,
            undefined,
            undefined
          );
        }
      }
      
      // Create session (works for both new and existing users)
      const response = await campaignAPI.createSession(email);
      
      if (response.success && response.token) {
        // Token is already stored in localStorage by createSession
        toast({
          title: "Success!",
          description: showRegistration 
            ? "Registration successful! You can now start playing."
            : "Welcome back! Loading your progress...",
        });
        onSessionCreated();
      } else {
        throw new Error(response.message || "Failed to create session");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col" hideClose>
        <DialogHeader>
          <DialogTitle>
            {showRegistration ? "Register to Play" : "Enter Your Email"}
          </DialogTitle>
          <DialogDescription>
            {showRegistration
              ? "Please fill in your information to register and start playing the campaign."
              : "Use your registered email to access today's game."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="space-y-4 overflow-y-auto flex-1 pr-2 mb-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            {showRegistration && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Your Job Title"
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{showRegistration ? "Business Email *" : "Email Address *"}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={showRegistration ? "business.email@company.com" : "your.email@example.com"}
                required
              />
            </div>
            {showRegistration && (
              <div className="space-y-2">
                <Label htmlFor="businessPhone">Business Phone (Optional)</Label>
                <Input
                  id="businessPhone"
                  type="tel"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            )}
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-start sm:space-x-2">
            <Button 
              type="submit" 
              className="group inline-block rounded-none font-bold px-6 py-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0" 
              disabled={isLoading}
            >
              <span className="flex items-center gap-2">
                {isLoading ? "Loading..." : showRegistration ? "Register & Start Playing" : "Continue Playing"}
                {!isLoading && <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
              </span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

