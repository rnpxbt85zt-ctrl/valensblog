import { Instagram } from "lucide-react";
import { SiTiktok, SiLinkedin } from "react-icons/si";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
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
    <footer className="border-t border-border bg-background mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Valen's Journey. {t("footer.rights")}
          </p>

          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid={`link-footer-${social.name.toLowerCase()}`}
                  className="text-muted-foreground hover:text-accent transition-colors hover-elevate active-elevate-2 p-2 rounded-md"
                  aria-label={social.name}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
