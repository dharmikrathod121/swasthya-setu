# Swasthya Setu — Fix Plan (demo day)

Goal: make every signed-in feature work, unify the two UI shells, fix dark mode, and strip dead features. All agents work in this repo directly (no copies, no worktrees).

## A. AI pipeline (Agent A)
1. **Groq vision model**: `app/api/_lib/groq.ts` VISION_MODELS = `["qwen/qwen3.8-27b"]` (Llama 4 scout/maverick are deprecated on Groq → current 404). Text models unchanged (llama-3.3-70b-versatile fallback chain already works).
2. Fix `hidden={previewUrl || !file}` TS errors in the 4 analyzer clients (`!!previewUrl || !file`).
3. **Markdown rendering**: new `components/markdown.tsx` (tiny, dependency-free: bold/italic/headers/lists/code/paragraphs). Use for chatbot bubbles + all analyzer result areas.
4. **Prompt-leak/response hygiene**: tighten system prompts; strip template artifacts (repeated `|---|` tables, echoed instructions) before render.
5. **Chatbot image attach**: file input in `app/chatbot/page.tsx` + `components/chatbot-chat.tsx` → base64 data URL sent as `image_url` parts (route already supports them).
6. Analyzer processing panels must always terminate on success AND error (no stuck spinner).

## B. Shell, layout, dark mode (Agent B)
1. **Single source of truth for chrome**: two `layout.tsx` variants — public (landing/hospitals/doctors/login) vs app shell (everything signed-in: dashboard, ai-services, health-tools, analyzers, chatbot, medicine-identifier, search, clinics, about, emergency). Remove double header/footer on `/health-tools` (page AND layout both render PublicHeader/PublicFooter).
2. `components/app-layout.tsx`: wire real user (name/email from `useAuth`) + avatar; user chip opens a profile card/dropdown (email, Dashboard, Sign out). Remove Book/Chat/Settings dead actions. Mobile: burger toggles ONE state shared with sidebar.
3. `components/app-sidebar.tsx`: add close (X) button + backdrop click close + close on navigate; single open state; remove Appointments/Doctor Chat links; ThemeToggle stays.
4. **Dark mode**: globals.css uses `[data-theme="dark"]` but next-themes sets `class="dark"` → replace ALL `[data-theme="dark"]` with `.dark` in app/globals.css.
5. `app/search/page.tsx`: fix layout glitch inside app shell.
6. `app/dashboard/page.tsx`: aiCards → real tool routes (report-analyzer, prescription-analyzer, food-analyzer, medicine-identifier, chatbot, health-tools); remove booking/doctor-chat cards.

## C. Feature removal + WhatsApp/108 (Agent C)
1. Delete: `app/appointments/`, `app/appointment/`, `app/chat/`, `components/chatbot-doctor-chat.tsx`, `app/api/appointments/`.
2. New `lib/whatsapp.ts`: `whatsappLink(text)` using `NEXT_PUBLIC_WHATSAPP_NUMBER` (fallback 919978624295).
3. Replace booking everywhere with WhatsApp CTA: `app/doctors/[id]/doctor-profile-client.tsx`, landing `app/page.tsx` (booking card → WhatsApp; doctor-chat card → AI chatbot), auth copy.
4. Emergency page → simple `tel:108` redirect page (drop voice triage mic UI stub).
5. `middleware.ts`: drop /appointments, /chat from PROTECTED_ROUTES + matcher.

## Verification
`npx tsc --noEmit`, `npx eslint <changed>`, then `npm run build` / manual click-through of each tool.
