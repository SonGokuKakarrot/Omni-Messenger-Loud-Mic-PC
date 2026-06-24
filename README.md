# Omni Messenger Loud Mic V4 PC

**Developed by Omni**

A Chrome desktop extension that makes your microphone louder on Facebook and Messenger web calls while avoiding the browser lag/glitch behavior caused by unsafe unlimited gain loops.

## Supported call pages

- `https://facebook.com/*`
- `https://*.facebook.com/*`
- `https://messenger.com/*`
- `https://*.messenger.com/*`
- `https://instagram.com/*`
- `https://*.instagram.com/*`

## Install on Windows Chrome

1. Download or clone this repository.
2. Open Chrome and go to `chrome://extensions`.
3. Turn on **Developer mode**.
4. Click **Load unpacked**.
5. Select the folder that contains `manifest.json`.
6. Open or reload Facebook/Messenger Web before joining the call.

## Best loudness settings

Use **Loud Mic V4** first. It is tuned to be very loud while staying stable on desktop Chrome.

Increase carefully if you need more:

- **Gain dB / multiplier**
- **Loudness Trim**
- **Boost ceiling**
- **Sustain Max Gain**
- **Presence EQ** and **Treble EQ**

Lower these if callers hear crackle or distortion:

- **Saturation Drive**
- **Limiter Ceiling**
- **Gain dB / multiplier**
- **Loudness Trim**

Keep these enabled for calls:

- **Anti-duck sustain lock**
- **Raw mic constraint lock**
- **Mic activity keep-alive**

## Reliability notes

- The extension uses Manifest V3 for current Chrome desktop support.
- The injected WebRTC hook is installed once per page instead of repeatedly watching the whole DOM, which reduces CPU usage and screen/browser glitches.
- The audio graph uses a hard boost ceiling, compressor, limiter, and sender recovery so calls stay loud without runaway gain.
- No remote network calls, webhooks, account token reads, or tracking are included.
