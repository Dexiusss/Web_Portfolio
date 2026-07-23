# 🎨 Ricky Mario | Personal Portfolio & Interactive Showcase

<div align="center">

  ![Next.js 16](https://img.shields.io/badge/Next.js%2016-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
  ![React 19](https://img.shields.io/badge/React%2019-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  ![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
  ![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=black)
  ![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

  <p align="center">
    <b>A high-performance, interactive portfolio bridging Data Science with UI/UX & Graphic Design.</b>
  </p>

</div>

---

## 🌟 Highlights

Welcome to the official repository of **Ricky Mario Butar Butar**'s personal portfolio. Built with Next.js 16 App Router, Turbopack, and Supabase, this web application highlights the synergy between **analytical data science** and **intuitive UI/UX design**.

- 🧊 **Interactive Glass Surface Navbar**: Integrated SVG displacement maps & 20px frosted glass backdrop blur using customized React Bits `<GlassSurface />`.
- 🌓 **Dynamic Dark / Light Mode**: Seamless theme switching featuring circular View Transition API ripples and consistent color accents.
- 📱 **Adaptive Navigation System**: Includes a GSAP-animated desktop `PillNav` and a fixed mobile `StaggeredMenu` drawer.
- 🛠️ **Full-Featured Admin CMS**: Built-in dynamic project dashboard, experience timeline editor, tool marquee manager, and direct Supabase file upload pipeline.
- 🖼️ **Full-Screen Lightbox Portals**: Scroll-locked image viewer with tap-outside dismiss for UI/UX & graphic design showcases.
- ⚡ **Ultra-Fast Performance**: 100% static page pre-rendering, responsive image sizing, and GPU-accelerated smooth animations.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology |
| --- | --- |
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **Styling** | Modern Vanilla CSS, CSS Variables, Glassmorphism, Responsive Grid |
| **Animations** | GSAP, Framer Motion, View Transitions API |
| **Components** | Lucide React, Custom React Bits Components |
| **Backend & Storage** | Supabase Database & Storage Buckets, Node.js API Routes |
| **Authentication** | Cryptographically Signed Session Cookies (`crypto.timingSafeEqual`) |

---

## 📁 Folder Structure

```
portfolio/
├── app/
│   ├── about/            # About Me page & detailed bio
│   ├── admin/            # Admin CMS Dashboard & Project Manager
│   ├── api/              # Secure API endpoints (auth, projects, upload)
│   ├── experiences/      # Timeline & experience details
│   ├── extra/            # Interactive project playground (Coming Soon)
│   ├── project/[id]/     # Dynamic project detail views
│   ├── globals.css       # Global design tokens & CSS variables
│   └── layout.js         # Root layout with OpenGraph SEO & theme providers
├── components/
│   ├── GlassSurface.js   # React Bits glass distortion surface component
│   ├── PillNav.js        # Desktop GSAP pill navigation bar
│   ├── StaggeredMenu.js  # Mobile navigation drawer & header controls
│   ├── WhoAmI.js         # Bio & stacked photo gallery with gesture controls
│   ├── WorkSection.js    # Interactive project showcase grid
│   └── admin/            # CMS management sub-components
└── lib/
    ├── supabase.js       # Supabase client instance
    └── data.js           # Fallback mock data
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** / **pnpm** / **yarn**

### 2. Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/ricky-mario-portfolio.git
cd ricky-mario-portfolio
npm install
```

### 3. Environment Variables Setup
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_PASSWORD=your_admin_dashboard_password
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔒 Security & Performance

- **Environment Protection**: All secret keys and database credentials are excluded via `.gitignore`.
- **HMAC Signed Sessions**: Admin endpoints enforce strict session validation before executing data mutations or storage uploads.
- **Lighthouse Optimized**: Preconnected font loading, responsive image `sizes` attributes, and debounced resize observers for 60+ FPS mobile interaction.

---

<div align="center">
  Designed & Developed with ❤️ by <b>Ricky Mario Butar Butar</b>
</div>
