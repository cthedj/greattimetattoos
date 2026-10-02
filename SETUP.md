# Great Time Tattoo

Static Cape Town tattoo studio website. No install or build step.
Open index.html for the site; serve it over HTTP for emulator testing.
Navigation: #home, #work, #book. All file references work under a subdirectory.

## Content
Edit site-config.js:
- whatsappNumber: international digits only, no + or spaces. Empty means bookings remain explicitly unavailable. No messages are sent automatically.
- gallery: add photos under assets/ and put their relative paths in src. Add accurate alt text and captions. Empty entries display labelled placeholders, never fake studio work.
- Colours are at the top of styles.css. The provisional palette is yellow, pink, near-black and white. Supplied reference images could not be opened in the build session, so this is not a claimed match.

## Pac-Man
The arcade uses real EmulatorJS emulation, not a custom imitation.
No copyrighted ROM is included. The default coming-soon state is intentional.
1. The supplied filename is Pac-Man (USA) (Namco).nes: prepare for the NES version, not the arcade cabinet version.
2. The session cannot download attachments, so its actual bytes have NOT been inspected or added to the repository.
3. Upload the file directly to the repository, preferably as roms/pacman.nes, or provide a stable authorised HTTPS host with CORS.
4. Set arcade.romUrl only after the file is present. The configured core is nes.
5. Test actual play before public launch. End-to-end gameplay remains unverified.
The loader checks the NES/iNES header before loading the NES emulator; arcade cores still require a ZIP signature.
Controls: click Start Pac-Man in the emulator, Enter starts, arrow keys move, Shift selects, Z/X are A/B. EmulatorJS provides touch/gamepad controls and its control settings.
Use Exit game to unload the emulator and stop sound; leaving Home also unloads it.
Tetris and Space Invaders are labelled for later; they are not implemented.
Emulator files load on demand from the official stable CDN. A network connection is required.
Sources:
- https://emulatorjs.org/docs/systems/nes-famicom/
- https://emulatorjs.org/docs/options/
- https://emulatorjs.org/docs/cdn/

## Hosting
The repository contains the complete static site. No secrets or server needed.
GitHub Pages is not enabled in the repository as of this build:
Settings > Pages > Build and deployment > Deploy from a branch > main > /(root) > Save.
Use the actual URL shown by GitHub after deployment completes.
Alternatively deploy these static files with the existing host.
The previous chatgpt.site publication has not been replaced; its source connection was unavailable.

## Before public launch
- Add studio photos and confirm the palette against the supplied references.
- Add the WhatsApp number.
- Supply and test the authorised ROM if the arcade is to be available.
- Check the deployed site on mobile and desktop.
Do not add address, hours, artist names, social handles or testimonials until confirmed.
