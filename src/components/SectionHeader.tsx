import { ArrowRight } from "lucide-react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

interface SectionHeaderProps {
  label: string;
  viewMoreLink?: string;
  delay?: number;
}

const SectionHeader = ({ label, viewMoreLink, delay = 0 }: SectionHeaderProps) => (
  <ScrollReveal direction="up" delay={delay}>
    <div className="flex items-center justify-between mb-6">
      <div className="inline-block bg-muted/60 backdrop-blur-sm px-3 py-1 rounded-md">
        <span className="text-xs font-semibold tracking-wider uppercase text-foreground border-l-2 border-primary pl-2">
          {label}
        </span>
      </div>
      {viewMoreLink && (
        <Link href={viewMoreLink}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
        >
          View more <ArrowRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  </ScrollReveal>
);

export default SectionHeader;
