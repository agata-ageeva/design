// Bulletin board case study: interactive sketch of the board and the privacy check.
(() => {
  const board = document.getElementById("board");
  if (!board) return;

  // Filters: one type at a time, like the shipped board
  const chips = document.querySelectorAll(".chip");
  const empty = document.getElementById("board-empty");
  chips.forEach((chip) =>
    chip.addEventListener("click", () => {
      const type = chip.dataset.filter;
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      let shown = 0;
      board.querySelectorAll(".post").forEach((post) => {
        post.hidden = type !== "all" && post.dataset.type !== type;
        if (!post.hidden) shown++;
      });
      empty.hidden = shown > 0;
    })
  );

  // Colour coding on and off, to compare how easy the board is to skim
  const toggle = document.getElementById("color-toggle");
  toggle.addEventListener("change", () => board.classList.toggle("is-plain", !toggle.checked));

  // Privacy check: offer a private message when a comment contains contact details
  const form = document.getElementById("comment-form");
  const input = document.getElementById("comment-input");
  const comments = document.getElementById("comments");
  const prompt = document.getElementById("privacy-prompt");
  const promptText = document.getElementById("privacy-text");

  const EMAIL = /[^\s@]+@[^\s@]+\.[a-z]{2,}/i;
  const PHONE = /\+?\d[\d\s\-().]{7,}\d/;
  const detect = (text) => {
    if (EMAIL.test(text)) return "an email address";
    const m = text.match(PHONE);
    if (m && m[0].replace(/\D/g, "").length >= 9) return "a phone number";
    return null;
  };

  const addComment = (text, isPrivate) => {
    const li = document.createElement("li");
    const who = document.createElement("span");
    who.className = "comment-author";
    who.textContent = "You";
    li.append(who, " ", isPrivate ? "Sent Henk a private message." : text);
    if (isPrivate) li.classList.add("is-private");
    comments.append(li);
    input.value = "";
    prompt.hidden = true;
  };

  let pending = "";
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const found = detect(text);
    if (!found) return addComment(text, false);
    pending = text;
    promptText.textContent = `This looks like ${found}. Comments are public, so anyone can see it. Send it to Henk as a private message instead?`;
    prompt.hidden = false;
  });
  document.getElementById("send-private").addEventListener("click", () => addComment(pending, true));
  document.getElementById("post-anyway").addEventListener("click", () => addComment(pending, false));
  input.addEventListener("input", () => { prompt.hidden = true; });
})();
