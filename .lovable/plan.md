
# OikOS — Full Product Build Plan

Goal: turn the current static OikOS shell into a complete, interactive, responsive product with auth, a real logo, working actions, toasts, and SEO — across all 9 sections.

---

## 1. Foundations

**Lovable Cloud (backend)**
- Enable Cloud for: auth (email + password, optional Google), profiles, family members, tasks, events, grocery items, notifications.
- Tables (all with RLS + grants):
  - `profiles` (id → auth.users, display_name, avatar_url, role, locale, created_at)
  - `families` (id, name, owner_id)
  - `family_members` (family_id, user_id, role, color)
  - `events` (family_id, title, start, end, owner_id, location, category)
  - `tasks` (family_id, title, status, assignee_id, due_at, priority)
  - `grocery_items` (family_id, name, qty, category, checked, added_by)
  - `notifications` (user_id, type, title, body, read_at, urgent)
  - `user_roles` + `has_role()` (per security rules)
- Auto-create profile + default family on signup via trigger.

**Logo**
- Generate a house-mark logo (rooflines forming an "O", warm gradient matching OikOS palette). Premium quality, transparent PNG.
- Variants: full logomark + icon-only (favicon, app icon).
- Wire into: `__root.tsx` head (favicon, og:image), Sidebar, Onboarding, Login, BottomNav header.

**Design system polish**
- Audit `styles.css` tokens — confirm glass surfaces, gradients, semantic colors used everywhere (no raw hex in components; fix `UserProfileScreen` hardcoded `from-[#FFF5F0]` etc.).
- Add `Toaster` (sonner) to root for success/error feedback.
- Add `ConfirmDialog`, `EmptyState`, `LoadingState`, `ErrorBoundary` shared components.

---

## 2. Auth & Onboarding

- `/login` — email/password + "Continue with Google" + forgot password link. Public route.
- `/signup` — name, email, password; creates profile + family.
- `/reset-password` — recovery flow (required leaf route).
- `/onboarding` — keep existing flow, persist completion to `profiles.onboarded_at` instead of localStorage.
- `_authenticated` layout — redirects unauth users to `/login`; wraps every app route.
- Update `_app.tsx` → `_authenticated/_app.tsx` so the whole app sits behind auth.

---

## 3. Sections (each: real data, working buttons, toasts, empty/loading/error states, mobile + desktop layouts)

### Dashboard (`/dashboard`)
- Greeting w/ user name + weather-style summary card.
- Quick stats (tasks today, events today, grocery count, unread notifs) — clickable → routes.
- AI Insight card, Conflict resolution card (dismiss/accept actions wired).
- "Quick add" FAB → modal (task / event / grocery item).

### AI Assistant (`/ai`)
- Chat UI backed by Lovable AI Gateway (google/gemini-2.5-flash default).
- Streaming responses, message history per user.
- Suggestion chips ("Plan my week", "What's for dinner?", "Resolve schedule conflict").
- Agent toggles from Profile actually filter which agents respond.

### Schedule (`/schedule`)
- Month + week + day views, create/edit/delete events (modal form with validation).
- Color-coded per family member; conflict detection banner.
- Drag-to-reschedule on desktop, long-press on mobile.

### Tasks (`/tasks`)
- Kanban (To Do / In Progress / Done) on desktop, swipeable list on mobile.
- Create, assign to member, set priority + due date, complete, delete.
- Filter by assignee/priority; bulk actions.

### Grocery (`/grocery`)
- Category-grouped list, checkbox to mark bought, swipe-to-delete.
- "Add item" inline, "AI suggest from meal plan" button → calls AI.
- Share list (copy link) action.

### Notifications (`/notifications`)
- Realtime via Supabase channel.
- Mark read/all-read, filter (alert/info/success), urgent pinning.

### Family (`/family`)
- List members w/ avatar, role, color.
- Invite by email (sends magic invite via edge action), edit role, remove.
- Permissions matrix (admin/member/child).

### Analytics (`/analytics`)
- Charts (Recharts): tasks completed/week, events per member, grocery spend trend, AI usage.
- Time range selector; export CSV button.

### Profile (`/settings` → rename to `/profile`)
- Avatar upload (Lovable Cloud storage), edit name/email/locale.
- Agent toggles persist to DB.
- Notification preferences persist.
- Connected services (Google Calendar OAuth via App User Connector — stub if out of scope).
- Sign out (working), delete account (confirm dialog).

---

## 4. Responsive & UX

- Desktop (≥768px): persistent `WebSidebar` + top header with logo, search, profile menu.
- Mobile (<768px): `BottomNav` + sticky top header w/ logo + page title + actions.
- Tablet: hybrid (collapsible sidebar).
- All cards/buttons get hover, focus-visible, active states; touch targets ≥44px.
- Motion: page transitions via `motion`, subtle stagger on lists.

---

## 5. SEO

- Run `seo_chat--trigger_scan` after build.
- Per-route `head()` already exists — verify titles unique, descriptions <160 chars, og:image points to new logo.
- Add `sitemap.xml` server route + `robots.txt`.
- JSON-LD `SoftwareApplication` on `/` (landing/login).
- Canonical only on leaves.

---

## 6. Technical notes

- All mutations go through `createServerFn` w/ `requireSupabaseAuth`.
- TanStack Query for reads (`ensureQueryData` in loaders under `_authenticated`).
- Toast helper: `toast.success` / `toast.error` after every mutation.
- Form validation: react-hook-form + zod.
- Realtime: notifications + tasks + events subscribe to Supabase channels.

---

## Out of scope (ask if needed)
- Native mobile packaging (Capacitor/PWA install prompt).
- Real Google Calendar two-way sync (stub UI only).
- Payments/billing screen wiring.

---

## Confirm before I build

1. **Auth providers**: email/password only, or also Google?
2. **Profiles**: confirm we want the `profiles` table + auto-create on signup (yes/no).
3. **Scope**: build all 9 sections fully in one pass, or ship in phases (Auth + Dashboard + Profile first, then the rest)?
4. **Logo**: house-shape mark with the existing warm pastel gradient (peach → blue) — OK, or want a different vibe (e.g. minimal mono, bold geometric)?
