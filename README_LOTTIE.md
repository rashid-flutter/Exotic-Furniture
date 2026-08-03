This workspace uses lottie-web to render `assets/ai.json` for the chat FAB, header and initial bot message.

Files changed:
- index.html: added lottie-web script tag and containers (`fabLottie`, `headerLottie`, `initialBotIcon`).
- style.css: sizing for lottie containers.
- widget-chat.js: loads the lottie animation into the three containers and keeps them looping.

How it works:
- `lottie.loadAnimation({ path: 'assets/ai.json', container: element, renderer: 'svg', loop: true, autoplay: true })`

If you need the FAB animation to pause while the sheet is open, I can toggle `animFab.pause()` in `openWidget()` and `animFab.play()` in `closeWidget()`.
