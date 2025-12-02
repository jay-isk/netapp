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
            ? "Registration successful! Loading your game..."
            : "Welcome! Loading your game...",
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
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col bg-[#540063] border-[#E424FF]" hideClose>
        <DialogHeader>
          <DialogTitle className="text-white">
            {showRegistration ? "Register to Play" : "Confirm Your Details"}
          </DialogTitle>
          <DialogDescription className="text-gray-200">
            {showRegistration
              ? "Please fill in your information to register and start playing the campaign."
              : "Use your registered email to access today's game."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="space-y-4 overflow-y-auto flex-1 pr-2 mb-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                required
                className="bg-transparent border-white/30 text-white placeholder:text-white/50 focus-visible:border-[#E424FF]"
              />
            </div>
            {showRegistration && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-white">Company *</Label>
                  <Input
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company Name"
                    required
                    className="bg-transparent border-white/30 text-white placeholder:text-white/50 focus-visible:border-[#E424FF]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-white">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="Your Job Title"
                    required
                    className="bg-transparent border-white/30 text-white placeholder:text-white/50 focus-visible:border-[#E424FF]"
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">{showRegistration ? "Business Email *" : "Email Address *"}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={showRegistration ? "business.email@company.com" : "your.email@example.com"}
                required
                className="bg-transparent border-white/30 text-white placeholder:text-white/50 focus-visible:border-[#E424FF]"
              />
            </div>
            {showRegistration && (
              <div className="space-y-2">
                <Label htmlFor="businessPhone" className="text-white">Business Phone (Optional)</Label>
                <Input
                  id="businessPhone"
                  type="tel"
                  value={businessPhone}
                  onChange={(e) => setBusinessPhone(e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="bg-transparent border-white/30 text-white placeholder:text-white/50 focus-visible:border-[#E424FF]"
                />
              </div>
            )}
          </div>
          <div className="flex justify-start sm:justify-start">
              <Button 
                type="submit" 
                className="group inline-block rounded-none font-bold px-6 py-2 bg-[#E424FF] hover:bg-[#d010eb] text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0" 
                disabled={isLoading}
              >
                <span className="flex items-center gap-2">
                  {isLoading ? "Loading..." : showRegistration ? "Register & Play Now" : "Play Now"}
                  {!isLoading && <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
                </span>
              </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

