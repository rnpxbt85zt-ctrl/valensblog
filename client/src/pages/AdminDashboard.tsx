import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Eye, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { data: articles } = useQuery({
    queryKey: ["/api/admin/articles"],
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/admin/analytics"],
  });

  const draftCount = articles?.filter((a: any) => a.status === 'draft').length || 0;
  const publishedCount = articles?.filter((a: any) => a.status === 'published').length || 0;
  const totalViews = articles?.reduce((sum: number, a: any) => sum + (a.viewCount || 0), 0) || 0;

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold" data-testid="text-dashboard-title">Admin Dashboard</h1>
          <Link href="/admin/posts/new">
            <Button data-testid="button-new-post">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Published Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-published-count">{publishedCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-draft-count">{draftCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" data-testid="stat-total-views">{totalViews.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Popular Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.popularArticles && analytics.popularArticles.length > 0 ? (
                <div className="space-y-3">
                  {analytics.popularArticles.map((article: any) => (
                    <div key={article.id} className="flex justify-between items-start p-3 rounded-lg hover-elevate border" data-testid={`popular-article-${article.id}`}>
                      <div className="flex-1">
                        <Link href={`/admin/posts/${article.id}`}>
                          <h3 className="font-medium hover:text-primary">{article.title}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">{article.category || 'Uncategorized'}</p>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Eye className="h-4 w-4" />
                        <span>{article.viewCount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No published posts yet</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Posts</CardTitle>
            </CardHeader>
            <CardContent>
              {articles && articles.length > 0 ? (
                <div className="space-y-3">
                  {articles.slice(0, 5).map((article: any) => (
                    <div key={article.id} className="flex justify-between items-start p-3 rounded-lg hover-elevate border" data-testid={`recent-article-${article.id}`}>
                      <div className="flex-1">
                        <Link href={`/admin/posts/${article.id}`}>
                          <h3 className="font-medium hover:text-primary">{article.title}</h3>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          {article.status === 'draft' ? 'Draft' : 'Published'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No posts yet</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
