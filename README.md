# SkyPrep – اسکای‌پرپ
Bilingual (FA/EN) aviation exam trainer PWA built from the CAO Written Exam booklet (2,529 questions, 17 lessons).

- Lesson practice, 100-question random mock exam, mistakes / unseen / bookmarked review, study & search
- Negative marking: every 3 wrong answers cancel 1 correct; score shown as a percentage
- Personal panel: history, per-lesson stats, wrong-answer counts, never-answered questions
- Dark / light, offline, installable

## Deploy on GitHub Pages
1. Create a repo and push these files to `main`.
2. Settings → Pages → Source: **GitHub Actions** (the included workflow deploys it).
3. Open `https://<user>.github.io/<repo>/`.

Local run: `python3 -m http.server` then open http://localhost:8000
After changing files, bump `VERSION` in `sw.js` so installed apps update.
