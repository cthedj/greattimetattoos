(() => {
  "use strict";
  const config = window.GREAT_TIME || {};
  const gallery = Array.isArray(config.gallery) ? config.gallery : [];
  const pages = ["home", "work", "book"];
  const $ = (id) => document.getElementById(id);
  let lightboxIndex = 0;
  let activePhotos = [];
  let previouslyFocused;
  let currentPage = null;

  function safeAsset(value) {
    if (typeof value !== "string" || !value.trim()) return "";
    try {
      const url = new URL(value, location.href);
      return ["http:", "https:", "file:"].includes(url.protocol) ? url.href : "";
    } catch { return ""; }
  }

  function stopGame() {
    $("game-frame").removeAttribute("src");
    $("game-frame").hidden = true;
    $("game-waiting").hidden = false;
    $("close-game").hidden = true;
  }
  function route() {
    const requested = location.hash.slice(1);
    const page = pages.includes(requested) ? requested : "home";
    if (page === currentPage) return;
    if (currentPage === "home") stopGame();
    pages.forEach(id => { $(id).hidden = id !== page; });
    document.querySelectorAll("[data-nav]").forEach(link => {
      if (link.dataset.nav === page) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    document.title = (page === "home" ? "" : page === "work" ? "The Work — " : "Bookings — ") + "Great Time Tattoo — Cape Town";
    if (currentPage !== null) {
      window.scrollTo({top:0, behavior:"instant"});
      $("main").focus({preventScroll:true});
    }
    currentPage = page;
  }

  function placeholder(index) {
    const block = document.createElement("div");
    block.className = "placeholder";
    block.setAttribute("aria-label", "Gallery photo coming soon");
    const top = document.createElement("div");
    top.className = "placeholder-top";
    const label = document.createElement("span");
    label.textContent = "THE GALLERY";
    const number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");
    top.append(label, number);
    const centre = document.createElement("div");
    centre.className = "placeholder-center";
    centre.innerHTML = "GREAT<br>TIME.";
    centre.setAttribute("aria-hidden", "true");
    const bottom = document.createElement("div");
    bottom.className = "placeholder-bottom";
    bottom.textContent = "PHOTO COMING SOON";
    block.append(top, centre, bottom);
    return block;
  }
  function showPhoto(index) {
    lightboxIndex = index;
    const item = activePhotos[index];
    if (!item) return;
    $("lightbox-image").src = safeAsset(item.src);
    $("lightbox-image").alt = item.alt || item.caption || "Tattoo photograph";
    $("lightbox-caption").textContent = item.caption || "";
    $("photo-count").textContent = (index + 1) + " / " + activePhotos.length;
    $("previous-photo").disabled = index === 0;
    $("next-photo").disabled = index === activePhotos.length - 1;
  }
  function renderGallery(target, items) {
    items.forEach((item, index) => {
      const figure = document.createElement("figure");
      figure.className = "gallery-item";
      const caption = document.createElement("figcaption");
      const src = safeAsset(item.src);
      if (src) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "photo-button";
        button.setAttribute("aria-label", "Enlarge " + (item.caption || "tattoo photograph"));
        const image = document.createElement("img");
        image.src = src;
        image.alt = item.alt || item.caption || "Tattoo photograph";
        image.loading = "lazy";
        image.width = 600; image.height = 800;
        image.addEventListener("error", () => {
          button.replaceWith(placeholder(index));
          caption.textContent = "Photo unavailable";
        }, {once:true});
        button.append(image);
        button.addEventListener("click", () => {
          previouslyFocused = button;
          showPhoto(activePhotos.indexOf(item));
          $("lightbox").showModal();
        });
        figure.append(button);
        caption.textContent = item.caption || "";
      } else {
        figure.append(placeholder(index));
        caption.textContent = "Gallery preview / " + String(index + 1).padStart(2, "0");
      }
      figure.append(caption);
      target.append(figure);
    });
  }
  activePhotos = gallery.filter(item => safeAsset(item.src));
  if (activePhotos.length) $("gallery-intro").textContent = "A closer look at the work. Select a photograph to explore.";
  renderGallery($("featured-gallery"), gallery.slice(0,3));
  renderGallery($("full-gallery"), gallery);
  $("previous-photo").addEventListener("click", () => showPhoto(Math.max(0, lightboxIndex - 1)));
  $("next-photo").addEventListener("click", () => showPhoto(Math.min(activePhotos.length - 1, lightboxIndex + 1)));
  document.querySelector(".lightbox-close").addEventListener("click", () => $("lightbox").close());
  $("lightbox").addEventListener("close", () => previouslyFocused?.focus());
  $("lightbox").addEventListener("click", event => {
    if (event.target !== $("lightbox")) return;
    const rect = $("lightbox").getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) $("lightbox").close();
  });
  $("lightbox").addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") { event.preventDefault(); showPhoto(Math.max(0,lightboxIndex - 1)); }
    if (event.key === "ArrowRight") { event.preventDefault(); showPhoto(Math.min(activePhotos.length - 1,lightboxIndex + 1)); }
  });

  const phone = String(config.whatsappNumber || "").trim();
  const hasWhatsApp = /^[1-9]\d{7,14}$/.test(phone);
  if (hasWhatsApp) {
    $("whatsapp-link").href = "https://wa.me/" + phone + "?text=" + encodeURIComponent(config.whatsappMessage || "Hi! I'd like to book a tattoo.");
    $("whatsapp-link").hidden = false;
    $("booking-unavailable").hidden = true;
    $("booking-submit").disabled = false;
  }
  try {
    const instagram = new URL(config.instagramUrl);
    if (instagram.protocol === "https:" && ["instagram.com", "www.instagram.com"].includes(instagram.hostname) && instagram.pathname.length > 1) {
      $("instagram-link").href = instagram.href;
      $("instagram-link").hidden = false;
    }
  } catch { /* Keep unconfigured social links hidden. */ }

  const requiredFields = ["booking-name", "booking-idea", "booking-placement"];
  requiredFields.forEach(id => $(id).addEventListener("input", () => $(id).setCustomValidity("")));
  $("booking-form").addEventListener("submit", event => {
    event.preventDefault();
    if (!hasWhatsApp) return;
    requiredFields.forEach(id => $(id).setCustomValidity($(id).value.trim() ? "" : "Please fill in this field."));
    if (!$("booking-form").reportValidity()) return;
    const lines = [
      "Hi Great Time Tattoo! I'd like to enquire about a tattoo.",
      "",
      "Name: " + $("booking-name").value.trim(),
      "Idea: " + $("booking-idea").value.trim(),
      "Placement: " + $("booking-placement").value.trim(),
      "Approximate size: " + ($("booking-size").value.trim() || "To discuss"),
      "Preferred date: " + ($("booking-date").value || "Flexible")
    ];
    location.assign("https://wa.me/" + phone + "?text=" + encodeURIComponent(lines.join("\n")));
  });

  const games = Array.isArray(config.arcade?.games) ? config.arcade.games : [
    { id:"pacman", gameName:"Pac-Man", ...config.arcade }
  ];
  let selectedGame = games[0];
  const gameButtons = document.querySelectorAll("[data-game]");
  function selectGame(id) {
    const next = games.find(game => game.id === id);
    if (!next) return;
    stopGame();
    selectedGame = next;
    const available = !!safeAsset(next.romUrl);
    $("arcade-title").textContent = next.gameName.toUpperCase();
    $("arcade-number").textContent = String(games.indexOf(next) + 1).padStart(2,"0") + " / 03";
    $("arcade-status").textContent = available ? "READY WHEN YOU ARE." : "COMING SOON.";
    $("arcade-note").textContent = available ? "Launch the arcade to play." : next.gameName + " is coming soon.";
    $("launch-game").textContent = "Play " + next.gameName;
    $("launch-game").hidden = !available;
    $("game-frame").title = next.gameName + " emulator";
    $("game-controls").textContent = next.id === "tetris"
      ? "Enter to start · Arrow keys to move · Z / X to rotate · Touch controls on mobile"
      : "Enter to start · Arrow keys to move · Touch controls on mobile";
    gameButtons.forEach(button => {
      button.classList.toggle("current", button.dataset.game === next.id);
      button.setAttribute("aria-pressed", String(button.dataset.game === next.id));
    });
  }
  gameButtons.forEach(button => button.addEventListener("click", () => selectGame(button.dataset.game)));
  if (selectedGame) selectGame(selectedGame.id);
  $("launch-game").addEventListener("click", () => {
    if (!selectedGame || !safeAsset(selectedGame.romUrl)) return;
    $("game-frame").src = "arcade.html?game=" + encodeURIComponent(selectedGame.id) + "&v=4";
    $("game-frame").hidden = false;
    $("game-waiting").hidden = true;
    $("close-game").hidden = false;
    $("game-frame").focus();
  });
  $("close-game").addEventListener("click", () => { stopGame(); $("launch-game").focus(); });
  $("year").textContent = new Date().getFullYear();
  window.addEventListener("hashchange", route);
  route();
})();
