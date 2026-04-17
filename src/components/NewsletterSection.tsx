"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ScrollReveal from "@/components/ScrollReveal";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setEmail("");
    toast.success("You're on the list — we'll be in touch!");
  };

  return (
    <section className="mt-16 pb-8">
      <ScrollReveal direction="up">
        <div className="glass-panel rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="relative z-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
              Stay ahead of the curve
            </h2>
            <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto mb-6">
              Get the latest tech news, opportunities, and tutorials delivered to your inbox every week.
            </p>
            {submitted ? (
              <p className="text-primary font-medium text-sm">
                Thanks for subscribing! We'll reach out soon.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-muted/60 backdrop-blur-sm rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border border-border/30 outline-none focus:ring-2 focus:ring-primary/30"
                  required
                />
                <button
                  type="submit"
                  className="lux-button flex items-center justify-center gap-2 bg-foreground text-background px-6 py-3 rounded-xl text-sm font-medium"
                >
                  <Send className="w-4 h-4" /> Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
};

export default NewsletterSection;
