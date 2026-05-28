# Port OikOS Design into the Project

The uploaded zip is a complete React + Vite design kit for **OikOS** — an AI household OS with glassmorphism styling, 4 AI agents, and 10+ screens (home dashboard, AI chat, schedule, tasks, grocery, notifications, analytics, family, profile, onboarding) plus a responsive web/mobile split.

The current Lovable project is an empty TanStack Start template with a placeholder home page. I'll bring the design over and wire it into TanStack's file-based routing.

## What I'll do

1. **Bring in styles & tokens**
   - Merge `theme.css`, `fonts.css`, `globals.css` from the zip into `src/styles.css` (using oklch tokens, glass surfaces, gradients, Poppins/Inter font stack).
   - Keep the existing shadcn UI in `src/components/ui/` (already present, same shadcn base).

2. **Port reusable components**
   - Copy `oikos/*` (GlassCard, AIAgentStatus, AICommandBar, CalendarCard, TaskCard, GroceryListCard, NotificationCard, FamilyMembersCard, FloatingAIButton, AIAgentPanel, AIInsightCard, AISuggestionCard, ConflictResolutionCard, StatusBadge) into `src/components/oikos/`.
   - Port navigation: `BottomNav`, `WebSidebar` into `src/components/navigation/`.
   - Port `ImageWithFallback` helper.

3. **Convert screens → TanStack routes**
   Replace the single-state-machine `App.tsx` with real routes (each gets its own `head()` with unique title/description):
   - `/` → Onboarding (with "skip to dashboard" once seen, stored in localStorage)
   - `/dashboard` → EnhancedHomeDashboard (mobile) / EnhancedWebDashboard (desktop) via a responsive wrapper
   - `/ai` → AIChat
   - `/schedule` → DetailedScheduleScreen
   - `/tasks` → DetailedTaskScreen
   - `/grocery` → DetailedGroceryScreen
   - `/notifications` → DetailedNotificationsScreen
   - `/analytics` → AnalyticsDashboard
   - `/family` → FamilyManagementScreen
   - `/settings` → UserProfileScreen
   - Layout route renders `BottomNav` on mobile / `WebSidebar` on desktop via `<Outlet />`.

4. **Wire navigation**
   - Replace `onNavigate`/`onBack` props with `useNavigate()` and `<Link>` from `@tanstack/react-router`.
   - Replace the desktop/mobile `useState` switch with a `useMediaQuery` hook + responsive layout route.

5. **Cleanup**
   - Delete the placeholder index content.
   - Add any missing npm deps the OikOS components need (lucide-react is already standard; motion/framer-motion if used — I'll check during build).
   - Ensure errorComponent + notFoundComponent on routes with loaders.

## Technical notes

- All design tokens go into `src/styles.css` as oklch + CSS vars. No hardcoded colors in components.
- Components keep their current shadcn imports (`@/components/ui/...`) — paths already match.
- No backend yet: data stays as the mock data already inside each screen. We can add Lovable Cloud later for persistence.
- Onboarding completion stored in `localStorage` so route-based nav works (current code uses in-memory state).

## Out of scope (ask if you want these next)

- Lovable Cloud integration (auth, real data persistence for tasks/grocery/calendar).
- Real AI agent backend wiring (currently mock UI).
- PWA / native packaging.

Approve and I'll build it.
