# Omni Messenger Lord V4

**Developed by Omni**

A Manifest V2 browser extension for Quetta/Chromium-style Android browsers that targets Facebook and Messenger browser audio/video calls with an extreme **200000x** microphone boost profile, raw-mic constraint lock, expanded audio-processing bypass constraints, page-context WebRTC hooks, sender bitrate hints, and live DSP controls, sender watchdog recovery, and a reverb/keep-alive layer for running or late-joined calls.

## Supported call pages

- `https://facebook.com/*`
- `https://*.facebook.com/*`
- `https://messenger.com/*`
- `https://*.messenger.com/*`

## What V4 does

- Injects the Web Audio processing chain in the page context before Facebook/Messenger calls initialize.
- Requests raw microphone capture with echo cancellation, Chrome/WebRTC input-volume adjustment/auto-gain, noise suppression, Google/Mozilla audio processing flags, high-pass filtering, typing-noise detection, beamforming, mirroring, and multi-channel capture avoided through mono constraints.
- Sets mono, 48 kHz, 16-bit capture preferences for mobile browser compatibility; note that Chrome-only `chrome://flags` internals cannot be flipped directly by an extension, so V4.2 applies every equivalent JavaScript/media-constraint and SDP hint available to the page.
- Applies the default Lord V4 profile at roughly 200000x input gain (`106.0206 dB`) with compression, EQ, saturation, reverb, sustain, limiter, keep-alive floor, and faster sender refresh logic.
- Hints WebRTC audio senders and SDP toward 512 kbps Opus audio where the browser/service accepts it.
- Watches for muted/ended sender tracks, renegotiation, and late-join/running-call replacement so the processed mic track is reacquired and reattached automatically.

## Quetta / Android installation

1. Download or copy this folder to the Android device.
2. In Quetta Browser, open the extensions page and install this folder as an unpacked or signed extension, depending on the Quetta build.
3. Open Facebook Web or Messenger Web in the browser.
4. Reload the Facebook/Messenger tab after installing or updating the extension.
5. Open the extension popup and keep **Omni Messenger Lord V4** enabled before joining the browser audio/video call.

> Note: 200000x is intentionally extreme. If the remote side hears clipping, crackling, or silence from service-side limiting, lower Gain, Loudness Trim, Drive, or use Royal Clear.
