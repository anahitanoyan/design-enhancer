import { Home, Users, Calendar, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/oikos/GlassCard";
import { useState } from "react";

export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: <Sparkles className="w-16 h-16 text-accent" />,
      title: "Welcome to OikOS",
      description: "Your AI-powered household operating system that helps manage schedules, tasks, and family life.",
      action: "Get Started"
    },
    {
      icon: <Home className="w-16 h-16 text-primary" />,
      title: "Create Your Household",
      description: "Set up your household to start organizing your family's life together.",
      action: "Next"
    },
    {
      icon: <Users className="w-16 h-16 text-secondary" />,
      title: "Add Family Members",
      description: "Invite family members to collaborate on schedules, tasks, and more.",
      action: "Next"
    },
    {
      icon: <Calendar className="w-16 h-16 text-accent" />,
      title: "Connect Your Calendar",
      description: "Sync your calendars so AI can help manage conflicts and schedules.",
      action: "Finish Setup"
    }
  ];

  const currentStep = steps[step];

  const handleNext = () => {
    if (step === steps.length - 1) {
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            {currentStep.icon}
          </div>
          <h1 className="text-3xl">{currentStep.title}</h1>
          <p className="text-muted-foreground">{currentStep.description}</p>
        </div>

        <div className="flex gap-2 justify-center">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all ${
                idx === step ? 'w-8 bg-primary' : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-medium hover:bg-secondary transition-colors"
        >
          {currentStep.action}
        </button>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full py-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
