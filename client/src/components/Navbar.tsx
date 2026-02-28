import { Moon, Sun, Globe } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { t, toggleLanguage } = useLanguage();

  const navItems = [
    { path: "/", label: t("nav.about") },
    { path: "/articles", label: t("nav.articles") },
    { path: "/contact", label: t("nav.contact") },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" data-testid="link-logo" className="text-xl font-bold text-foreground hover-elevate active-elevate-2 px-3 py-2 rounded-md transition-colors">
            Valen's Journey
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                data-testid={`link-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                  location === item.path
                    ? "bg-accent text-accent-foreground"
                    : "text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleLanguage}
              data-testid="button-language-toggle"
              aria-label="Toggle language"
            >
              <Globe className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        <div className="md:hidden pb-4 flex gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              data-testid={`link-mobile-nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors hover-elevate active-elevate-2 ${
                location === item.path
                  ? "bg-accent text-accent-foreground"
                  : "text-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
