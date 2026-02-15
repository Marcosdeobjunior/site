const SESSION_KEY = "novasphere_session";

const year = document.getElementById("year");
const profileToggle = document.getElementById("profile-toggle");
const profileDropdown = document.getElementById("profile-dropdown");
const profileName = document.getElementById("profile-name");
const profileTitleName = document.getElementById("profile-title-name");
const welcomeTitle = document.getElementById("welcome-title");
const logoutButton = document.getElementById("logout");

if (year) {
  year.textContent = new Date().getFullYear();
}

const session = localStorage.getItem(SESSION_KEY);
const isAuthRequired = document.body.classList.contains("auth-required");

if (!session && isAuthRequired) {
  window.location.href = "index.html";
}

if (session) {
  const user = JSON.parse(session);

  if (profileName) {
    profileName.textContent = user.name;
  }

  if (profileTitleName) {
    profileTitleName.textContent = user.name;
  }

  if (welcomeTitle) {
    welcomeTitle.textContent = `Olá, ${user.name}!`;
  }
}

if (profileToggle && profileDropdown) {
  profileToggle.addEventListener("click", () => {
    profileDropdown.classList.toggle("hidden");
    const expanded = profileToggle.getAttribute("aria-expanded") === "true";
    profileToggle.setAttribute("aria-expanded", String(!expanded));
    profileDropdown.setAttribute("aria-hidden", String(expanded));
  });

  document.addEventListener("click", (event) => {
    if (!profileToggle.contains(event.target) && !profileDropdown.contains(event.target)) {
      profileDropdown.classList.add("hidden");
      profileToggle.setAttribute("aria-expanded", "false");
      profileDropdown.setAttribute("aria-hidden", "true");
    }
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
  });
}
