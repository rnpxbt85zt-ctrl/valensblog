import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Eye, TrendingUp, Clock, Edit, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  const { data: articles, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/articles"],
  });

  const { data: analytics } = useQuery<any>({
    queryKey: ["/api/admin/analytics"],
  });

  const draftCount = articles?.filter((a) => a.status === "draft").length ?? 0;
  const publishedCount = articles?.filter((a) => a.status === "published").length ?? 0;
  const totalViews = articles?.reduce((sum, a) => sum + (a.viewCount || 0), 0) ?? 0;
  const totalArticles = articles?.length ?? 0;

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold" data-testid="text-dashboard-title">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Welcome back, Valen!</p>
          </div>
          <Link href="/admin/posts/new">
            <Button data-testid="button-new-post">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{isLoading ? "—" : totalArticles}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Published</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-500" data-testid="stat-published-count">
                {isLoading ? "—" : publishedCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Drafts</CardTitle>
              <FileText className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-500" data-testid="stat-draft-count">
                {isLoading ? "—" : draftCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="stat-total-views">
                {isLoading ? "—" : totalViews.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Popular Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Popular Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.popularArticles?.length > 0 ? (
                <div className="space-y-2">
                  {analytics.popularArticles.map((article: any, i: number) => (
                    <div
                      key={article.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/40 transition-colors"
                      data-testid={`popular-article-${article.id}`}
                    >
                      <span className="text-2xl font-bold text-muted-foreground/40 w-6 shrink-0">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <Link href={`/admin/posts/${article.id}`}>
                          <h3 className="font-medium truncate hover:text-primary">{article.title}</h3>
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">{article.category || "Uncategorized"}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground shrink-0">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{article.viewCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No published posts yet</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Posts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Posts</CardTitle>
                <Link href="/admin/posts">
                  <Button variant="ghost" size="sm">View all</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
                  ))}
                </div>
              ) : articles && articles.length > 0 ? (
                <div className="space-y-2">
                  {articles.slice(0, 5).map((article: any) => (
                    <div
                      key={article.id}
                      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/40 transition-colors"
                      data-testid={`recent-article-${article.id}`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <Link href={`/admin/posts/${article.id}`}>
                            <h3 className="font-medium truncate hover:text-primary">{article.title}</h3>
                          </Link>
                          <Badge
                            variant={article.status === "published" ? "default" : "secondary"}
                            className="shrink-0 text-xs"
                          >
                            {article.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {article.category && <span>{article.category}</span>}
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readingTime} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.viewCount}
                          </span>
                        </div>
                      </div>
                      <Link href={`/admin/posts/${article.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground text-sm mb-4">No posts yet</p>
                  <Link href="/admin/posts/new">
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Create your first post
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
