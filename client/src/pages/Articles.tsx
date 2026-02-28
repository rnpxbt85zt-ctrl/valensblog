import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Calendar, Clock, Eye, Filter } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Article } from "@shared/schema";
import { useState, useMemo } from "react";

export default function Articles() {
  const { t } = useLanguage();
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const categories = useMemo(() => {
    if (!articles) return [];
    const uniqueCategories = new Set(
      articles
        .map(a => a.category)
        .filter((cat): cat is string => Boolean(cat))
    );
    return Array.from(uniqueCategories);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    if (!articles) return [];
    if (selectedCategories.size === 0) return articles;
    return articles.filter(a => a.category && selectedCategories.has(a.category));
  }, [articles, selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 py-16 pt-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-8" data-testid="text-articles-title">
          {t("articles.title")}
        </h1>

        {categories.length > 0 && (
          <div className="mb-8 flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" data-testid="button-filter-dropdown">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter by Category
                  {selectedCategories.size > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {selectedCategories.size}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuCheckboxItem
                    key={category}
                    checked={selectedCategories.has(category)}
                    onCheckedChange={() => toggleCategory(category)}
                    data-testid={`filter-checkbox-${category?.toLowerCase() || 'unknown'}`}
                  >
                    {category || 'Uncategorized'}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {selectedCategories.size > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategories(new Set())}
                data-testid="button-clear-filters"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-muted animate-pulse" />
                <CardHeader>
                  <div className="h-6 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted animate-pulse rounded mb-2" />
                  <div className="h-4 bg-muted animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredArticles && filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                data-testid={`card-article-${article.slug}`}
                className="overflow-hidden hover-elevate transition-all duration-300 h-full flex flex-col"
              >
                {article.coverUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.coverUrl}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      data-testid={`img-cover-${article.slug}`}
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h2 className="text-xl font-semibold text-card-foreground line-clamp-2 flex-1" data-testid={`text-title-${article.slug}`}>
                      {article.title}
                    </h2>
                    {article.category && (
                      <Badge variant="secondary" data-testid={`badge-category-${article.slug}`}>
                        {article.category}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                    {article.publishedAt && (
                      <div className="flex items-center gap-1" data-testid={`text-date-${article.slug}`}>
                        <Calendar className="h-3.5 w-3.5" />
                        <time>{new Date(article.publishedAt).toLocaleDateString()}</time>
                      </div>
                    )}
                    {article.readingTime && (
                      <div className="flex items-center gap-1" data-testid={`text-reading-time-${article.slug}`}>
                        <Clock className="h-3.5 w-3.5" />
                        <span>{article.readingTime} min</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1" data-testid={`text-views-${article.slug}`}>
                      <Eye className="h-3.5 w-3.5" />
                      <span>{article.viewCount || 0} views</span>
                    </div>
                  </div>
                </CardHeader>
                {article.summary && (
                  <CardContent className="flex-1">
                    <p className="text-muted-foreground line-clamp-3" data-testid={`text-summary-${article.slug}`}>
                      {article.summary}
                    </p>
                  </CardContent>
                )}
                <CardFooter>
                  <Button variant="ghost" className="w-full" data-testid={`button-read-${article.slug}`} asChild>
                    <Link href={`/article/${article.slug}`}>
                      {t("articles.readmore")}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground" data-testid="text-articles-empty">
              {t("articles.empty")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
