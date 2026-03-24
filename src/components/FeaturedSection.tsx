import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { useCms } from "@/contexts/CmsContext";
import featuredHero from "@/assets/featured-hero.jpg";

const FeaturedSection = () => {
  const { state } = useCms();
  const published = state.posts.filter(p => p.status === "published");

  const mainPost = published.find(p => p.featured) || published[0];
  const sidebarPosts = published.filter(p => p.id !== mainPost?.id).slice(0, 3);

  const timeAgo = (dateStr: string) => {
    if (!dateStr) return "Recently";
    const diff = Date.now() - new Date(dateStr).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (!mainPost) return null;

  return (
    <section className="mt-16 pb-8">
      <ScrollReveal direction="up">
        <div className="lux-divider w-20 mb-8" />
      </ScrollReveal>

      <ScrollReveal direction="scale" duration={1}>
        <div className="relative rounded-2xl overflow-hidden h-[520px] md:h-[580px]">
          <img
            src={mainPost.coverImage || featuredHero}
            alt={mainPost.title}
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-foreground/30 via-transparent to-accent/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

          <ScrollReveal direction="up" delay={0.3} className="absolute bottom-0 left-0 z-10">
            <Link to={`/article/${mainPost.slug}`} className="block glass-panel rounded-tr-2xl p-6 md:p-8 max-w-md">
              <div className="inline-block bg-muted/60 backdrop-blur-sm px-3 py-1 rounded-md mb-4">
                <span className="text-xs font-semibold tracking-wider uppercase text-foreground border-l-2 border-primary pl-2">
                  Featured
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm mb-3">
                <span className="text-category font-medium">{mainPost.category}</span>
                <span className="text-muted-foreground">· {timeAgo(mainPost.publishDate)}</span>
              </div>
              <h2 className="font-display text-xl md:text-2xl lg:text-3xl font-bold leading-tight text-foreground mb-3">
                {mainPost.title}
              </h2>
              <div className="flex gap-3 flex-wrap">
                {mainPost.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-sm text-muted-foreground">#{tag}</span>
                ))}
              </div>
            </Link>
          </ScrollReveal>

          {sidebarPosts.length > 0 && (
            <ScrollReveal direction="right" delay={0.4} className="absolute top-0 right-0 bottom-0 z-10 hidden md:block">
              <div className="h-full w-[280px] bg-foreground/70 backdrop-blur-xl p-5 flex flex-col justify-center gap-5">
                {sidebarPosts.map((article, i) => (
                  <Link key={article.id} to={`/article/${article.slug}`} className="cursor-pointer group">
                    {i > 0 && <div className="w-6 h-0.5 bg-primary-foreground/30 mb-4" />}
                    <div className="flex items-center gap-2 text-xs mb-1.5">
                      <span className="text-primary-foreground/70 font-medium">{article.category}</span>
                      <span className="text-primary-foreground/40">· {timeAgo(article.publishDate)}</span>
                    </div>
                    <p className="text-sm font-medium text-primary-foreground/90 leading-snug group-hover:text-primary-foreground transition-colors duration-300 line-clamp-3">
                      {article.title}
                    </p>
                  </Link>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
};

export default FeaturedSection;
