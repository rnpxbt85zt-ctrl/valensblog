// Calculate reading time in minutes based on word count
// Average reading speed: 200 words per minute
export function calculateReadingTime(content: string | null): number {
  if (!content) return 1;
  
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  
  return Math.max(1, minutes); // Minimum 1 minute
}

// Format reading time for display
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}
