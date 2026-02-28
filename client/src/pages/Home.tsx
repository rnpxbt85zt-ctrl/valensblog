import { Link } from "wouter";
import { Instagram } from "lucide-react";
import { SiTiktok, SiLinkedin } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import profileImage from "@assets/valen-profile.jpg";
import heroBackground from "@assets/valen-hero-background.jpg";

export default function Home() {
  const { t } = useLanguage();

  const socialLinks = [
    {
      name: "Instagram",
      url: "https://www.instagram.com/valendefrutoss/",
      icon: Instagram,
    },
    {
      name: "TikTok",
      url: "https://www.tiktok.com/@valendefrutoss",
      icon: SiTiktok,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/valentin-de-frutos-b70a71255",
      icon: SiLinkedin,
    },
  ];

  return (
    <>
      <section 
        className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 pt-16 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight" data-testid="text-hero-title">
            {t("hero.title")}
          </h1>
          <p className="text-sm sm:text-base text-white/90 mb-8 leading-relaxed" data-testid="text-hero-subtitle">
            {t("hero.subtitle")}
          </p>
          <Button size="lg" variant="outline" data-testid="button-view-articles" className="text-base bg-white/10 backdrop-blur-sm border-white/30 text-white" asChild>
            <Link href="/articles">{t("hero.cta")}</Link>
          </Button>
        </div>
      </section>

      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-12" data-testid="text-about-title">
            {t("about.title")}
          </h2>
          
          <div className="text-base sm:text-lg text-foreground leading-relaxed flow-root">
            <img
              src={profileImage}
              alt="Valen - Student Athlete"
              className="w-48 h-48 mx-auto mb-6 md:float-left md:w-56 md:h-56 md:mr-6 md:mb-6 md:mx-0 object-cover rounded-lg shadow-lg"
              data-testid="img-profile"
            />
            
            <p className="mb-6" data-testid="text-about-intro">{t("about.intro")}</p>
            <p className="mb-6" data-testid="text-about-swimming">{t("about.swimming")}</p>
            <p className="mb-6" data-testid="text-about-hobbies">{t("about.hobbies")}</p>
            <p className="mb-6" data-testid="text-about-passion">{t("about.passion")}</p>
            <p className="mb-6" data-testid="text-about-experience">{t("about.experience")}</p>
            <p className="mb-6" data-testid="text-about-blog">{t("about.blog")}</p>
            <p className="italic" data-testid="text-about-goal">{t("about.goal")}</p>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-semibold text-foreground mb-6" data-testid="text-social-title">
              {t("about.social")}
            </h3>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-social-${social.name.toLowerCase()}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-card-border text-card-foreground hover-elevate active-elevate-2 transition-colors"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{social.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
