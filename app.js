const STORAGE_KEY = "novasphere_users";
const SESSION_KEY = "novasphere_session";
const DEFAULT_AVATAR = "assets/soldesoter_logo.png";
const MAX_AVATAR_FILE_SIZE_BYTES = 2 * 1024 * 1024;

const year = document.getElementById("year");
const profileToggle = document.getElementById("profile-toggle");
const profileDropdown = document.getElementById("profile-dropdown");
const profileName = document.getElementById("profile-name");
const profileTitleName = document.getElementById("profile-title-name");
const welcomeTitle = document.getElementById("welcome-title");
const logoutButton = document.getElementById("logout");
const avatarUpload = document.getElementById("avatar-upload");
const avatarFeedback = document.getElementById("avatar-feedback");
const profileAvatarPreview = document.getElementById("profile-avatar-preview");
const navAvatars = document.querySelectorAll(".user-nav__avatar");

if (year) {
  year.textContent = new Date().getFullYear();
}

const session = localStorage.getItem(SESSION_KEY);
const isAuthRequired = document.body.classList.contains("auth-required");

if (!session && isAuthRequired) {
  window.location.href = "index.html";
}

function readUsers() {
  const users = localStorage.getItem(STORAGE_KEY);
  return users ? JSON.parse(users) : [];
}

function saveAvatarWithGuard(updatedSession, updatedUsers) {
  const previousSession = localStorage.getItem(SESSION_KEY);
  const previousUsers = localStorage.getItem(STORAGE_KEY);

  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUsers));
    return true;
  } catch (error) {
    if (previousSession === null) {
      localStorage.removeItem(SESSION_KEY);
    } else {
      localStorage.setItem(SESSION_KEY, previousSession);
    }

    if (previousUsers === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, previousUsers);
    }

    return false;
  }
}

function updateAvatarOnScreen(avatar) {
  navAvatars.forEach((img) => {
    img.src = avatar;
  });

  if (profileAvatarPreview) {
    profileAvatarPreview.src = avatar;
  }
}

if (session) {
  const user = JSON.parse(session);
  const avatar = user.avatar || DEFAULT_AVATAR;

  if (profileName) {
    profileName.textContent = user.name;
  }

  if (profileTitleName) {
    profileTitleName.textContent = user.name;
  }

  if (welcomeTitle) {
    welcomeTitle.textContent = `Olá, ${user.name}!`;
  }

  updateAvatarOnScreen(avatar);
}

if (profileToggle && profileDropdown) {
  profileToggle.addEventListener("click", () => {
    profileDropdown.classList.toggle("is-open");
    const expanded = profileToggle.getAttribute("aria-expanded") === "true";
    profileToggle.setAttribute("aria-expanded", String(!expanded));
    profileDropdown.setAttribute("aria-hidden", String(expanded));
  });

  document.addEventListener("click", (event) => {
    if (!profileToggle.contains(event.target) && !profileDropdown.contains(event.target)) {
      profileDropdown.classList.remove("is-open");
      profileToggle.setAttribute("aria-expanded", "false");
      profileDropdown.setAttribute("aria-hidden", "true");
    }
  });
}

if (avatarUpload) {
  avatarUpload.addEventListener("change", () => {
    const [file] = avatarUpload.files;

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      avatarFeedback.textContent = "Selecione um arquivo de imagem válido.";
      avatarFeedback.className = "feedback feedback--error";
      return;
    }

    if (file.size > MAX_AVATAR_FILE_SIZE_BYTES) {
      avatarFeedback.textContent = "A imagem é muito grande. Envie uma foto de até 2 MB.";
      avatarFeedback.className = "feedback feedback--error";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const avatarDataUrl = reader.result;
      const currentSession = JSON.parse(localStorage.getItem(SESSION_KEY));

      if (!currentSession) {
        avatarFeedback.textContent = "Sua sessão expirou. Faça login novamente para alterar a foto.";
        avatarFeedback.className = "feedback feedback--error";
        return;
      }

      const updatedSession = { ...currentSession, avatar: avatarDataUrl };

      const users = readUsers();
      const updatedUsers = users.map((user) => {
        if (user.email === updatedSession.email) {
          return { ...user, avatar: avatarDataUrl };
        }

        return user;
      });

      const isAvatarSaved = saveAvatarWithGuard(updatedSession, updatedUsers);

      if (!isAvatarSaved) {
        avatarFeedback.textContent = "Não foi possível salvar a imagem. Tente uma foto menor.";
        avatarFeedback.className = "feedback feedback--error";
        return;
      }

      updateAvatarOnScreen(avatarDataUrl);
      avatarFeedback.textContent = "Foto de perfil atualizada com sucesso!";
      avatarFeedback.className = "feedback feedback--ok";
    };

    reader.readAsDataURL(file);
  });
}

if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
  });
}
