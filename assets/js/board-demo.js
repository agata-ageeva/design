// Bulletin board case study: a working sketch of CrowdBuilding's Prikbord.
// Example posts only. Filters, location, post view with replies and the
// privacy check, and post creation all run locally in the page.
(() => {
  const pb = document.getElementById("pb");
  if (!pb) return;

  const AVATAR = { looking: "#ffe2ee", offering: "#ffe4a1", question: "#dbdce7", update: "#dceeb0" };
  const posts = [
    { id: 1, author: "Lotte", place: "Utrecht", title: "Our group has two homes left", body: "Hi 👋\nWe are twelve households building a cooperative in Utrecht.\nLooking for two more households to join us!", tags: ["looking"], cats: ["members"], likes: 12, replies: [["Marijke", "How big are the homes? I would love to know more."], ["Ahmed", "Following this one!"]] },
    { id: 2, author: "Henk", place: "Deventer", title: "Plot of land near Deventer, open to a group", body: "I own two hectares on the edge of town and would love to see it become homes for people who want to live together.", tags: ["offering"], likes: 21, replies: [["Sanne", "This sounds wonderful. Is it close to a train station?"]] },
    { id: 3, author: "Ahmed", place: "Rotterdam", title: "What is the best way to get a plot in Rotterdam?", body: "We have a group of eight households. Do we go to the municipality first, or look for a developer?", tags: ["question"], cats: ["question"], likes: 7, replies: [["Lotte", "Start with the municipality. They keep a list of plots for collective projects."]] },
    { id: 4, author: "Groningen Samen", place: "Groningen", title: "We signed the land agreement!", body: "After two years of meetings, the land is ours. Thank you to everyone on this board who helped with advice.", tags: ["update"], cats: ["update"], likes: 34, replies: [] },
    { id: 5, author: "Marijke", place: "Utrecht", title: "Retired teacher looking for a cooperative", body: "Happy to join a group early and help with the plans. A small garden would be lovely.", tags: ["looking"], cats: ["house"], likes: 9, replies: [] },
    { id: 6, author: "Jan", place: "Drenthe", title: "Offering a farmhouse for a group", body: "An old farmhouse with outbuildings, room for six to eight homes. Does anyone know how the permits work for something like this?", tags: ["offering", "question"], cats: ["question"], likes: 15, replies: [["Henk", "Ask the province first, they decide on farm conversions."]] },
  ];
  let nextId = 100;
  let filter = null;

  const board = document.getElementById("pb-board");
  const empty = document.getElementById("pb-empty");
  const location = document.getElementById("pb-location");
  const initials = (name) => name.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const tagLabel = (t) => t[0].toUpperCase() + t.slice(1);
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };
  const icon = (name) => {
    const tpl = document.querySelector(name === "heart" ? "#pd-like svg" : ".pb-replies svg");
    return tpl.cloneNode(true);
  };

  const renderTags = (wrap, tags) => {
    wrap.replaceChildren(...tags.map((t) => {
      const s = el("span", "pb-tag", tagLabel(t));
      s.dataset.tag = t;
      return s;
    }));
  };

  const head = (p) => {
    const h = el("span", "pb-card-head");
    const av = el("span", "pb-avatar", initials(p.author));
    av.style.background = AVATAR[p.tags[0]] || "#f4f0ea";
    const who = el("span", "pb-who");
    const name = el("span", "pb-name");
    const b = el("b", null, p.author);
    name.append(b, ` posted in ${p.place}`);
    who.append(name, el("span", "pb-date", p.date || "9 July 2025"));
    h.append(av, who);
    return h;
  };

  const card = (p) => {
    const c = el("button", "pb-card");
    c.type = "button";
    c.dataset.id = p.id;
    if (p.tags[0]) c.dataset.type = p.tags[0];
    const tags = el("span", "pb-tags");
    renderTags(tags, p.tags);
    const meta = el("span", "pb-meta");
    const likes = el("span", "pb-likes-count");
    likes.append(icon("heart"), String(p.likes));
    const rep = el("span", "pb-replies");
    rep.append(icon("chat"), `${p.replies.length} ${p.replies.length === 1 ? "reply" : "replies"}`);
    meta.append(likes, rep);
    c.append(head(p), el("span", "pb-card-title", p.title), el("span", "pb-body", p.body));
    if (p.tags.length) c.append(tags);
    c.append(meta);
    c.addEventListener("click", () => openPost(p, c));
    return c;
  };

  const render = () => {
    const loc = location.value;
    const shown = posts.filter((p) =>
      (!filter || (filter === "mine" ? p.mine : (p.cats || []).includes(filter))) && (!loc || p.place === loc));
    board.replaceChildren(...shown.map(card));
    empty.hidden = shown.length > 0;
  };

  // Filters: one at a time, click again to clear
  document.querySelectorAll(".pb-pill").forEach((pill) =>
    pill.addEventListener("click", () => {
      filter = filter === pill.dataset.filter ? null : pill.dataset.filter;
      document.querySelectorAll(".pb-pill").forEach((p) => p.setAttribute("aria-pressed", String(p.dataset.filter === filter)));
      render();
    })
  );
  location.addEventListener("change", render);

  // Colour coding on and off, to compare how easy the board is to skim
  const toggle = document.getElementById("color-toggle");
  toggle.addEventListener("change", () => pb.classList.toggle("is-plain", !toggle.checked));

  // Dialogs close on the close button, Cancel, or a click on the backdrop
  document.querySelectorAll(".pb-dialog").forEach((d) => {
    d.addEventListener("click", (e) => {
      if (e.target === d || e.target.closest("[data-close]")) d.close();
    });
  });

  // Privacy check: contact details in public text get a nudge
  const EMAIL = /[^\s@]+@[^\s@]+\.[a-z]{2,}/i;
  const PHONE = /\+?\d[\d\s\-().]{7,}\d/;
  const detect = (text) => {
    if (EMAIL.test(text)) return "an email address";
    const m = text.match(PHONE);
    if (m && m[0].replace(/\D/g, "").length >= 9) return "a phone number";
    return null;
  };

  // Post view
  const dialog = document.getElementById("post-dialog");
  const thread = document.getElementById("pd-thread");
  const replyForm = document.getElementById("pd-reply");
  const replyInput = document.getElementById("pd-input");
  const privacy = document.getElementById("pd-privacy");
  const likeBtn = document.getElementById("pd-like");
  let current = null;
  let pending = "";

  const renderThread = () => {
    thread.replaceChildren(...current.replies.map(([who, text, isPrivate]) => {
      const li = el("li");
      if (isPrivate) li.classList.add("is-private");
      li.append(el("b", null, who), text);
      return li;
    }));
  };

  function openPost(p, fromCard) {
    current = p;
    const bg = getComputedStyle(fromCard).getPropertyValue("--card-bg");
    dialog.style.setProperty("--card-bg", bg || "#fff");
    const av = document.getElementById("pd-avatar");
    av.textContent = initials(p.author);
    av.style.background = AVATAR[p.tags[0]] || "#f4f0ea";
    const name = document.getElementById("pd-name");
    name.replaceChildren(el("b", null, p.author), ` posted in ${p.place}`);
    document.getElementById("pd-title").textContent = p.title;
    document.getElementById("pd-body").textContent = p.body;
    renderTags(document.getElementById("pd-tags"), p.tags);
    document.getElementById("pd-likes").textContent = p.likes;
    likeBtn.setAttribute("aria-pressed", String(!!p.liked));
    replyInput.placeholder = `Reply to ${p.author}`;
    replyInput.value = p.mine ? "" : "Very interested! Call me on 06 1234 5678";
    privacy.hidden = true;
    renderThread();
    dialog.showModal();
    replyInput.focus();
  }

  likeBtn.addEventListener("click", () => {
    current.liked = !current.liked;
    current.likes += current.liked ? 1 : -1;
    likeBtn.setAttribute("aria-pressed", String(current.liked));
    document.getElementById("pd-likes").textContent = current.likes;
    render();
  });

  const addReply = (text, isPrivate) => {
    current.replies.push(["You", isPrivate ? `sent ${current.author} a private message.` : text, isPrivate]);
    replyInput.value = "";
    privacy.hidden = true;
    renderThread();
    render();
  };
  replyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = replyInput.value.trim();
    if (!text) return;
    const found = detect(text);
    if (!found) return addReply(text, false);
    pending = text;
    document.getElementById("pd-privacy-text").textContent =
      `This looks like ${found}. Replies are public, so anyone can see it. Send it to ${current.author} as a private message instead?`;
    privacy.hidden = false;
  });
  document.getElementById("pd-private").addEventListener("click", () => addReply(pending, true));
  document.getElementById("pd-public").addEventListener("click", () => addReply(pending, false));
  replyInput.addEventListener("input", () => { privacy.hidden = true; });

  // Composer
  const composer = document.getElementById("composer");
  const form = document.getElementById("cp-form");
  const titleIn = document.getElementById("cp-title-input");
  const bodyIn = document.getElementById("cp-body");
  const count = document.getElementById("cp-count");
  const error = document.getElementById("cp-error");
  const cpPrivacy = document.getElementById("cp-privacy");
  const tagBtns = document.querySelectorAll("#cp-tags .pb-tag");
  let allowContact = false;

  document.getElementById("open-composer").addEventListener("click", () => {
    form.reset();
    tagBtns.forEach((b) => b.setAttribute("aria-pressed", "false"));
    count.textContent = "Max 800 characters";
    error.hidden = true;
    cpPrivacy.hidden = true;
    allowContact = false;
    composer.showModal();
    titleIn.focus();
  });
  tagBtns.forEach((b) => b.addEventListener("click", () => b.setAttribute("aria-pressed", String(b.getAttribute("aria-pressed") !== "true"))));
  bodyIn.addEventListener("input", () => {
    count.textContent = bodyIn.value.length ? `${800 - bodyIn.value.length} characters left` : "Max 800 characters";
    error.hidden = true;
    cpPrivacy.hidden = true;
    allowContact = false;
  });
  document.getElementById("cp-edit").addEventListener("click", () => { cpPrivacy.hidden = true; bodyIn.focus(); });
  document.getElementById("cp-anyway").addEventListener("click", () => { allowContact = true; form.requestSubmit(); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const body = bodyIn.value.trim();
    if (!body) { error.hidden = false; bodyIn.focus(); return; }
    const found = detect(`${titleIn.value} ${body}`);
    if (found && !allowContact) {
      document.getElementById("cp-privacy-text").textContent =
        `Your post contains ${found}. Posts are public. People can always reach you with a private message, so you can leave it out.`;
      cpPrivacy.hidden = false;
      return;
    }
    const tags = [...tagBtns].filter((b) => b.getAttribute("aria-pressed") === "true").map((b) => b.dataset.tag);
    const title = titleIn.value.trim() || body.split("\n")[0].slice(0, 60);
    const cats = tags.filter((t) => t === "question" || t === "update");
    posts.unshift({ id: nextId++, author: "You", place: document.getElementById("cp-location").value, title, body, tags, cats, likes: 0, replies: [], mine: true, date: "Just now" });
    composer.close();
    filter = null;
    location.value = "";
    document.querySelectorAll(".pb-pill").forEach((p) => p.setAttribute("aria-pressed", "false"));
    render();
    board.firstElementChild?.focus();
  });

  render();
})();
