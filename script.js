const STORAGE_KEY = "novasphere_users";
const SESSION_KEY = "novasphere_session";

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const loginButton = document.getElementById("header-login");
const registerButton = document.getElementById("header-register");
const feedback = document.getElementById("feedback");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (localStorage.getItem(SESSION_KEY)) {
  window.location.href = "home.html";
}

function readUsers() {
  const users = localStorage.getItem(STORAGE_KEY);
  return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function showFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.className = `feedback ${isError ? "feedback--error" : "feedback--ok"}`;
}

function showLoginForm() {
  registerForm.classList.add("hidden");
  loginForm.classList.remove("hidden");
  showFeedback("");
}

function showRegisterForm() {
  loginForm.classList.add("hidden");
  registerForm.classList.remove("hidden");
  showFeedback("");
}

loginButton.addEventListener("click", showLoginForm);
registerButton.addEventListener("click", showRegisterForm);

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = registerForm.name.value.trim();
  const email = registerForm.email.value.trim().toLowerCase();
  const password = registerForm.password.value;

  const users = readUsers();
  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    showFeedback("Esse e-mail já está cadastrado.", true);
    return;
  }

  users.push({ name, email, password, avatar: null, cover: null, level: 1, xp: 35, note: "" });
  saveUsers(users);
  showFeedback("Cadastro realizado com sucesso! Agora faça login.");
  registerForm.reset();
  showLoginForm();
  loginForm.email.value = email;
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const email = loginForm.email.value.trim().toLowerCase();
  const password = loginForm.password.value;
  const users = readUsers();

  const user = users.find((candidate) => candidate.email === email && candidate.password === password);

  if (!user) {
    showFeedback("E-mail ou senha inválidos.", true);
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify({
    name: user.name,
    email: user.email,
    avatar: user.avatar || "assets/soldesoter_logo.png",
    cover: user.cover || "assets/back.jpg",
    level: user.level || 1,
    xp: user.xp || 35,
    note: user.note || "",
  }));
  window.location.href = "home.html";
});
