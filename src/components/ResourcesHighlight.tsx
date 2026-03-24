import ScrollReveal from "@/components/ScrollReveal";
import SectionHeader from "@/components/SectionHeader";
import ResourceCard from "@/components/ResourceCard";
import { useCms } from "@/contexts/CmsContext";

const ResourcesHighlight = () => {
  const { state } = useCms();

  const resources = [...state.resources]
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.rating - a.rating)
    .slice(0, 6);

  if (resources.length === 0) return null;

  return (
    <section className="mt-16">
      <ScrollReveal direction="up">
        <div className="lux-divider w-20 mb-8" />
      </ScrollReveal>
      <SectionHeader label="Resources & Tools" viewMoreLink="/category/resources" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.map((r, i) => (
          <ResourceCard
            key={r.id}
            name={r.name}
            description={r.description}
            category={r.category}
            rating={Math.round(r.rating)}
            icon={r.icon}
            url={r.url}
            delay={0.1 + i * 0.06}
          />
        ))}
      </div>
    </section>
  );
};

export default ResourcesHighlight;
