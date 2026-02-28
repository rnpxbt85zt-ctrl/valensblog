import { createContext, useContext, useState, type ReactNode } from "react";
import type { Language } from "@shared/schema";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation
    "nav.about": "About Me",
    "nav.articles": "Articles",
    "nav.contact": "Contact",
    
    // Hero
    "hero.title": "Valen's Journey",
    "hero.subtitle": "Student-athlete journey: Swimming, Travel, Study, Book Reveiws and Personal Growth",
    "hero.cta": "View Articles",
    
    // About
    "about.title": "About Me",
    "about.intro": "Hey! I'm Valen, an international student-athlete from Argentina living in the US. I am Double-majoring in Business Administration and Marketing.",
    "about.swimming": "I'm a swimmer competing in the NCAA DII, as well as for my home club Unión de Santa Fe.",
    "about.hobbies": "Some of my hobbies are reading, learning new languages, swimming, traveling, journaling and waking up 5:00 am everyday. 😅",
    "about.passion": "I am very passionate about the world of Businesses, and how ideas with hard work and consistency can change the world. 🌎",
    "about.experience": "Studying abroad opened my eyes to new cultures and ways of living, meeting people from all over the world.",
    "about.blog": "In this blog I will share a little bit about myself: from hard workouts, my daily routine, what it's like to study in a different language, distance swimming, personal development, lifting, race strategy, book reviews, business, entrepreneurship, journaling, my experience as an international student in the U.S., travel reviews/blogs, etc!",
    "about.goal": "PD: my goal with this blog is to share my experiences to help other people who may be going through similar things, to motivate them, and to show a different perspective. This blog is a way to express myself while helping others.",
    "about.social": "Connect with me",
    
    // Articles
    "articles.title": "Articles",
    "articles.loading": "Loading articles...",
    "articles.empty": "No articles published yet. Check back soon!",
    "articles.readmore": "Read More",
    "articles.back": "Back to Articles",
    
    // Contact
    "contact.title": "Get in Touch",
    "contact.subtitle": "Have questions or want to connect? Reach out to me!",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.message": "Message",
    "contact.send": "Send Message",
    "contact.social": "Follow Me",
    
    // Footer
    "footer.rights": "All rights reserved.",
  },
  es: {
    // Navigation
    "nav.about": "Sobre Mí",
    "nav.articles": "Artículos",
    "nav.contact": "Contacto",
    
    // Hero
    "hero.title": "Valen's Journey",
    "hero.subtitle": "Student-athlete journey: Natación, Viajes, Estudio, Reseñas de Libros y Crecimiento Personal",
    "hero.cta": "Ver Artículos",
    
    // About
    "about.title": "Sobre Mí",
    "about.intro": "¡Hola! Soy Valen, un estudiante-atleta internacional de Argentina viviendo en EE.UU. Estoy haciendo doble especialización en Administración de Empresas y Marketing.",
    "about.swimming": "Soy nadador compitiendo en la NCAA DII, así como para mi club de origen Unión de Santa Fe.",
    "about.hobbies": "Algunos de mis pasatiempos son leer, aprender nuevos idiomas, nadar, viajar, escribir en mi diario y despertarme a las 5:00 am todos los días. 😅",
    "about.passion": "Soy muy apasionado por el mundo de los Negocios, y cómo las ideas con trabajo duro y consistencia pueden cambiar el mundo. 🌎",
    "about.experience": "Estudiar en el extranjero me abrió los ojos a nuevas culturas y formas de vivir, conociendo gente de todo el mundo.",
    "about.blog": "¡En este blog compartiré un poco sobre mí mismo: desde entrenamientos duros, mi rutina diaria, cómo es estudiar en un idioma diferente, natación de distancia, desarrollo personal, levantamiento de pesas, estrategia de carrera, reseñas de libros, negocios, emprendimiento, escritura de diario, mi experiencia como estudiante internacional en EE.UU., reseñas/blogs de viajes, etc!",
    "about.goal": "PD: mi objetivo con este blog es compartir mis experiencias para ayudar a otras personas que puedan estar pasando por cosas similares, motivarlas y mostrar una perspectiva diferente. Este blog es una forma de expresarme mientras ayudo a otros.",
    "about.social": "Conéctate conmigo",
    
    // Articles
    "articles.title": "Artículos",
    "articles.loading": "Cargando artículos...",
    "articles.empty": "No hay artículos publicados aún. ¡Vuelve pronto!",
    "articles.readmore": "Leer Más",
    "articles.back": "Volver a Artículos",
    
    // Contact
    "contact.title": "Ponte en Contacto",
    "contact.subtitle": "¿Tienes preguntas o quieres conectar? ¡Contáctame!",
    "contact.name": "Nombre",
    "contact.email": "Correo Electrónico",
    "contact.message": "Mensaje",
    "contact.send": "Enviar Mensaje",
    "contact.social": "Sígueme",
    
    // Footer
    "footer.rights": "Todos los derechos reservados.",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("language");
    return (stored as Language) || "en";
  });

  const toggleLanguage = () => {
    const newLang = language === "en" ? "es" : "en";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
