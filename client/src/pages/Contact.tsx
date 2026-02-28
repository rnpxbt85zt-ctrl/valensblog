import { useState } from "react";
import { Instagram, Mail } from "lucide-react";
import { SiTiktok, SiLinkedin } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const mailtoLink = `mailto:valentin.defrutos@example.com?subject=Message from ${formData.name}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    
    window.location.href = mailtoLink;
    
    toast({
      title: "Opening email client...",
      description: "Your default email client will open with the message.",
    });

    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-16 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4" data-testid="text-contact-title">
            {t("contact.title")}
          </h1>
          <p className="text-lg text-muted-foreground" data-testid="text-contact-subtitle">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  {t("contact.name")}
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  data-testid="input-name"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  {t("contact.email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  data-testid="input-email"
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  {t("contact.message")}
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  data-testid="input-message"
                  className="w-full resize-none"
                />
              </div>

              <Button type="submit" className="w-full" data-testid="button-send">
                <Mail className="h-4 w-4 mr-2" />
                {t("contact.send")}
              </Button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-6" data-testid="text-follow-title">
              {t("contact.social")}
            </h2>
            <div className="space-y-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid={`link-contact-${social.name.toLowerCase()}`}
                    className="flex items-center gap-4 p-4 rounded-md bg-card border border-card-border text-card-foreground hover-elevate active-elevate-2 transition-colors"
                  >
                    <Icon className="h-6 w-6 text-accent" />
                    <div>
                      <p className="font-semibold">{social.name}</p>
                      <p className="text-sm text-muted-foreground">@valendefrutoss</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
