const SESSION_KEY = "novasphere_session";

const welcomeTitle = document.getElementById("welcome-title");
const profileName = document.getElementById("profile-name");
const profileLevel = document.getElementById("profile-level");
const profileToggle = document.getElementById("profile-toggle");
const profileDropdown = document.getElementById("profile-dropdown");
const logoutButton = document.getElementById("logout");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const session = localStorage.getItem(SESSION_KEY);

if (!session) {
  window.location.href = "index.html";
} else {
  const user = JSON.parse(session);
  welcomeTitle.textContent = `Olá, ${user.name}!`;
  profileName.textContent = user.name;
  profileLevel.textContent = "1";
}

profileToggle.addEventListener("click", () => {
  profileDropdown.classList.toggle("hidden");
  const expanded = profileToggle.getAttribute("aria-expanded") === "true";
  profileToggle.setAttribute("aria-expanded", String(!expanded));
  profileDropdown.setAttribute("aria-hidden", String(expanded));
});

logoutButton.addEventListener("click", () => {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "index.html";
});
