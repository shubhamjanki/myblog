import { Briefcase, GraduationCap, Trophy, Award } from "lucide-react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import SectionHeader from "@/components/SectionHeader";
import { useCms } from "@/contexts/CmsContext";

const typeIcons: Record<string, React.ReactNode> = {
  Internship: <Briefcase className="w-5 h-5" />,
  Job: <Briefcase className="w-5 h-5" />,
  Scholarship: <GraduationCap className="w-5 h-5" />,
  Competition: <Trophy className="w-5 h-5" />,
};

const typeColors: Record<string, string> = {
  Internship: "text-blue-500",
  Job: "text-emerald-500",
  Scholarship: "text-amber-500",
  Competition: "text-purple-500",
};

const typeToSlug: Record<string, string> = {
  Internship: "/category/internships",
  Job: "/category/jobs",
  Scholarship: "/category/scholarships",
  Competition: "/category/competitions",
};

const OpportunitiesSection = () => {
  const { state } = useCms();

  const opportunities = [...state.opportunities]
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.daysLeft - b.daysLeft)
    .slice(0, 4);

  if (opportunities.length === 0) return null;

  return (
    <section className="mt-16">
      <ScrollReveal direction="up">
        <div className="lux-divider w-20 mb-8" />
      </ScrollReveal>
      <SectionHeader label="Latest Opportunities" viewMoreLink="/category/opportunities" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {opportunities.map((opp, i) => (
          <ScrollReveal key={opp.id} direction="up" delay={0.1 + i * 0.08}>
            <Link
              to={opp.applyUrl && opp.applyUrl !== "#" ? opp.applyUrl : (typeToSlug[opp.type] || "/category/opportunities")}
              className="glass-panel rounded-xl p-4 card-hover-glass block group"
              target={opp.applyUrl && opp.applyUrl !== "#" ? "_blank" : undefined}
              rel={opp.applyUrl && opp.applyUrl !== "#" ? "noopener noreferrer" : undefined}
            >
              <div className={`${typeColors[opp.type] || "text-foreground"} mb-3`}>
                {typeIcons[opp.type] || <Briefcase className="w-5 h-5" />}
              </div>
              <span className="text-xs font-medium text-category">{opp.type}</span>
              <h4 className="font-display font-semibold text-sm text-foreground mt-1 mb-1 group-hover:text-primary transition-colors line-clamp-2">
                {opp.title}
              </h4>
              <p className="text-xs text-muted-foreground">{opp.company}</p>
              <div className="flex items-center gap-1 mt-3">
                <Award className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Deadline: {opp.deadline}</span>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
};

export default OpportunitiesSection;
