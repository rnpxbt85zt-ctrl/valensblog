# Valen's Journey Blog

A bilingual (EN/ES) personal blog for Valen, an international student-athlete from Argentina living in the U.S., studying Business Administration and Marketing and competing in NCAA DII swimming.

## Overview

This is a modern, full-stack blog application with:
- **Bilingual Support**: English and Spanish language toggle with localStorage persistence
- **Dark/Light Mode**: Beautiful theme switching with smooth transitions
- **Database CMS**: PostgreSQL database with custom admin panel for content management
- **Rich Text Editor**: TipTap editor with image upload support
- **Authentication**: Replit Auth with Google, GitHub, and email/password login
- **Object Storage**: Secure image uploads with Replit Object Storage
- **Modern Design**: Dark blue theme (#0b132b base) with clean, minimal aesthetic
- **Responsive**: Mobile-first design that works beautifully on all devices

## Project Structure

### Frontend (React + TypeScript + Tailwind)
- **Public Pages**:
  - `/` - Home page with hero section and about content
  - `/articles` - Articles listing page with category filtering
  - `/article/:slug` - Individual article detail page with view tracking
  - `/contact` - Contact form with social media links

- **Admin Pages** (Protected):
  - `/admin` - Dashboard with analytics and engagement metrics
  - `/admin/posts` - Posts management with draft/published status
  - `/admin/posts/:id` - Rich text post editor with image uploads

- **Key Components**:
  - `Navbar` - Navigation with language/theme toggles
  - `Footer` - Footer with social links
  - `RichTextEditor` - TipTap editor with formatting and image support
  - `ObjectUploader` - Drag-and-drop image uploader for Object Storage
  - Theme and Language context providers for global state

### Backend (Express + PostgreSQL + Drizzle ORM)
- **Public API Endpoints**:
  - `GET /api/articles` - Fetches all published articles
  - `GET /api/article/:slug` - Fetches single article by slug
  - `POST /api/article/:slug/view` - Tracks article views

- **Protected Admin API Endpoints**:
  - `GET /api/admin/articles` - Fetches all articles for authenticated user
  - `GET /api/admin/article/:id` - Fetches single article for editing
  - `POST /api/admin/articles` - Creates new article
  - `PUT /api/admin/article/:id` - Updates article
  - `DELETE /api/admin/article/:id` - Deletes article
  - `GET /api/admin/stats` - Fetches dashboard statistics

- **Authentication**:
  - Replit Auth integration with Google, GitHub, email/password
  - Session-based authentication with PostgreSQL session storage
  - Protected routes with authentication middleware

- **Object Storage**:
  - Presigned URL generation for secure uploads
  - ACL-based access control for images
  - Integration with TipTap editor for inline images

## Database Schema

### Users Table
- `id` (varchar, primary key, UUID) - User ID from Replit Auth
- `email` (varchar, unique) - User email
- `firstName` (varchar) - First name
- `lastName` (varchar) - Last name
- `profileImageUrl` (varchar) - Profile picture URL
- `createdAt` (timestamp) - Account creation date
- `updatedAt` (timestamp) - Last update date

### Articles Table
- `id` (serial, primary key) - Article ID
- `title` (varchar, required) - Article title
- `slug` (varchar, required, unique) - URL-friendly slug
- `content` (text, required) - Rich text HTML content
- `summary` (text) - Short description for cards
- `coverImageUrl` (varchar) - Cover image URL
- `category` (varchar) - Article category (Swimming, Travel, Business, etc.)
- `status` (varchar, default: 'draft') - 'draft' or 'published'
- `viewCount` (integer, default: 0) - Number of views
- `authorId` (varchar, foreign key) - Author user ID
- `publishedAt` (timestamp) - Publication date (set automatically on publish)
- `createdAt` (timestamp) - Creation date
- `updatedAt` (timestamp) - Last update date

### Sessions Table
- `sid` (varchar, primary key) - Session ID
- `sess` (jsonb) - Session data
- `expire` (timestamp) - Expiration time

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (Replit managed) ✓
- `SESSION_SECRET` - Session encryption key ✓
- `PUBLIC_OBJECT_SEARCH_PATHS` - Object storage public paths ✓
- `PRIVATE_OBJECT_DIR` - Object storage private directory ✓
- Replit Auth handles authentication automatically ✓

## Admin Panel Features

### Dashboard
- Total articles count (draft + published)
- Published articles count
- Total views across all articles
- Popular posts list (top 5 by views)

### Post Management
- List all posts with status badges
- Filter by draft/published status
- Create new posts
- Edit existing posts
- Delete posts
- Draft/publish workflow

### Rich Text Editor
- Bold, italic, underline, strikethrough
- Headings (H1-H6)
- Bullet and numbered lists
- Blockquotes
- Code blocks
- Links with custom URLs
- Image uploads via Object Storage
- Drag-and-drop image support

## Design System

- **Primary Colors**: 
  - Dark mode: Deep navy background (220 60% 8%)
  - Light mode: Off-white background (0 0% 98%)
  - Accent: Bright blue (210 80% 60%)

- **Typography**: Poppins and Inter fonts
- **Spacing**: Consistent padding and margins
- **Interactions**: Smooth hover and active states using elevation utilities

## Recent Changes

### October 15, 2025 - Personal Image Integration
- **Custom Hero Background**: Replaced stock image with Valen's scenic coastal photo
  - Personal landscape photo from user's collection
  - Dark gradient overlay maintains text readability
  - Creates authentic personal brand connection
  
- **Profile Picture Update**: Added Valen's swimming action photo to About Me section
  - Replaced stock athlete image with personal competition photo
  - Sized as smaller square (192×192px mobile, 224×224px desktop)
  - Floats left on desktop with text wrapping naturally
  - Rounded corners and shadow for polished appearance
  
- **Vite Asset Handling**: Resolved uppercase extension compatibility
  - Converted .JPG files to lowercase .jpg for Vite processing
  - All images now properly imported via @assets alias

### October 15, 2025 - Complete CMS Migration
- **Database Migration**: Replaced Notion with PostgreSQL + Drizzle ORM
  - Custom articles schema with full control
  - User management with Replit Auth integration
  - Session storage in database
  
- **Admin Panel**: Built complete content management system
  - Dashboard with analytics and engagement metrics
  - Posts list with draft/published filtering
  - Rich text editor with TipTap
  - Image upload via Replit Object Storage
  - Draft/publish workflow with automatic publishedAt tracking
  
- **Authentication**: Integrated Replit Auth
  - Google, GitHub, email/password login support
  - Protected admin routes with middleware
  - Session-based authentication
  
- **Reading Time & View Counters**: Added article engagement metrics
  - Automatic reading time calculation based on word count (200 words/min)
  - View counter tracking stored in database
  - Displays on both article cards and detail pages
  
- **Category Filtering**: Implemented article organization
  - Category field in database schema
  - Filter UI with dropdown on Articles page
  - Dynamic category badges on article cards and detail pages

### October 14, 2025
- **Hero Section Background**: Added swimming pool background image with dark gradient overlay
  - Background image creates visual impact and athletic theme
  - Dark gradient overlay (black/60-70%) ensures text readability
  - Glass-morphism button styling with backdrop blur effect
  - White text optimized for contrast against dark overlay
  
- **Magazine-Style About Me Layout**: Implemented responsive newspaper column layout
  - Desktop: Profile photo floats left with text wrapping around it naturally
  - Mobile: Image centered and stacked vertically above text
  - Uses CSS float with `flow-root` containment for proper layout

### Initial Release
- Complete bilingual blog functionality (EN/ES)
- Responsive design with dark/light mode
- Contact form with social media integration

## User Preferences

- Default theme: Dark mode
- Default language: English
- Preferences stored in localStorage

## Getting Started

1. The database is already set up and running
2. Object storage is configured and ready
3. To access the admin panel:
   - Visit `/admin` (requires authentication)
   - Log in with Google, GitHub, or email/password
   - Create your first blog post
4. Posts are in draft mode by default
5. Change status to "Published" to make posts visible on the public site
