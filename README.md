# My Portfolio - Interactive Developer Portfolio

A modern, interactive portfolio website built with Next.js 15, TypeScript, and advanced web technologies. Features smooth animations, 3D elements, and an engaging user experience.

## 🚀 Features

- **Interactive Sections**: Hero, About, Skills, Projects, and Gallery
- **3D Avatar**: Three.js powered 3D character with animations
- **Smooth Animations**: GSAP-powered scroll animations and transitions
- **Responsive Design**: Mobile-first approach with modern CSS
- **Performance Optimized**: Lazy loading, code splitting, and optimization
- **TypeScript**: Full type safety and modern development experience

## 🛠️ Tech Stack

### Core Technologies

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development
- **Sass/SCSS** - Advanced CSS preprocessing

### Animation & 3D

- **GSAP 3** - Professional-grade animations
- **Three.js** - 3D graphics and WebGL
- **ECharts** - Interactive data visualization

### Development Tools

- **ESLint** - Code quality and consistency
- **Prettier** - Code formatting
- **Turbopack** - Fast bundling and development

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with fonts and providers
│   ├── page.tsx           # Main portfolio page
│   └── globals.scss       # Global styles
├── lib/                    # Shared utilities and components
│   ├── ui/                # Reusable UI components
│   ├── gsap/              # GSAP configuration and hooks
│   └── types/             # TypeScript type definitions
├── modules/                # Feature-based modules
│   ├── HeroSection/       # Landing section with 3D avatar
│   ├── AboutSection/      # Personal information
│   ├── SkillsSection/     # Skills visualization with charts
│   ├── ProjectsSection/   # Project showcase
│   ├── GallerySection/    # Portfolio gallery
│   └── AnimatedCardSection/ # Animation wrapper
└── styles/                 # Global SCSS architecture
```

## 🎯 Key Components

### HeroSection

- Interactive 3D avatar with Three.js
- Animated text and content
- Responsive hero layout

### AboutSection

- Personal information display
- 3D avatar integration
- Smooth content transitions

### SkillsSection

- Interactive charts with ECharts
- Skills visualization
- Animated skill indicators

### ProjectsSection

- Project catalog with lazy loading
- Interactive project cards
- GSAP-powered animations

### GallerySection

- Carousel navigation
- Smooth transitions
- Responsive image handling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd my-portfolio
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run type-check` - TypeScript type checking
- `npm run analyze` - Bundle analysis

## 🎨 Design System

### Typography

- **Chango** - Display font for headings
- **Okinawa** - Decorative font
- **Leckerli One** - Handwritten style
- **Roboto Serif** - Body text
- **Poppins** - UI elements

### Color Scheme

- Modern, professional palette
- Consistent with brand identity
- Accessible contrast ratios

### Animation Principles

- Smooth, purposeful movements
- Performance-optimized transitions
- Progressive enhancement approach

## 🔧 Configuration

### Next.js Configuration

- Turbopack for fast development
- Optimized package imports
- Advanced CSS optimization
- Web Vitals attribution

### GSAP Configuration

- ScrollSmoother integration
- Custom animation presets

### E2E Notes (Playwright)

- Wait for preloader to complete before asserting animations:

```ts
await page.waitForEvent('console', { predicate: (m) => m.text().includes('preloader:complete'), timeout: 0 }).catch(() => {});
await page.waitForFunction(() => !!document.querySelector('[data-preloader-root]') === false);
```

- Ensure ScrollSmoother is ready and pin-spacer is created before checking ScrollTrigger-driven states:

```ts
await page.waitForFunction(() => {
  const smoother = (window as any).ScrollSmoother?.get?.();
  const wrapper = document.querySelector('.portfolio__wrapper') || document.querySelector('#smooth-content');
  const hasPinSpacer = wrapper?.parentElement?.querySelector('.pin-spacer');
  return Boolean(smoother) && Boolean(hasPinSpacer);
});
```

### TypeScript Configuration

- Strict mode enabled
- Path aliases configured
- Modern ES features

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint system
- Touch-friendly interactions
- Optimized for all devices

## 🚀 Performance Features

- **Code Splitting**: Lazy loading of heavy components
- **Image Optimization**: WebP and AVIF formats
- **Font Optimization**: Next.js font optimization
- **Bundle Analysis**: Webpack bundle analyzer
- **Tree Shaking**: Unused code elimination

## 🧪 Development Workflow

1. **Feature Development**: Create modules in `src/modules/`
2. **Component Library**: Add reusable components in `src/lib/ui/`
3. **Styling**: Use SCSS with BEM methodology
4. **Types**: Define TypeScript interfaces in module types
5. **Testing**: Ensure responsive design and performance

## 📦 Build & Deployment

### Production Build

```bash
npm run build
npm run start
```

### Deployment Options

- **Vercel**: Recommended for Next.js
- **Netlify**: Static site generation
- **Docker**: Containerized deployment

## 🤝 Contributing

1. Follow TypeScript strict mode
2. Use BEM methodology for SCSS
3. Keep functions under 20 lines
4. Maintain component hierarchy
5. Test responsive design

## 📄 License

This project is private and proprietary.

## 👨‍💻 Author

**Melik Musinian** - Full-Stack Developer

---

_Built with modern web technologies and best practices for optimal performance and user experience._
