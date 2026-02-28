# Design Guidelines for Valen's Journey Blog

## Design Approach
**Reference-Based Approach**: The design must match the provided reference image exactly - modern, minimal aesthetic with a dark blue theme. This is a personal blog/portfolio hybrid that balances content presentation with personal branding.

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**
- Background: #0b132b (deep navy blue)
- Text Primary: 255 255 255 (white)
- Text Secondary: 220 80% 90% (light gray-blue)
- Accent: 210 80% 60% (bright blue for links/CTAs)

**Light Mode**
- Background: 0 0% 98% (off-white)
- Text Primary: 220 20% 10% (dark navy)
- Text Secondary: 220 15% 40% (medium gray)
- Accent: 210 90% 50% (vibrant blue)

### B. Typography
- **Primary Font**: "Poppins" or "Inter" via Google Fonts
- **Hero Title**: 2.5rem-4rem, font-weight 700, tight leading
- **Section Headings**: 1.75rem-2.25rem, font-weight 600
- **Body Text**: 1rem-1.125rem, font-weight 400, line-height 1.7
- **Navigation**: 0.95rem, font-weight 500

### C. Layout System
- **Spacing Units**: Use consistent spacing of p-4, p-6, p-8, p-12, p-16, p-20 for sections
- **Container**: max-w-6xl mx-auto for content, max-w-4xl for reading content
- **Grid**: 12-column grid for layouts, single column on mobile
- **Section Padding**: py-16 to py-24 on desktop, py-12 on mobile

### D. Component Library

**Navigation Bar**
- Fixed/sticky header with backdrop blur effect
- Logo "Valen's Journey" (left-aligned, bold)
- Navigation links: About Me | Articles | Contact (center or right)
- Action buttons (right): Language toggle 🌐 and Theme toggle 🌙/☀️
- Height: 70-80px with subtle bottom border

**Hero Section**
- Full-width, min-height 70vh
- Centered content with title and subtitle
- Title: "Valen's Journey – Student-athlete journey: Swimming, Travel, Study and Personal Growth"
- Primary CTA button: "View Articles" (prominent, accent color)
- No background image - rely on dark blue gradient or subtle pattern

**About Me Section**
- Two-column layout on desktop (text + profile image placeholder)
- Single column on mobile
- Social media icons row: Instagram, TikTok, LinkedIn
- Clean typography hierarchy with the provided bio content

**Articles Grid**
- Card-based layout: 3 columns on desktop, 2 on tablet, 1 on mobile
- Each card: Cover image (16:9 ratio), title, date, short summary
- Hover effect: subtle lift and shadow
- Cards link to individual article pages

**Contact Section**
- Simple centered form with name, email, message fields
- Social media links repeated
- Clean input styling with focus states

**Footer**
- Minimal: Copyright, social links, navigation shortcuts
- Dark background even in light mode for contrast

### E. Interactive Elements
- **Mode Toggles**: Smooth transition between dark/light modes (0.3s ease)
- **Language Switch**: Icon-based toggle that updates all text content
- **Article Cards**: Scale transform on hover (scale: 1.02) with shadow increase
- **Buttons**: Solid fill with hover brightness adjustment, no complex animations
- **Links**: Underline on hover with accent color

### F. Bilingual Implementation
- All static content has EN/ES versions stored in JavaScript objects
- Language preference stored in localStorage
- Seamless content switching without page reload
- Flag or globe icon for language toggle

### G. Responsive Breakpoints
- Mobile: < 768px (single column, stacked navigation)
- Tablet: 768px - 1024px (2-column grids)
- Desktop: > 1024px (full multi-column layouts)

## Images
**Hero Section**: No hero image - use solid dark blue background with optional subtle gradient or pattern
**About Me**: Small to medium profile photo (300-400px width, rounded or square)
**Article Cards**: Cover images from Notion (16:9 aspect ratio, 800x450px recommended)
**Social Icons**: Use Font Awesome or similar icon library

## Accessibility
- High contrast ratios in both modes (WCAG AA minimum)
- Focus indicators on all interactive elements
- Smooth mode transitions to prevent jarring changes
- Keyboard navigation support throughout

## Brand Personality
Modern, clean, personal, international, athletic, ambitious - the design should feel approachable yet professional, reflecting a student-athlete's journey with global aspirations.