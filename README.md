# Quiz Command

A host desk for five quiz-show rounds, a separate audience window, manual team scoring and a JARVIS-style voice/typed command assistant. No package dependencies or API keys.

## Run

Requires Node.js 24.5+ (tested with Node 24.19). The start command respects inherited HTTPS proxy settings.

```sh
npm start
```

Serves on port 3000 (override with `PORT`). Open the host desk in a browser. Use **Audience view** to open a synced window on the same browser/origin, move it to a projector and enter full screen. Keep the host desk private. The audience screen shows selected answers and reveals, not host tools. It is a presentation view, not an access-control boundary.

```sh
npm test
```

## Prepare your show

- Question bank: add/edit questions for Multiple Choice, Top 10 Tenables, Quickfire, Higher or Lower, and Riddles. There are eleven demo questions to try first.
- Teams & scores: change names, add/remove teams, and manually set totals. On the host desk, +/− changes five points and **+ points** accepts custom positive or negative awards. The assistant never changes scores.
- For Tenables, enter exactly ten answer lines. Add aliases after `|`, such as `United States | USA | America`. Matching ignores case and punctuation; use aliases for alternate names.
- Export the question bank before the show. Everything saves in this browser’s local storage; private browsing, clearing storage or changing origins can remove that data. Import accepts exported JSON; append or replace is explicit. Export includes answers, so keep it private.
- Timer is per question; the default is 30 seconds, configurable up to 60 minutes. Quickfire uses the same next-question and timer controls. Scores and advancement remain host-controlled.

## JARVIS commands

Microphone recognition works best in Chrome or Edge on HTTPS or localhost, after the user grants permission. It uses the browser speech service, which may need internet access. Speech synthesis uses the browser’s installed voices. Built-in commands use a local command interpreter that checks the bank you supply. You can optionally connect a remote AI to interpret more natural phrasing (see below). Neither mode is a general chatbot or factual answer judge. All commands can be typed and all show operations have button controls.

Say **Jarvis** before voice commands (optional when typing):

- Reveal the correct answer / hide the answer
- Next question / read the question
- Start / pause / reset the timer
- Choose A / B / C / D
- Check Canada / is Canada on the table?
- Reveal the whole table
- Higher / lower
- Switch to multiple choice / tenable / quickfire / higher or lower / riddles
- Stop listening

Keyboard shortcuts on the show desk: Space reveals/hides, right arrow advances, T starts/pauses the clock. Shortcuts are ignored inside inputs and dialogs.

## Show-day checklist

Use the same browser and origin as preparation. Export a backup. Test your microphone and spoken responses in your actual Chrome/Edge session. Keep typed controls handy if the speech service fails. Open the audience window, move it to your display, and test a reveal and score update. Prevent your computer from sleeping and keep the host window off the audience display.

## Optional natural-language AI

Set `QUIZ_AI_API_KEY` securely in your server environment and restart the server to enable AI interpretation of phrases outside the built-in commands. An existing `OPENAI_API_KEY` is also recognised. Never commit a key, enter it in the browser, or include it in exported questions. The server calls the OpenAI API at `api.openai.com` with `gpt-4.1-mini` (override using `QUIZ_AI_MODEL`); network access to that hostname and API credits are required. The UI shows connection configuration status in Show settings. No credentials were provided or configured during development, so remote AI calls have not been validated.

Only the host command and current round name go to the model, not your question bank. The model can select a fixed set of show actions and cannot assign points or edit questions. Commands fall back to clear error messages when the service fails; standard controls and built-in commands continue working. Do not expose the host server to untrusted users: this is a single-host show tool without authentication.
