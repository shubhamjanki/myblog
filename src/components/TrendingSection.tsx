"use client";

import { ArrowRight, ArrowLeft } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import card1 from "@/assets/article-card-1.jpg";
import card2 from "@/assets/article-card-2.jpg";
import card3 from "@/assets/article-card-3.jpg";
import card4 from "@/assets/article-card-4.jpg";
import thumb1 from "@/assets/article-thumb-1.jpg";
import thumb4 from "@/assets/article-thumb-4.jpg";

const cardArticles = [
  { title: "Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were…", image: card1 },
  { title: "Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were…", image: thumb4 },
  { title: "Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were…", image: card3 },
  { title: "Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were…", image: card2 },
  { title: "Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were…", image: thumb1 },
  { title: "Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were…", image: card1 },
];

const TrendingSection = () => {
  const [page, setPage] = useState(0);

  return (
    <section className="mt-16 pb-8">
      <ScrollReveal direction="up">
        <div className="lux-divider w-20 mb-8" />
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8">
        {/* Left: Featured Article */}
        <ScrollReveal direction="up" delay={0.05} duration={0.9}>
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div className="inline-block bg-muted/60 backdrop-blur-sm px-3 py-1 rounded-md">
                <span className="text-xs font-semibold tracking-wider uppercase text-foreground border-l-2 border-primary pl-2">
                  Trending Now
                </span>
              </div>
              <Link href="/category" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300">
                View more <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div>
              <div className="flex items-center gap-2 text-sm mb-3">
                <span className="text-category font-medium">Blockchain News</span>
                <span className="text-muted-foreground">· 4 hours ago</span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold leading-tight text-foreground mb-4">
                Over 65% of Crypto-Related Tweets and 84% of Conversations on Reddit Were Positive in 2023
              </h2>
              <div className="flex gap-3 mb-6">
                <span className="text-sm text-muted-foreground">#Ethereum</span>
                <span className="text-sm text-muted-foreground">#Analytics</span>
              </div>
              <Link href="/category" className="lux-button flex items-center gap-2 border border-border/60 rounded-full px-5 py-2.5 text-sm font-medium text-foreground w-fit">
                Read article
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <ScrollReveal direction="scale" delay={0.2}>
              <div className="lux-image rounded-xl mt-2 group cursor-pointer card-hover-glass">
                <img src={card4} alt="Solana" className="w-full h-[200px] object-cover rounded-xl" />
              </div>
            </ScrollReveal>
          </div>
        </ScrollReveal>

        {/* Right: 3x2 Card Grid */}
        <div>
          <div className="grid grid-cols-3 gap-4">
            {cardArticles.map((article, i) => (
              <ScrollReveal key={i} delay={0.1 + i * 0.08} direction="up">
                <div className="cursor-pointer group card-hover-glass glass-panel rounded-xl p-2.5 pb-3">
                  <div className="lux-image h-[140px] mb-2">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className="text-category font-medium">Blockchain News</span>
                    <span className="text-muted-foreground">· 4 hours ago</span>
                  </div>
                  <p className="text-sm font-medium text-foreground leading-snug group-hover:text-primary transition-colors duration-300 line-clamp-3">
                    {article.title}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">#Ethereum</span>
                    <span className="text-xs text-muted-foreground">#Analytics</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal direction="up" delay={0.5}>
            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                className="lux-button w-11 h-11 rounded-full border border-border/60 flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 text-foreground" />
              </button>
              <button
                onClick={() => setPage(page + 1)}
                className="lux-button w-11 h-11 rounded-full bg-foreground flex items-center justify-center"
              >
                <ArrowRight className="w-4 h-4 text-background" />
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
