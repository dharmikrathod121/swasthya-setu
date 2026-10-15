# Swasthya Setu — Fix Plan (Demo Tomorrow)

> Working directory: `C:\Users\Dharmik\Desktop\PROJECTS\SwasthyaSetu\swasthya-setu`
> Rule for all agents: work IN this directory only. Do NOT copy/paste the folder elsewhere. Read + edit in place. This avoids laptop overload.

## 0. Priority order for demo (do in this order)

1. **P0 — Crash/demo-blockers:** #7 image model 404, #8 markdown + system-prompt leak, #5 wrong tool links, #6 double header, #4/#17 header mixing, #1 Sign-in still showing.
2. **P1 — Demo flow:** #9/#10/#12 remove booking+appointments+doctor-chat, WhatsApp redirect, #14 emergency tel:108, #13 file upload in general assistant, #2/#3 unified AppLayout + collapsible sidebar.
3. **P2 — Polish:** #15 search UI, #16 dark mode, #11 verify all health tools, #18 other issues.

---

## 1. After signup still shows Sign in in /dashboard + user logo/card (#1)

**Root cause:**
- `components/app-layout.tsx:89-98` hardcodes `Sign in` text, never reads `useAuth()`.
- `lib/hooks/use-supabase.ts:11-16,23-43` loading flash: while `loading=true` it renders app-shell with wrong label.
- `components/auth/auth-form.tsx:158-170` signup with email-confirm returns `session==null` → user not logged in but pushed to protected route.
- `components/shared/auth-modal.tsx:25-30` only `onClose()`, no router refresh → stale header.

**Fix:**
- In `components/app-layout.tsx:18,89-98`: use `const {user, loading, logout} = useAuth()`. If `loading` render skeleton. Else show avatar circle with first letter of `user.email` / `user_metadata.name`, dropdown card on click: name, email, Dashboard, Sign out button (`logout()` same as `components/public-header.tsx:25-34`).
- In `components/shared/auth-provider.tsx:26-40`: after login/signup call `router.push('/dashboard') + router.refresh()`.
- In `components/auth/auth-form.tsx:162-163,183-184`: if `needsEmailConfirm` show "check email" message, do NOT push to `/dashboard`.
- Add `components/shared/user-profile-card.tsx` (new, small): avatar + name + email + Sign out. Reuse in AppLayout topbar.

---

## 2. One header + same sidebar in all signed-in pages (#2)

**Current map:**
- AppLayout (sidebar + app-topbar + app-footer): `app/dashboard/page.tsx:3,170,244`, `app/search/layout.tsx:1,8`, `app/about/layout.tsx:1,8`, `app/clinics/layout.tsx:1,8`, `app/chat/page.tsx:2,7,88`, `app/appointments/*`, `app/appointment/*`.
- PublicHeader/Footer direct: `app/page.tsx:2-3,14,217`, `app/ai-services/page.tsx:2-3,14,35`, `app/health-tools/page.tsx:1-2,7,143`, `app/chatbot/page.tsx`, `app/hospitals/hospitals-client.tsx:5-6,232,479`, `app/doctors/[id]/*`, `app/report-analyzer/*`, `app/prescription-analyzer/*`.
- Wrapper layouts with Public chrome: `app/health-tools/layout.tsx`, `app/food-analyzer/layout.tsx`, `app/medicine-identifier/layout.tsx`, `app/medicine-catalog/layout.tsx`.

**Fix:**
- Create two route groups (no URL change if using `(app)` + `(public)` groups, or simplest: keep files but standardize):
  - Option A (fastest for tomorrow): make `components/app-layout.tsx:23-30` the ONLY auth-switch. All signed-in routes MUST render `<AppLayout>` either via `app/<route>/layout.tsx:8` wrapping, NOT in-page. Remove direct `<PublicHeader/>` from any route that can be visited logged-in.
  - Move: `app/ai-services/page.tsx:1-4,14,35`, `app/health-tools/page.tsx:1-2,7,143`, `app/hospitals/*`, `app/doctors/[id]/*`, `app/report-analyzer/*`, `app/prescription-analyzer/*`, `app/food-analyzer/*`, `app/medicine-identifier/*` → if `isLoggedIn` use AppLayout, else PublicHeader. Easiest: wrap them with AppLayout which already has guest branch `if(!loading && !isLoggedIn)` → Public shell.
- Delete duplicate wrapping: pages that already have `layout.tsx` with AppLayout must NOT also `<AppLayout>` in-page. Check `app/dashboard/page.tsx:170,244`, `app/chat/page.tsx:7`. Keep only layout-level.
- Update `middleware.ts:9-14` PROTECTED_ROUTES to include `/health-tools, /report-analyzer, /prescription-analyzer, /food-analyzer, /medicine-identifier, /search, /hospitals, /clinics` OR decide public-with-gate. For demo, keep analyzers public but UI-consistent via AppLayout guest branch.

---

## 3. Sidebar closing (#3)

**Root cause:**
- `components/app-sidebar.tsx:46-89`: `open` state never set `true` (only `setOpen(false)` on backdrop/link `L53-55,68`). `aside#app-sidebar.open L56` never activates.
- `components/app-layout.tsx:37-45` burger toggles `document.body.classList.toggle("sidebar-open")` — CSS-only, never touches React `open`. `aria-expanded="false" L41` never updated.
- `app/globals.css:4501-4517,4621-4622,4647-4676`: desktop fixed width, mobile `transform:translateX(-100%)`, `body.sidebar-open .app-sidebar{translateX(0)}`. No `.app-sidebar.open` rules → React class does nothing.

**Fix:**
- Lift state: in `app-layout.tsx` create `const [sidebarOpen, setSidebarOpen] = useState(false)`. Pass to `<AppSidebar open={...} onClose={...}/>`. Burger `onClick={() => setSidebarOpen(v=>!v)}`, update `aria-expanded`.
- In `app-sidebar.tsx`: accept props, `aside className={open?'open':''}`, backdrop visible when open, link click → `onClose()`, add Escape key close + focus-trap minimal.
- Add CSS: `.app-sidebar.open{transform:translateX(0)}` + `.sidebar-backdrop.open{opacity:1;pointer-events:auto}` for desktop collapse too. Add collapse-to-icon-rail button for desktop (`--sidebar-width` toggle).

---

## 4. AI services using non-signup header + other pages (#4)

- `app/ai-services/page.tsx:1-4,14,35` directly `<PublicHeader/><PublicFooter/>`. No `app/ai-services/layout.tsx`. Fix: create `app/ai-services/layout.tsx` with `<AppLayout>{children}</AppLayout>`, remove direct PublicHeader/Footer from page.
- Audit all: `grep -r "PublicHeader" app/` → replace with AppLayout for: `ai-services`, `health-tools`, `hospitals`, `doctors/[id]`, `report-analyzer`, `prescription-analyzer`. Keep PublicHeader only in `app/page.tsx` (landing), `app/login`, `app/signup`.
- See §2.

---

## 5. Clicking health tool in /dashboard opens ai-services page (#5)

- `app/dashboard/page.tsx:68-111` `aiCards[0]` has `href:"/ai-services"` but title "AI Medical Report Analyzer" → should be `"/report-analyzer"`.
- `app/page.tsx:125-145` landing AI Report card same bug `href="/ai-services"` → fix to `"/report-analyzer"`.
- `components/app-sidebar.tsx:19-27` missing `{href:"/report-analyzer"}` → add "Report Analyzer".
- `app/dashboard/page.tsx:121-135 FeatureCard + 224-240` uses plain `<a href>` → change to `next/link <Link>` to avoid full reload.

---

## 6. /health-tools uses non-signup header + two headers/footers (#6)

- `app/health-tools/layout.tsx:1-2,11,13` renders `<PublicHeader/><main>{children}</main><PublicFooter/>` AND `app/health-tools/page.tsx:1-2,7,143` renders same → double.
- Fix: keep ONLY layout-level. Delete header/footer from `page.tsx`. Then change layout to `<AppLayout>` (which handles guest vs authed). Same check for `food-analyzer`, `medicine-identifier`, `medicine-catalog` layouts vs pages.
- `app/search/page.tsx:157-158`, `app/clinics/page.tsx:10` already warn against double-wrap — follow that pattern.

---

## 7. Image not supported — 100% free option (#7)

**Root cause:**
- Central config `app/api/_lib/groq.ts:7-20`: `VISION_MODELS=["meta-llama/llama-4-scout-17b-16e-instruct","meta-llama/llama-4-maverick-..."]`. Both deprecated on Groq (Maverick 03/09/26, Scout 07/17/26). User saw `Maverick failed (404)` in `groq.ts:197-198`. Text models `llama-3.1-8b-instant`, `llama-3.3-70b-versatile` also shutdown 08/16/26. Only `openai/gpt-oss-120b` live and text-only.
- Affected: `app/api/medicine-identify/route.ts:43-57`, `app/api/analyze/route.ts:40`, `app/api/food/route.ts:43-48`, `app/api/chatbot/route.ts:97-101` (when image sent).
- Upload code works (`medicine-identifier-client.tsx:32-56,81-95`, `food-analyzer-client:71-95`, `prescription:68-92`, `report:63-87` via `POST /api/upload` → Supabase bucket or base64 fallback) but feeds dead model.

**100% free fix (no new paid key):**
1. Quick stay-on-Groq: in `groq.ts:10-20` replace with live IDs — check `console.groq.com/docs/models`: `TEXT_MODELS=["openai/gpt-oss-120b","openai/gpt-oss-20b","qwen/qwen3-32b"]`. For vision, verify live Scout replacement; if none live, use option 2.
2. Recommended true-free, no-key: **Pollinations.ai OpenAI-compatible** `https://text.pollinations.ai/openai` with `model:"openai"` accepts same `{type:"image_url"}` shape as `groqChat`, no key, free. Add as fallback provider in `groq.ts:groqChat()` if `status==404`: try Groq first, then fetch Pollinations.
3. Alternatives needing free key (if sir asks): Google AI Studio `gemini-2.0-flash` (free-tier vision) or HuggingFace Inference `meta-llama/Llama-3.2-11B-Vision-Instruct`.
- Also: compress/downscale client-side before `uploadOrInline` to stay under 20MB, update `app/api/chatbot/route.ts:131-133` model list endpoint.
- Env keys present: `GROQ_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, etc. (names only, `.env.local`).

---

## 8. AI response format bad (no markdown) + leaks system prompt (#8)

**No markdown lib:** `package.json:11-31` has no `react-markdown/remark/rehype/marked`. All outputs raw:
- `components/chatbot-chat.tsx:121-130 {m.content}`, `components/chatbot-doctor-chat.tsx:69-77,79-81 {m.text}`, `components/chatbot-preview.tsx:86-90 {msg.text}`, `report-analyzer-client:370,398 whiteSpace:pre-line`, `prescription:370`, `food:469 + rawFallback:317,469`. So `**bold**`, tables, fences show literally.

**System prompt leak vectors:**
- `app/api/chatbot/route.ts:13-21 SYSTEM_PROMPT` server-only good, but `sanitizeMessages():34-63` allows `role:"system"` from client (`42: ["system","user","assistant"].includes`) + spreads at `93` → attacker can inject/echo.
- All routes return `detail:result.detail` (`chatbot:109,118-122`, `medicine-identify:60-66`, etc.) + frontend renders `data?.error` directly (`chatbot-chat:74`, etc.) → model echo displayed verbatim.

**Fix everywhere:**
- `npm i react-markdown remark-gfm` → create `components/shared/markdown.tsx` (`<ReactMarkdown remarkPlugins={[remarkGfm]}>`) → use in `chatbot-chat`, `chatbot-preview`, `report/prescription/food` summaries.
- In `app/api/chatbot/route.ts:42`: filter to `["user"]` only (drop client `system`), or map system→user. Same for `analyze/food/medicine-identify/hospitals/ai-search:10-21`.
- Never render `detail` to users: log only, show generic "AI busy, try again".
- Strip `stripJsonFences` only for JSON parse (`food:43-65`, `groq.ts:261-274`), display via Markdown.

---

## 9. Remove booking, provide WhatsApp redirect (#9)

**Delete:**
- `app/appointment/page.tsx` (BookAppointmentPage L4, Confirm Booking L89-91), `app/appointments/page.tsx` (useAppointments L6,45, Book new L92-94), `app/api/appointments/route.ts`, `app/api/appointments/[id]/route.ts`, `lib/hooks/use-api.ts:19-23 useAppointments`, `lib/supabase/schema.sql:78`, `rls-policies.sql:9,25-28`, `middleware.ts:11,54`.

**Replace CTAs with `https://wa.me/<NEXT_PUBLIC_WHATSAPP_NUMBER>?text=...`:**
- `app/doctors/[id]/doctor-profile-client.tsx:42-46 handleBook, 101-124 booking-widget`, `app/hospitals/[id]/hospital-detail-client.tsx:162-170 cta-bar#book`, `components/app-layout.tsx:76-79 topbar-add /appointment`, `app/dashboard/page.tsx:28-34 +179-187 Find & Book Care`, `app/page.tsx:103-123`, `app/chat/page.tsx:76-78`, `app/emergency/page.tsx:75-78 vt-book`.
- Env already has `NEXT_PUBLIC_WHATSAPP_NUMBER` → create `lib/whatsapp.ts` helper `waLink(text)`.
- Copy rewrites: `app/about/page.tsx:120`, `terms:28`, `privacy:24`, `auth-layout:13-14,134`, `doctors/[id]/page.tsx:16`, `layout.tsx:32`, `api/chatbot/route.ts:21`, `clinics/page.tsx:4-6`.
- CSS dead after: `globals.css:1267,1602,5982-6027,6387,6687 .booking/.book-modal/...` → delete or leave.

---

## 10. Remove appointments (#10)

Same file list as §9. Also remove sidebar link, dashboard stats, `middleware` entry. Search `grep -r "appointment" --include="*.tsx" --include="*.ts"` to catch leftovers.

---

## 11. Make sure all health tools working (#11)

- Fix double chrome (§6), fix model (§7), fix markdown (§8).
- `report-analyzer-client.tsx:158-161` rejects PDF but `271,297` claims PDF support + `accept="image/*,application/pdf"` → either accept PDF via OCR/text extract or change copy to "images only".
- `middleware.ts:9-14` analyzers public but `ai-services-grid.tsx:69-71 locked=loading||!isLoggedIn` gates UI only → direct URL bypass. Decide: remove `locked` claim OR add to PROTECTED_ROUTES. For demo, remove lock, keep public.
- `app/api/hospitals/ai-search/route.ts:76-83,102-110 keywordFallback` is only resilient tool — keep pattern.
- Test checklist: report, prescription, food, medicine-identifier (with new vision model), health-tools BMI/calorie/water/steps/BP, chatbot text+image, hospital search.

---

## 12. Doctor chat not possible — remove (#12)

- Delete: `app/chat/page.tsx` (Free Doctor Chat L12, fake voice L37-43, Book/Voice L76-81), `components/chatbot-doctor-chat.tsx:14,38-47`.
- Remove nav: `components/app-sidebar.tsx:32`, `components/app-layout.tsx:13,21,80-82`, `components/public-header.tsx:19`, `middleware.ts:12,55`, cards `app/dashboard/page.tsx:36-41`, `app/page.tsx:191-208`, `api/chatbot/route.ts:21`, `auth-layout.tsx:17-19,134`.
- Keep `app/chatbot/*` (AI Assistant, `ChatbotChat`) — do NOT delete.

---

## 13. Add file(image) option in general AI assistant (#13)

- Missing: `components/chatbot-chat.tsx:30-33,194-218` text input only, `send():55-84` sends `{content:string}` only. `chatbot-doctor-chat.tsx:128-130` attach button dead (no onClick). `chatbot-preview.tsx:126-150` text only by design.
- Backend already supports: `app/api/chatbot/route.ts:50-60` accepts `image_url` parts, `groq.ts:98-109 normalizeImageUrl, 79-92 hasImageContent, 112-114 pickModels` auto-switches to vision.
- Fix: copy `medicine-identifier-client.tsx:41-56 uploadOrInline` → add file picker + preview thumbnail + send `content:[{type:"text"...},{type:"image_url"...}]` in `chatbot-chat.tsx`. Reuse after vision fix (§7).

---

## 14. Redesign emergency/voice triage to tel:108 redirect (#14)

- `app/emergency/page.tsx` server-only, no `use client`, dead IDs `vt-mic L37, vt-status L40, vt-transcript L44, vt-texttoggle/fallback/submit L47-56, vt-result/sev/advice/hospital L58-69, vt-restart L80`. No `SpeechRecognition` in repo (grep 0). CSS only `globals.css:7543-8020 .vt-page (color-scheme:dark L7552)`.
- Only working: `L71 a#vt-call href=tel:108`.
- Fix: replace `vt-mic-wrap/transcript/fallback/result L36-84` with single big `<a href="tel:108" class=vt-call>Call 108 Now</a>` + secondary WhatsApp + "what to say" static steps. Delete `Link#vt-book->/appointments L75-78`.
- `app/page.tsx:220-222 voice-triage-pill 🎙 Voice Triage → /emergency` → change to `<a href="tel:108">Call 108 — Emergency</a>`.

---

## 15. After-sign-in General → Search UI error (#15)

- `app/search/page.tsx:70-80` puts icon+input+button inside `.search-bar`. `globals.css:2991-2994 .search-bar{position:relative;max-width:600px}` has no flex, `2996-2999 input width:100%`, `3018-3025 icon absolute` → button wraps below, icon overlaps.
- Fix: follow `hospitals-client.tsx:244-254 +256-273` / `clinics/page.tsx:29-41`: wrapper holds only icon+input, button outside, or make `.search-bar{display:flex;gap:8px;align-items:center}` + `input{padding-left:40px;padding-right:110px}` + button absolute right OR flex child. Add `type="submit"`.
- Accessed via Sidebar General `app-sidebar.tsx:38-43`.

---

## 16. Dark mode not working entire app (#16)

**Root cause:**
- `app/layout.tsx:60-65 <ThemeProvider attribute="class" ...>` + `theme-provider.tsx:4-11` passthrough, `theme-toggle.tsx:3,9,29 useTheme()->theme/setTheme`. `next-themes attribute="class"` adds `class="dark"` on `<html>`, but custom vars listen to `[data-theme="dark"]` never set: `globals.css:165-187,4290-4310,434-435,3953-3954,4604-4605,1232,6361`. `globals.css:6 @custom-variant dark (&:is(.dark *))` only affects Tailwind `dark:` utilities. `globals.css:307-339 .dark{--background...oklch}` only shadcn tokens, missing `--color-base/surface/text-*/border-*` so app stays light. Comment confirms in `auth-layout.tsx:28-34`.

**Fix:**
- Change `ThemeProvider` to `attribute="data-theme"` OR duplicate dark vars under `.dark:` selector. Simplest: `attribute="data-theme"` + keep `.dark` fallback: in `globals.css` change `[data-theme="dark"]` → `[data-theme="dark"], .dark` OR add `:is(.dark)` variant.
- In `theme-toggle.tsx`: use `resolvedTheme` not `theme` for `system` mode.
- Verify `app-sidebar.tsx:5,83`, `public-header.tsx:6,62` toggles update.

---

## 17. Separate UI components mixing public vs signed-in (#17)

- Public (logged-out): `components/public-header.tsx:61-90` + `public-footer.tsx:3-19` (links Hospitals/Doctors/AI Tools/Doctor Chat/About `public-header:15-21`, no sidebar).
- Signed-in: `components/app-layout.tsx:35-100` (app-topbar logo L49-59, topbar-search L62-73 uncontrolled, topbar-actions L75-99 dead Book/chat/emergency/settings) + `L102 AppSidebar` + `L106-116 app-footer`.
- Rule: PublicHeader/Footer ONLY in `app/page.tsx`, `login/signup`. AppLayout EVERYWHERE else (it already switches guest→public shell `app-layout:23-30`). Delete all direct PublicHeader imports from signed-in routes (§2 list).
- Fix topbar: `global-search input L62-73` add form/router to `/search`, Settings button add handler or remove, replace `Sign in L89-98` with profile card (§1), fix footer links `app-layout:111-114 <a href="#">` → `/privacy,/terms`.

---

## 18. Other issues found (#18)

- `/doctors` redirect stub `app/doctors/page.tsx:1-7 → /hospitals?tab=doctors` but linked everywhere (`app-sidebar:15`, `public-header:17`, `dashboard:22`, `appointment:11`) → redirect flash, active state `app-sidebar:65-67` never matches. Fix: link directly to `/hospitals?tab=doctors` or make real page.
- `/clinics` duplication: standalone `app/clinics/page.tsx:1-96` vs tab in `hospitals-client:16,292-304`. Pick one.
- `/medicine-catalog` orphaned (zero nav refs, `grep medicine-catalog → 0`), sidebar `app-sidebar:25 /medicine-identifier label Medicines` mislabeled (AI camera, not catalog). Fix labels + add catalog link or remove catalog.
- `/appointment` singular (public, not in middleware) vs `/appointments` plural (protected) → both to be deleted (§9).
- `/chat` vs `/chatbot`: middleware protects `/chat` only, sidebar lists both, landing `app/page:44 Try as guest → /chatbot`. After §12 only `/chatbot` remains (rename to `/ai-assistant` or keep).
- Dead links: `app-layout:111-114 href="#"`, `search/page:125 doctors → /hospitals?tab=doctors` drops `d.id`, `search:135-142 medicines no link`, `medicine-catalog/page:20,32-39,62 form#mc-search-form, button#mc-camera, div#mc-results` no handlers, `dashboard:124,225-227 <a>` not `<Link>`.
- Topbar dead: `app-layout:62-73 search no router, 86-88 Settings no handler`.
- Mobile sidebar dead (§3), `middleware:52-60` catch-all runs `getSession` every public route, `loginUrl redirect` only for `/login` not `/signin`.
- No `loading.tsx/error.tsx`, only `search:85-86,92-103 + hospitals:384` have loading.

---

## Appendix: Agent delegation (avoid laptop overload)

- All agents work in `C:\Users\Dharmik\Desktop\PROJECTS\SwasthyaSetu\swasthya-setu`, in-place edits only, max 2 parallel file writers, `npm run dev` once to verify, `npm run build` at end.
- Suggested split:
  - Agent A (Layout/Auth): §1,2,3,4,6,15,17.
  - Agent B (AI): §5,7,8,11,13.
  - Agent C (Removal/Theme): §9,10,12,14,16,18.
- Verify: `npm run lint`, `npm run build`, click-test: signup→dashboard profile, tool cards, image upload, markdown, tel:108, dark toggle, search, no double headers.
