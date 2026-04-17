"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, DollarSign, Calendar, Clock, Briefcase, ExternalLink, Share2, Bookmark, Building, CheckCircle2, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const opportunity = {
  title: "Software Engineering Intern – Summer 2026",
  company: "Google",
  logo: "🔵",
  type: "Internship",
  location: "Mountain View, CA (Hybrid)",
  salary: "$8,000/month",
  deadline: "March 30, 2026",
  daysLeft: 13,
  posted: "March 1, 2026",
  duration: "12 weeks",
  experience: "0–2 years",
  description: `
    <p>Join Google's engineering team as a Summer 2026 Software Engineering Intern. You'll work on large-scale distributed systems that impact billions of users worldwide.</p>
    <h3>What You'll Do</h3>
    <ul>
      <li>Design and implement features for Google's core infrastructure</li>
      <li>Collaborate with senior engineers on system architecture decisions</li>
      <li>Write production-quality code in C++, Java, or Python</li>
      <li>Participate in code reviews and contribute to engineering best practices</li>
      <li>Present your project outcomes to your team and stakeholders</li>
    </ul>
    <h3>Requirements</h3>
    <ul>
      <li>Currently pursuing a BS/MS/PhD in Computer Science or related field</li>
      <li>Strong foundation in data structures and algorithms</li>
      <li>Experience with at least one programming language (C++, Java, Python, or Go)</li>
      <li>Familiarity with distributed systems concepts is a plus</li>
    </ul>
    <h3>Benefits</h3>
    <ul>
      <li>Competitive monthly stipend of $8,000</li>
      <li>Housing assistance and relocation support</li>
      <li>Access to Google's campus amenities and tech talks</li>
      <li>Full-time conversion opportunity for top performers</li>
    </ul>
  `,
  tags: ["Python", "Distributed Systems", "ML", "C++", "Java"],
  applyUrl: "#",
};

const similarOpps = [
  { title: "Backend Engineering Intern", company: "Shopify", type: "Internship", salary: "$6,500/mo", daysLeft: 24, logo: "🟢" },
  { title: "ML Research Intern", company: "DeepMind", type: "Internship", salary: "$9,000/mo", daysLeft: 18, logo: "🔷" },
  { title: "Product Engineering Intern", company: "Notion", type: "Internship", salary: "$7,500/mo", daysLeft: 32, logo: "📝" },
];

const OpportunityDetailPage = () => {
  const { slug } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-[1320px] mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <ScrollReveal direction="up">
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-category hover:underline flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Home</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <Link href="/category/opportunities" className="text-category hover:underline">Opportunities</Link>
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
            <span className="text-muted-foreground">{opportunity.type}</span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Main */}
          <div>
            {/* Header Card */}
            <ScrollReveal direction="up" delay={0.05}>
              <div className="glass-panel rounded-2xl p-6 md:p-8 mb-6">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-5xl">{opportunity.logo}</span>
                  <div className="flex-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-2">
                      {opportunity.type}
                    </span>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground leading-tight mb-1">
                      {opportunity.title}
                    </h1>
                    <div className="flex items-center gap-2 text-base text-muted-foreground">
                      <Building className="w-4 h-4" />
                      <span className="font-medium text-foreground">{opportunity.company}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { icon: <MapPin className="w-4 h-4" />, label: "Location", value: opportunity.location },
                    { icon: <DollarSign className="w-4 h-4" />, label: "Compensation", value: opportunity.salary },
                    { icon: <Clock className="w-4 h-4" />, label: "Duration", value: opportunity.duration },
                    { icon: <Briefcase className="w-4 h-4" />, label: "Experience", value: opportunity.experience },
                  ].map((item, i) => (
                    <div key={i} className="bg-muted/40 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
                        {item.icon}
                        <span className="text-xs">{item.label}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Posted {opportunity.posted}</span>
                    <span className={`flex items-center gap-1 font-medium ${opportunity.daysLeft <= 14 ? "text-destructive" : ""}`}>
                      <Clock className="w-3.5 h-3.5" /> {opportunity.daysLeft} days left
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-muted/60 text-muted-foreground transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <a href={opportunity.applyUrl} target="_blank" rel="noopener noreferrer" className="lux-button flex items-center gap-2 bg-foreground text-background px-6 py-2.5 rounded-xl text-sm font-semibold">
                      Apply Now <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Description */}
            <ScrollReveal direction="up" delay={0.1}>
              <div className="glass-panel rounded-2xl p-6 md:p-8 mb-6">
                <h2 className="font-display text-lg font-semibold text-foreground mb-4">About This Role</h2>
                <article
                  className="prose-article space-y-4 text-foreground/85 leading-relaxed [&_h3]:font-display [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_ul]:space-y-1.5 [&_li]:text-sm [&_li]:flex [&_li]:items-start [&_li]:gap-2 [&_p]:text-sm"
                  dangerouslySetInnerHTML={{ __html: opportunity.description }}
                />
              </div>
            </ScrollReveal>

            {/* Tags */}
            <ScrollReveal direction="up" delay={0.15}>
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">Skills & Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {opportunity.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-full bg-tag text-tag-foreground text-xs font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Apply CTA */}
            <ScrollReveal direction="right" delay={0.15}>
              <div className="glass-panel rounded-2xl p-5 sticky top-8">
                <h3 className="font-display font-semibold text-base text-foreground mb-2">Ready to apply?</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Deadline is <span className="font-medium text-foreground">{opportunity.deadline}</span>. Don&apos;t miss out!
                </p>
                <a href={opportunity.applyUrl} target="_blank" rel="noopener noreferrer" className="lux-button w-full flex items-center justify-center gap-2 bg-foreground text-background px-4 py-3 rounded-xl text-sm font-semibold mb-3">
                  Apply Now <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span>Free to apply · No account needed</span>
                </div>
              </div>
            </ScrollReveal>

            {/* Similar Opportunities */}
            <ScrollReveal direction="right" delay={0.25}>
              <div className="glass-panel rounded-2xl p-5">
                <h3 className="font-display font-semibold text-base text-foreground mb-4">Similar Opportunities</h3>
                <div className="space-y-3">
                  {similarOpps.map((opp, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer group">
                      <span className="text-xl">{opp.logo}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">{opp.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{opp.company}</span>
                          <span>·</span>
                          <span>{opp.salary}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-medium ${opp.daysLeft <= 14 ? "text-destructive" : "text-muted-foreground"}`}>{opp.daysLeft}d</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OpportunityDetailPage;
