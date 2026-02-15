const SESSION_KEY = "novasphere_session";

const welcomeTitle = document.getElementById("welcome-title");
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
}

logoutButton.addEventListener("click", () => {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "index.html";
});
