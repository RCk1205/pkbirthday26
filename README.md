# The Navodaya Archive — 09

A warm, cinematic JNV-inspired birthday experience for Priyanshu Sharma, made by Rahul for 8 November 2026.

## Run locally

Open `index.html` in a browser, or run a local server from this folder:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploy free with GitHub Pages

1. Create a GitHub repository named `navodaya-archive-09` (or use your existing repository).
2. Upload the contents of this folder to the repository root. Keep `index.html`, `style.css`, `script.js`, `assets/`, and `media/` together.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select **main** and **/(root)**, then save.

## Music

The header contains a slim 38px audio control with only a play/pause button and the track name. The provided MP3 is stored locally at `media/jaane-kyun.mp3`; no YouTube or Spotify player is used. Audio starts only after the visitor presses play.

### Replace the song later

To use a different audio file, upload it into the `media/` folder in your repository and name it exactly `jaane-kyun.mp3` (replace the existing file). The page already points to `media/jaane-kyun.mp3`, so no code changes are needed. MP3 is recommended.

## Images

The two JNV campus backgrounds are warm, enhanced treatments inspired by the school photos supplied for this project. The six personal photographs remain in `assets/` as processed copies; the original uploads are not modified.

## Technical notes

- Static HTML, CSS and vanilla JavaScript; no framework, build step, API key, database or paid hosting required.
- The music file is included in `media/`, so it plays from the deployed site without an external music service.
- Google Fonts require an internet connection; local fallback fonts are configured.
- The GitHub Pages site is public to anyone with its URL.
