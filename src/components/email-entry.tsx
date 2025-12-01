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
import { useToast } from "@/hooks/use-toast";
import { campaignAPI } from "@/lib/api";

interface EmailEntryProps {
  onSessionCreated: () => void;
  isRegistration?: boolean;
}

export default function EmailEntry({ onSessionCreated, isRegistration = false }: EmailEntryProps) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (isRegistration) {
      // Validate required fields for registration
      if (!firstName || !lastName || !company || !jobTitle) {
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
      if (isRegistration) {
        // Register first, then create session
        await campaignAPI.register(
          email, 
          firstName || undefined, 
          lastName || undefined,
          company || undefined,
          jobTitle || undefined,
          businessPhone || undefined
        );
      }
      
      // Create session
      const response = await campaignAPI.createSession(email);
      
      if (response.success && response.token) {
        // Token is already stored in localStorage by createSession
        toast({
          title: "Success!",
          description: isRegistration 
            ? "Registration successful! You can now start playing."
            : "Welcome back! Loading your progress...",
        });
        onSessionCreated();
      } else {
        throw new Error("Failed to create session");
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
            {isRegistration ? "Register to Play" : "Enter Your Email"}
          </DialogTitle>
          <DialogDescription>
            {isRegistration
              ? "Please fill in your information to register and start playing the campaign."
              : "Enter the same email you used to register to continue playing."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="space-y-4 overflow-y-auto flex-1 pr-2 mb-4">
            {isRegistration && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
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
              <Label htmlFor="email">{isRegistration ? "Business Email *" : "Email Address *"}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isRegistration ? "business.email@company.com" : "your.email@example.com"}
                required
              />
            </div>
            {isRegistration && (
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
          <Button type="submit" className="w-full mt-auto" disabled={isLoading}>
            {isLoading ? "Loading..." : isRegistration ? "Register & Start Playing" : "Continue Playing"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

