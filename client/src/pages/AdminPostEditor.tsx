import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/RichTextEditor";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Upload, X, Image, FileText, Link as LinkIcon, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  summary: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  category: z.string().optional(),
  status: z.enum(['draft', 'published']),
  coverImageUrl: z.string().optional(),
});

type PostForm = z.infer<typeof postSchema>;

// ── Cover Image Uploader ──────────────────────────────────────────────────────
function CoverImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || "");

  useEffect(() => {
    setPreview(value || "");
  }, [value]);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please select an image file", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      // 1. Get presigned upload URL
      const res = await apiRequest("POST", "/api/upload/image", {});
      const { uploadURL } = await res.json();

      // 2. Upload to object storage
      await fetch(uploadURL, { method: "PUT", body: file, headers: { "Content-Type": file.type } });

      // 3. Confirm and get public path
      const confirmRes = await apiRequest("PUT", "/api/upload/image/confirm", { imageURL: uploadURL });
      const { objectPath } = await confirmRes.json();

      onChange(objectPath);
      setPreview(objectPath);
      toast({ title: "Image uploaded!" });
    } catch {
      toast({ title: "Upload failed", description: "Could not upload image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div
        className="relative border-2 border-dashed rounded-lg overflow-hidden cursor-pointer hover:border-primary transition-colors"
        style={{ minHeight: 180 }}
        onClick={() => fileRef.current?.click()}
      >
        {preview ? (
          <div className="relative group">
            <img src={preview} alt="Cover" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="text-white text-sm font-medium">Click to change</span>
            </div>
            <button
              type="button"
              className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => { e.stopPropagation(); onChange(""); setPreview(""); }}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 gap-2 text-muted-foreground">
            {uploading ? (
              <><Loader2 className="h-8 w-8 animate-spin" /><span className="text-sm">Uploading...</span></>
            ) : (
              <><Image className="h-8 w-8" /><span className="text-sm font-medium">Click to upload cover image</span><span className="text-xs">PNG, JPG, WebP up to 10MB</span></>
            )}
          </div>
        )}
      </div>

      {/* OR paste URL */}
      <div className="flex gap-2 items-center">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-muted-foreground">or paste URL</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <Input
        placeholder="https://example.com/image.jpg"
        value={preview.startsWith("http") ? preview : ""}
        onChange={(e) => { onChange(e.target.value); setPreview(e.target.value); }}
      />

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}

// ── Attachment Uploader (PDFs, docs, links) ───────────────────────────────────
type Attachment = { type: "file" | "link"; name: string; url: string };

function AttachmentsSection({
  attachments,
  onChange,
}: {
  attachments: Attachment[];
  onChange: (list: Attachment[]) => void;
}) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [linkInput, setLinkInput] = useState("");
  const [linkName, setLinkName] = useState("");

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const res = await apiRequest("POST", "/api/upload/image", {});
      const { uploadURL } = await res.json();
      await fetch(uploadURL, { method: "PUT", body: file, headers: { "Content-Type": file.type } });
      const confirmRes = await apiRequest("PUT", "/api/upload/image/confirm", { imageURL: uploadURL });
      const { objectPath } = await confirmRes.json();
      onChange([...attachments, { type: "file", name: file.name, url: objectPath }]);
      toast({ title: "File attached!" });
    } catch {
      toast({ title: "Upload failed", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const addLink = () => {
    if (!linkInput) return;
    const name = linkName || linkInput;
    onChange([...attachments, { type: "link", name, url: linkInput }]);
    setLinkInput("");
    setLinkName("");
  };

  const remove = (i: number) => onChange(attachments.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-4">
      {/* Existing attachments */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          {attachments.map((a, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-md border bg-muted/40">
              {a.type === "file" ? <FileText className="h-4 w-4 text-primary shrink-0" /> : <LinkIcon className="h-4 w-4 text-primary shrink-0" />}
              <a href={a.url} target="_blank" rel="noopener noreferrer" className="flex-1 text-sm truncate hover:underline">{a.name}</a>
              <button type="button" onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload file */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
          {uploading ? "Uploading..." : "Upload file / PDF"}
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp,.gif,.mp4,.mov"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
      </div>

      {/* Add link */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Add a link</p>
        <div className="flex gap-2">
          <Input
            placeholder="Display name (optional)"
            value={linkName}
            onChange={(e) => setLinkName(e.target.value)}
            className="w-40"
          />
          <Input
            placeholder="https://..."
            value={linkInput}
            onChange={(e) => setLinkInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLink())}
            className="flex-1"
          />
          <Button type="button" variant="outline" size="sm" onClick={addLink}>
            <LinkIcon className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Main Editor ───────────────────────────────────────────────────────────────
export default function AdminPostEditor() {
  const [, params] = useRoute("/admin/posts/:id");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const isNew = params?.id === "new";
  const postId = isNew ? null : parseInt(params?.id || "0");

  // Attachments state (stored as JSON string appended to content or separate field)
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  // ── FIX: correct queryFn to hit the right URL ──
  const { data: post, isLoading } = useQuery({
    queryKey: ["/api/admin/article", postId],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/admin/article/${postId}`);
      return res.json();
    },
    enabled: !isNew && !!postId,
  });

  const form = useForm<PostForm>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      content: "",
      category: "",
      status: "draft",
      coverImageUrl: "",
    },
  });

  useEffect(() => {
    if (post && !isNew) {
      form.reset({
        title: post.title,
        slug: post.slug,
        summary: post.summary || "",
        content: post.content,
        category: post.category || "",
        status: post.status as "draft" | "published",
        coverImageUrl: post.coverImageUrl || "",
      });
      // Load attachments from post if stored in a JSON comment at the end of content
      try {
        const match = post.content?.match(/<!--ATTACHMENTS:(.*?)-->/s);
        if (match) setAttachments(JSON.parse(match[1]));
      } catch {}
    }
  }, [post, isNew, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: PostForm) => {
      // Embed attachments as HTML comment in content
      let content = data.content.replace(/<!--ATTACHMENTS:.*?-->/s, "");
      if (attachments.length > 0) {
        content += `<!--ATTACHMENTS:${JSON.stringify(attachments)}-->`;
      }
      const payload = { ...data, content };

      if (isNew) {
        const response = await apiRequest("POST", "/api/admin/articles", payload);
        return await response.json();
      } else {
        const response = await apiRequest("PUT", `/api/admin/article/${postId}`, payload);
        return await response.json();
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/articles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/article", postId] });
      toast({
        title: "Saved!",
        description: isNew ? "Post created successfully" : "Post updated successfully",
      });
      if (isNew && data.id) {
        setLocation(`/admin/posts/${data.id}`);
      }
    },
    onError: (err: any) => {
      toast({
        title: "Error saving post",
        description: err?.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const generateSlug = () => {
    const title = form.getValues("title");
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    form.setValue("slug", slug);
  };

  if (isLoading && !isNew) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setLocation("/admin/posts")}
          className="mb-4"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Posts
        </Button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold" data-testid="text-editor-title">
            {isNew ? "New Post" : "Edit Post"}
          </h1>
          {/* Quick save button at top */}
          <Button
            onClick={form.handleSubmit((d) => saveMutation.mutate(d))}
            disabled={saveMutation.isPending}
            data-testid="button-save-top"
          >
            {saveMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {saveMutation.isPending ? "Saving..." : "Save Post"}
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((d) => saveMutation.mutate(d))} className="space-y-6">

            {/* ── Metadata ── */}
            <Card className="p-6 space-y-6">
              <h2 className="text-lg font-semibold">Post Details</h2>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter post title" data-testid="input-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug *</FormLabel>
                    <div className="flex gap-2">
                      <FormControl>
                        <Input {...field} placeholder="post-url-slug" data-testid="input-slug" />
                      </FormControl>
                      <Button type="button" variant="outline" onClick={generateSlug} data-testid="button-generate-slug">
                        Generate
                      </Button>
                    </div>
                    <FormDescription>URL: /article/{form.watch("slug") || "your-slug"}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="summary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Summary</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Brief description shown on article cards" data-testid="input-summary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Swimming">Swimming</SelectItem>
                          <SelectItem value="Travel">Travel</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                          <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Personal Growth">Personal Growth</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            {/* ── Cover Image ── */}
            <Card className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Cover Image</h2>
              <FormField
                control={form.control}
                name="coverImageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <CoverImageUploader value={field.value || ""} onChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>

            {/* ── Content ── */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Content</h2>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichTextEditor
                        content={field.value}
                        onChange={field.onChange}
                        placeholder="Start writing your post..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>

            {/* ── Attachments ── */}
            <Card className="p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Attachments & Links</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Attach PDFs, documents, photos, or external links to this post.
                </p>
              </div>
              <AttachmentsSection attachments={attachments} onChange={setAttachments} />
            </Card>

            {/* ── Actions ── */}
            <div className="flex justify-end gap-3 pb-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/admin/posts")}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saveMutation.isPending} data-testid="button-save">
                {saveMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {saveMutation.isPending ? "Saving..." : "Save Post"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
