export function getUserRole() {
  return localStorage.getItem("userRole");
}

export function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

export function logout() {
  localStorage.removeItem("userRole");
  localStorage.removeItem("isLoggedIn");
  window.location.href = "/login";
}
