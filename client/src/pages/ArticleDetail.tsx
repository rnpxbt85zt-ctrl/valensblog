import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Calendar, ArrowLeft, Clock, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Article } from "@shared/schema";
import { useEffect } from "react";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function ArticleDetail() {
  const [, params] = useRoute("/article/:slug");
  const { t } = useLanguage();

  const { data: article, isLoading } = useQuery<Article>({
    queryKey: ["/api/article", params?.slug],
    enabled: !!params?.slug,
  });

  useEffect(() => {
    if (article?.slug) {
      apiRequest("POST", `/api/article/${article.slug}/view`)
        .then(res => res.json())
        .then(data => {
          queryClient.setQueryData(["/api/article", article.slug], (oldData: Article | undefined) => {
            if (oldData) {
              return { ...oldData, viewCount: data.count };
            }
            return oldData;
          });
          queryClient.invalidateQueries({ queryKey: ["/api/articles"] });
        })
        .catch(err => console.error("Failed to track view:", err));
    }
  }, [article?.slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen px-4 sm:px-6 py-16 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-muted animate-pulse rounded w-32 mb-8" />
          <div className="h-12 bg-muted animate-pulse rounded mb-4" />
          <div className="h-6 bg-muted animate-pulse rounded w-48 mb-8" />
          <div className="h-96 bg-muted animate-pulse rounded mb-8" />
          <div className="space-y-4">
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded" />
            <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen px-4 sm:px-6 py-16 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Article not found</h1>
          <Button data-testid="button-back-to-articles" asChild>
            <Link href="/articles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("articles.back")}
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-16 pt-24">
      <article className="max-w-4xl mx-auto">
        <Button variant="ghost" className="mb-8" data-testid="button-back" asChild>
          <Link href="/articles">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("articles.back")}
          </Link>
        </Button>

        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight flex-1" data-testid="text-article-title">
            {article.title}
          </h1>
          {article.category && (
            <Badge variant="secondary" className="text-base px-4 py-1" data-testid="badge-article-category">
              {article.category}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-6 text-muted-foreground mb-8 flex-wrap">
          {article.publishedAt && (
            <div className="flex items-center gap-2" data-testid="text-article-date">
              <Calendar className="h-5 w-5" />
              <time className="text-lg">
                {new Date(article.publishedAt).toLocaleDateString()}
              </time>
            </div>
          )}
          {article.readingTime && (
            <div className="flex items-center gap-2" data-testid="text-article-reading-time">
              <Clock className="h-5 w-5" />
              <span className="text-lg">{article.readingTime} min read</span>
            </div>
          )}
          <div className="flex items-center gap-2" data-testid="text-article-views">
            <Eye className="h-5 w-5" />
            <span className="text-lg">{article.viewCount || 0} views</span>
          </div>
        </div>

        {article.coverUrl && (
          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src={article.coverUrl}
              alt={article.title}
              className="w-full h-auto"
              data-testid="img-article-cover"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none text-foreground" data-testid="text-article-content">
          {article.content ? (
            <div 
              className="leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          ) : (
            <p className="text-muted-foreground italic">No content available</p>
          )}
        </div>
      </article>
    </div>
  );
}
