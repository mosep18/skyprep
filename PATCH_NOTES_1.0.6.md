# SkyPrep 1.0.6 – Android persistence fix

## Changes

- Added an IndexedDB snapshot as a second persistent copy of user progress and the active quiz session.
- Kept synchronous localStorage writes so an answer is committed immediately, then queued the IndexedDB copy.
- Restored the newest valid snapshot before the app renders its home screen.
- Added a revision timestamp to stored state so localStorage and IndexedDB copies can be compared safely.
- Requested persistent browser storage where supported by Chrome.
- Added saves on page freeze, page hide, and visibility changes; timer checkpoints now save on elapsed five-second boundaries.
- Prevented malformed saved sessions from breaking startup.
- Fixed backup import so an in-progress session is restored instead of silently discarded.
- Bumped the Service Worker cache version to 1.0.6 so the installed PWA can download the updated files.

## Deploy

1. Replace the repository files with the contents of this ZIP while keeping the folder structure.
2. Commit and push the changes to the GitHub Pages branch.
3. Open the installed SkyPrep app while connected to the internet, let it load, then close and reopen it once to let the updated Service Worker take control.
4. Do not uninstall the PWA or clear Chrome site data during the update; that can remove the existing local data.

The first launch migrates existing localStorage data into IndexedDB. Data already erased by Android/Chrome before this update cannot be reconstructed by the app.
