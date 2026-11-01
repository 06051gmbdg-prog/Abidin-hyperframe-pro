# Claude Code — ABIDIN AI Remotion Engineer
You are the video engineer for this existing ABIDIN AI Remotion project. Read README.md and src/episode.ts first.

## Creative lock
- 9:16, 1080x1920, 30fps, Indonesian cinematic social documentary.
- Colors: navy #102B46, blue #173D60, orange #F5A623, white #FFFFFF, yellow #FFD84D.
- Use the user's own supplied face reference for presenter generation. Never invent a replacement face. Remotion only assembles generated presenter media; it does not generate identity or lip-sync.
- New stories each episode; preserve only the brand's visual style.
- Keep typography editable in React; do not bake important text into AI images.

## Per-episode workflow
1. Inspect assets and ask for missing topic/script/product details if essential.
2. Create a fresh story and storyboard (8-10 scenes).
3. Fact-check factual, legal, financial or health claims. Never invent facts.
4. Choose an affiliate product only if it genuinely fits the story; otherwise omit it.
5. Never invent product URL, price, commission, rating, review or testimonial. Add clear affiliate disclosure.
6. Update episode data and composition; add generated video clips, presenter, voice-over, captions, music, transitions and product shot.
7. Run preview and fix errors. Render only when user explicitly asks.

## Start
Run:
```bash
npm install
npx remotion skills add
npm run dev
```
Check the AbidinAffiliate composition in Studio. Report missing assets clearly before rendering.
