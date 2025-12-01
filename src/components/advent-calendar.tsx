"use client";

import { useState, useEffect, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Check, Gift, Lock, Sparkles, X, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { campaignAPI, type Day, type DayDetails } from "@/lib/api";
import EmailEntry from "./email-entry";

interface AdventCalendarProps {
  totalDays?: number;
  onTotalDaysChange?: (days: number) => void;
}

export default function AdventCalendar({ totalDays: propTotalDays, onTotalDaysChange }: AdventCalendarProps = {}) {
  const [isClient, setIsClient] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [days, setDays] = useState<Day[]>([]);
  const [currentDay, setCurrentDay] = useState<number | null>(null);
  const [totalDays, setTotalDays] = useState<number>(propTotalDays || 12);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number | null>(null);
  const [selectedDayDetails, setSelectedDayDetails] = useState<DayDetails | null>(null);
  const [answerResult, setAnswerResult] = useState<{ is_correct: boolean; correct_answer_text: string } | null>(null);
  const [showEmailEntry, setShowEmailEntry] = useState(false);
  const [isRegistration, setIsRegistration] = useState(false);
  const [loadingDayNumber, setLoadingDayNumber] = useState<number | null>(null);
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    setIsClient(true);
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const sessionResponse = await campaignAPI.getSession();
      
      if (sessionResponse.success && sessionResponse.session) {
        setHasSession(true);
        setShowEmailEntry(false);
        await loadDashboard();
      } else {
        // No valid session found - show email entry (not registration yet)
        setHasSession(false);
        setShowEmailEntry(true);
        setIsRegistration(false); // Start with email-only form
      }
    } catch (error: any) {
      // On error, show email entry form (not registration yet)
      setHasSession(false);
      setShowEmailEntry(true);
      setIsRegistration(false); // Start with email-only form
      console.error('Session check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDashboard = async () => {
    try {
      const dashboard = await campaignAPI.getDashboard();
      
      if (dashboard.success) {
        setDays(dashboard.days);
        setCurrentDay(dashboard.current_day);
        // Get total days from days array length or API response
        const calculatedTotalDays = dashboard.total_days || dashboard.days.length || 12;
        setTotalDays(calculatedTotalDays);
        if (onTotalDaysChange) {
          onTotalDaysChange(calculatedTotalDays);
        }
      } else {
        // If dashboard fails, might need to re-authenticate
        setHasSession(false);
        setShowEmailEntry(true);
        setIsRegistration(true);
      }
    } catch (error: any) {
      // If dashboard fails, might need to re-authenticate
      setHasSession(false);
      setShowEmailEntry(true);
      setIsRegistration(true);
      console.error('Dashboard load error:', error);
    }
  };

  const handleDayClick = async (day: Day) => {
    if (day.is_locked || !day.is_available) {
      toast({
        title: "Day Locked",
        description: "This day is not yet available",
        variant: "destructive",
      });
      return;
    }

    if (day.is_completed) {
      toast({
        title: "Already Answered",
        description: "You have already answered this day's question",
      });
      return;
    }

    try {
      setLoadingDayNumber(day.day_number);
      const response = await campaignAPI.getDayDetails(day.day_number);
      
      if (response.success && response.day) {
        setSelectedDayNumber(day.day_number);
        setSelectedDayDetails(response.day);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load day details",
        variant: "destructive",
      });
    } finally {
      setLoadingDayNumber(null);
    }
  };

  const handleAnswerSubmit = async (e: FormEvent, selectedAnswer: string) => {
    e.preventDefault();
    
    if (!selectedDayNumber || !selectedDayDetails) return;

    try {
      setIsLoading(true);
      const response = await campaignAPI.submitAnswer(selectedDayNumber, selectedAnswer);
      
      if (response.success) {
        // Store the answer result with correct answer text
        setAnswerResult({
          is_correct: response.is_correct,
          correct_answer_text: response.correct_answer_text,
        });
        
        // Update day details to mark as answered
        if (selectedDayDetails) {
          setSelectedDayDetails({
            ...selectedDayDetails,
            already_answered: true,
            is_correct: response.is_correct,
            user_answer: selectedAnswer,
            correct_answer: response.correct_answer,
            correct_answer_text: response.correct_answer_text,
          });
        }
        
        // Reload dashboard to update day status
        await loadDashboard();
      } else {
        // If submission fails, might need to re-authenticate
        if (response.message && response.message.includes('session')) {
          setHasSession(false);
          setShowEmailEntry(true);
          setIsRegistration(false);
        }
      }
    } catch (error: any) {
      // Check if it's an authentication error
      if (error.message && (error.message.includes('session') || error.message.includes('401') || error.message.includes('403'))) {
        setHasSession(false);
        setShowEmailEntry(true);
        setIsRegistration(false);
        sessionStorage.removeToken();
      }
      toast({
        title: "Error",
        description: error.message || "Failed to submit answer",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionCreated = () => {
    setHasSession(true);
    setShowEmailEntry(false);
    loadDashboard();
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  // Show loading while checking session or if not client-side yet
  if (!isClient || (isLoading && !hasSession && !showEmailEntry)) {
    return (
      <div className="w-full max-w-full z-10 flex items-center justify-center p-8">
        <div className="text-primary-foreground">Loading...</div>
      </div>
    );
  }

  // Show email entry form if no session
  if (showEmailEntry && !isLoading) {
    return (
      <EmailEntry
        onSessionCreated={handleSessionCreated}
        isRegistration={isRegistration}
      />
    );
  }

  return (
    <div className="w-full max-w-full z-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {days.map((day) => {
          const unlocked = day.is_available && !day.is_locked;
          const answered = day.is_completed;

          return (
            <div
              key={day.day_number}
              className="relative rounded-lg p-[5px] bg-gradient-to-tr from-[#E424FF] via-[#ffc700] to-[#E424FF] shadow-lg group"
            >
              <button
                onClick={() => handleDayClick(day)}
                disabled={!unlocked || loadingDayNumber === day.day_number}
                className="relative aspect-[2.5/1] w-full flex items-center justify-between p-4 rounded-[6px] bg-primary shadow-lg transition-all duration-300 ease-in-out group-hover:bg-card-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-1 disabled:cursor-not-allowed disabled:bg-primary"
                aria-label={`Day ${day.day_number}, ${unlocked ? "unlocked" : "locked"}${answered ? ", completed" : ""}`}
              >
                {loadingDayNumber === day.day_number && (
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/80 rounded-[6px] z-10">
                    <Loader2 className="w-8 h-8 text-[#25006d] animate-spin" />
                  </div>
                )}
                <span className="absolute top-2 left-2 text-xs font-bold uppercase text-[#25006d] group-hover:text-[#eb5bff] transition-colors">
                  {day.day_date ? new Date(day.day_date + "T00:00:00").toLocaleDateString("en-US", { month: "long" }).toUpperCase() : "DECEMBER"}
                </span>
                {!unlocked && <Lock className="absolute top-2 right-2 w-6 h-6 text-muted-foreground/50" />}
                
                <div className="flex items-center gap-2">
                  {/* <span className="text-2xl font-bold font-headline text-[#25006d] group-hover:text-[#eb5bff] group-disabled:text-muted-foreground/30 transition-colors">
                    Day
                  </span> */}
                  {answered && <Gift className="w-6 h-6 text-accent" />}
                </div>

                <span className="text-7xl md:text-8xl font-bold font-date text-[#25006d] group-hover:text-[#eb5bff] group-disabled:text-muted-foreground/30 transition-colors">
                  {day.day_date ? new Date(day.day_date + "T00:00:00").getDate() : day.day_number}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {selectedDayDetails && (
        <QuestionModal
          day={selectedDayDetails}
          isOpen={!!selectedDayDetails}
          onClose={() => {
            setSelectedDayDetails(null);
            setSelectedDayNumber(null);
            setAnswerResult(null);
          }}
          onSubmit={handleAnswerSubmit}
          isLoading={isLoading}
          answerResult={answerResult}
        />
      )}
    </div>
  );
}

function QuestionModal({
  day,
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  answerResult,
}: {
  day: DayDetails;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: FormEvent, answer: string) => void;
  isLoading: boolean;
  answerResult?: { is_correct: boolean; correct_answer_text: string } | null;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedAnswer) {
      toast({
        title: "Select an answer",
        description: "Please select an answer before submitting",
        variant: "destructive",
      });
      return;
    }
    onSubmit(e, selectedAnswer);
  };

  const resetAndClose = () => {
    setSelectedAnswer(null);
    onClose();
  };

  const formattedDate = day.day_date 
    ? new Date(day.day_date + "T00:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : `Day ${day.day_number}`;

  // Show result if answer was just submitted (answerResult) or if already answered
  const showResult = answerResult || day.already_answered;
  const isCorrect = answerResult ? answerResult.is_correct : (day.is_correct ?? false);
  const correctAnswerText = answerResult ? answerResult.correct_answer_text : (day.correct_answer_text || '');

  if (showResult) {
    return (
      <Dialog open={isOpen} onOpenChange={resetAndClose}>
        <DialogContent className="sm:max-w-2xl bg-card border-border p-0 gap-0">
          <div className="flex flex-col items-center justify-center text-center p-8 bg-[#6f3df5] text-white rounded-t-lg">
            {isCorrect ? (
              <>
                <Check className="w-16 h-16 text-green-400 bg-white/20 rounded-full p-2 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Thanks for playing!</h2>
                <p className="text-lg mb-2">You're entered to win today's prize.</p>
                <p className="text-lg mb-2">Check back tomorrow for another chance!</p>
                {correctAnswerText && (
                  <p className="text-base mt-4 pt-4 border-t border-white/20">
                    <span className="font-semibold">Correct Answer:</span> {correctAnswerText}
                  </p>
                )}
              </>
            ) : (
              <>
                <X className="w-16 h-16 text-red-400 bg-white/20 rounded-full p-2 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Thanks for playing!</h2>
                <p className="text-lg mb-2">Please see the correct answer below,</p>
                <p className="text-lg mb-2">and check back tomorrow for another chance!</p>
                {correctAnswerText && (
                  <p className="text-base mt-4 pt-4 border-t border-white/20">
                    <span className="font-semibold">Correct Answer:</span> {correctAnswerText}
                  </p>
                )}
              </>
            )}
          </div>
          <div className="p-6 bg-white rounded-b-lg text-center text-black">
            <Button onClick={resetAndClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const options = [
    { value: "A", label: day.answer_a },
    { value: "B", label: day.answer_b },
    { value: "C", label: day.answer_c },
    { value: "D", label: day.answer_d },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="sm:max-w-2xl bg-card border-border p-0 gap-0">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="bg-[#6f3df5] text-white p-6 rounded-t-lg">
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <DialogTitle className="text-2xl font-headline flex items-center gap-2">
                  <Sparkles className="text-primary-foreground w-5 h-5" />
                  {formattedDate || `Day ${day.day_number}`}
                </DialogTitle>
                <DialogDescription className="text-lg text-white/90 pt-2">
                  Today's prize is a <span className="font-bold">{day.prize_name}</span>.
                  <br />
                  Answer the question below correctly for a chance to win.
                </DialogDescription>
              </div>
              {day.prize_image && (
                <div className="w-48 h-48 rounded-md flex items-center justify-center">
                  <Image
                    src={day.prize_image}
                    alt={`${day.prize_name} prize image`}
                    width={180}
                    height={180}
                    className="rounded-md object-contain"
                  />
                </div>
              )}
            </div>
          </DialogHeader>
          <div className="p-6 bg-white rounded-b-lg">
            <p className="text-lg text-black mb-4">{day.question}</p>
            <RadioGroup
              className="my-6 space-y-2"
              value={selectedAnswer ?? undefined}
              onValueChange={setSelectedAnswer}
            >
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="text-base text-black">
                    {option.value}. {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-start sm:space-x-2">
              <Button 
                type="submit" 
                className="group inline-block rounded-none font-bold px-6 py-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0" 
                disabled={isLoading}
              >
                <span className="flex items-center gap-2">
                  {isLoading ? "Submitting..." : "Submit Answer"}
                  {!isLoading && <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />}
                </span>
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
