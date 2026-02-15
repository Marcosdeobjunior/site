const STORAGE_KEY = "novasphere_users";
const SESSION_KEY = "novasphere_session";
const DEFAULT_AVATAR = "assets/soldesoter_logo.png";
const DEFAULT_COVER = "assets/back.jpg";

const year = document.getElementById("year");
const profileToggle = document.getElementById("profile-toggle");
const profileDropdown = document.getElementById("profile-dropdown");
const profileName = document.getElementById("profile-name");
const profileTitleName = document.getElementById("profile-title-name");
const profileLevelText = document.getElementById("profile-level-text");
const profileXpFill = document.getElementById("profile-xp-fill");
const welcomeTitle = document.getElementById("welcome-title");
const logoutButton = document.getElementById("logout");
const avatarUpload = document.getElementById("avatar-upload");
const coverUpload = document.getElementById("cover-upload");
const avatarFeedback = document.getElementById("avatar-feedback");
const coverFeedback = document.getElementById("cover-feedback");
const profileAvatarPreview = document.getElementById("profile-avatar-preview");
const profileCoverPreview = document.getElementById("profile-cover-preview");
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

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function updateProfileImagesOnScreen(avatar, cover) {
  navAvatars.forEach((img) => {
    img.src = avatar;
  });

  if (profileAvatarPreview) {
    profileAvatarPreview.src = avatar;
  }

  if (profileCoverPreview) {
    profileCoverPreview.src = cover;
  }
}

function showFeedback(element, message, isError = false) {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.className = `feedback ${isError ? "feedback--error" : "feedback--ok"}`;
}

function saveSessionAndUsers(updatedSession) {
  if (!updatedSession || !updatedSession.email) {
    return;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));

  const users = readUsers();
  const updatedUsers = users.map((user) => {
    if (user.email === updatedSession.email) {
      return {
        ...user,
        avatar: updatedSession.avatar,
        cover: updatedSession.cover,
        level: updatedSession.level,
        xp: updatedSession.xp,
      };
    }

    return user;
  });

  saveUsers(updatedUsers);
}

if (session) {
  const user = JSON.parse(session);
  const level = Number(user.level) || 1;
  const xp = Number(user.xp) || 35;
  const avatar = user.avatar || DEFAULT_AVATAR;
  const cover = user.cover || DEFAULT_COVER;

  if (profileName) {
    profileName.textContent = user.name;
  }

  if (profileTitleName) {
    profileTitleName.textContent = user.name;
  }

  if (profileLevelText) {
    profileLevelText.textContent = `Nível ${level}`;
  }

  if (profileXpFill) {
    profileXpFill.style.width = `${Math.max(0, Math.min(100, xp))}%`;
  }

  if (welcomeTitle) {
    welcomeTitle.textContent = `Olá, ${user.name}!`;
  }

  updateProfileImagesOnScreen(avatar, cover);
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
      showFeedback(avatarFeedback, "Selecione um arquivo de imagem válido.", true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const avatarDataUrl = reader.result;
      const currentSession = JSON.parse(localStorage.getItem(SESSION_KEY));

      if (!currentSession) {
        showFeedback(avatarFeedback, "Sessão inválida. Faça login novamente.", true);
        return;
      }

      const updatedSession = {
        ...currentSession,
        avatar: avatarDataUrl,
        cover: currentSession.cover || DEFAULT_COVER,
      };

      saveSessionAndUsers(updatedSession);
      updateProfileImagesOnScreen(updatedSession.avatar, updatedSession.cover);
      showFeedback(avatarFeedback, "Foto de perfil atualizada com sucesso!");
    };

    reader.readAsDataURL(file);
  });
}

if (coverUpload) {
  coverUpload.addEventListener("change", () => {
    const [file] = coverUpload.files;

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      showFeedback(coverFeedback, "Selecione um arquivo de imagem válido.", true);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const coverDataUrl = reader.result;
      const currentSession = JSON.parse(localStorage.getItem(SESSION_KEY));

      if (!currentSession) {
        showFeedback(coverFeedback, "Sessão inválida. Faça login novamente.", true);
        return;
      }

      const updatedSession = {
        ...currentSession,
        cover: coverDataUrl,
        avatar: currentSession.avatar || DEFAULT_AVATAR,
      };

      saveSessionAndUsers(updatedSession);
      updateProfileImagesOnScreen(updatedSession.avatar, updatedSession.cover);
      showFeedback(coverFeedback, "Foto de capa atualizada com sucesso!");
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
