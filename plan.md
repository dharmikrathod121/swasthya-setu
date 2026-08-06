# Swasthya Setu — Smart Digital Healthcare Platform

## Implementation Plan for Blackbox

### Tech Decisions (Locked — Do Not Change)

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 14+ App Router + TypeScript | SSR, API routes, SEO for healthcare |
| Styling | Tailwind CSS | Fast, consistent, professional |
| State Management | Zustand | Lightweight, simple, no boilerplate |
| Database | Skipped for now | Will add later when needed |
| AI API | Skipped for now | UI scaffolding only; real integration later |
| Mock Data | Local TS files | Swap for real API when data is provided |

---

### Phase 1: Project Scaffold

Run these commands in order:

1. `npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*" --no-eslint --no-tailwind-config --no-postcss --no-playwright --use-npm`
2. Install dependencies: `npm install zustand lucide-react clsx tailwind-merge @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tabs @radix-ui/react-select @radix-ui/react-alert-dialog @radix-ui/react-toast react-hook-form zod @hookform/resolvers`
3. Install dev deps: `npm install -D @types/zustand`
4. Set up Tailwind config (see below)
5. Set up tsconfig path aliases for `@/*`

### Phase 2: Foundation Files

Create these files with the exact content specified:

1. `src/lib/types.ts` — All TypeScript interfaces (User, Hospital, Doctor, Appointment, MedicalReport, Medicine, ChatMessage, FoodIngredient, FoodAnalysis, Review)
2. `src/lib/constants.ts` — App name, routes, config
3. `src/lib/utils.ts` — `cn()` helper using clsx + tailwind-merge
4. `src/lib/mock-data.ts` — Rajkot hospitals (15-20), doctors (30-40), medicines (50+), reviews, food data
5. `src/app/globals.css` — Tailwind directives + custom CSS variables for healthcare theme
6. `tailwind.config.ts` — Custom theme with healthcare color palette

### Phase 3: UI Component Library

Build `src/components/ui/` — every component must be typed, no `any`:

- button.tsx, input.tsx, card.tsx, badge.tsx, dialog.tsx, dropdown-menu.tsx, tabs.tsx, select.tsx, textarea.tsx, label.tsx, separator.tsx, skeleton.tsx, alert.tsx, toast.tsx

Use Radix UI primitives underneath. Each component must accept className prop for Tailwind extension.

### Phase 4: Layout Components

- `src/components/layout/header.tsx` — Navigation bar with logo, links
- `src/components/layout/footer.tsx` — Footer with links
- `src/components/layout/sidebar.tsx` — Dashboard sidebar with navigation
- `src/components/layout/navbar.tsx` — Top bar for dashboard pages
- `src/components/layout/role-guard.tsx` — Route guard based on user role

### Phase 5: Shared Components

- `src/components/shared/hero-section.tsx` — Landing page hero
- `src/components/shared/feature-card.tsx` — Feature showcase card
- `src/components/shared/stats-bar.tsx` — Stats counter bar
- `src/components/shared/testimonial-section.tsx` — Testimonials
- `src/components/shared/cta-section.tsx` — Call to action

### Phase 6: Zustand Stores

- `src/store/appointment-store.ts` — Appointments CRUD
- `src/store/chatbot-store.ts` — Chat messages, conversation history
- `src/store/ui-store.ts` — Sidebar open/close, theme, loading states

### Phase 7: Custom Hooks

- `src/hooks/use-hospitals.ts`
- `src/hooks/use-doctors.ts`
- `src/hooks/use-appointments.ts`
- `src/hooks/use-reports.ts`
- `src/hooks/use-chatbot.ts`
- `src/hooks/use-medicines.ts`
- `src/hooks/use-food.ts`
- `src/hooks/use-bmi.ts`

### Phase 8: Pages & Features (in this order)

1. Landing page: `src/app/page.tsx`
2. Dashboard layout + home
3. Hospital search + detail pages
4. Doctor search + detail pages
5. Appointment booking + list
6. Medical report upload + analysis placeholder
7. Medicine identifier + search
8. AI Health Chatbot interface
9. Smart Food Ingredient Analyzer
10. BMI Calculator
11. Admin panel (dashboard, users, hospitals, doctors management)

### Phase 9: API Routes (Mock)

- `src/app/api/hospitals/route.ts` — return mock hospital data
- `src/app/api/doctors/route.ts` — return mock doctor data
- `src/app/api/appointments/route.ts` — mock CRUD
- `src/app/api/reports/route.ts` — mock upload + analysis
- `src/app/api/chatbot/route.ts` — mock AI responses
- `src/app/api/medicines/route.ts` — mock medicine data
- `src/app/api/food/route.ts` — mock food analysis

### Design System Rules

- Colors: Primary teal (#0D9488), background slate-50 (#F8FAFC), white cards
- Typography: Inter font, 700 for headings, 400 for body
- Spacing: 4px base unit
- Border radius: 12px for cards, full for buttons
- Shadows: shadow-sm for cards, shadow-md for hover
- All icons from lucide-react
- No alert() or prompt() — use toast notifications
- Every component must have a loading/skeleton state
- Every page must be responsive (mobile + desktop)

### Code Quality Rules

1. Every component must be typed — no `any`
2. All data comes from mock-data.ts or API routes — never hardcoded in components
3. State that persists across pages goes to Zustand stores
4. Use `cn()` for class merging
5. Use `lucide-react` for all icons
6. No console.log in final code
7. No unused imports
8. Every API route returns typed JSON matching the interfaces in types.ts

### Implementation Order (Do Not Skip Ahead)

Follow phases in order. Each phase must be complete before starting the next. If something is unclear, ask before guessing.

### Open Items (Will Be Provided Later)

- Rajkot hospital/doctor data — will be provided by user
- AI API endpoint — will be provided by user

(End of file)