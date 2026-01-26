console.log("login.js cargado ✅");

const form = document.getElementById("loginForm");
const errorP = document.getElementById("error");
const result = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    email: form.email.value,
    password: form.password.value
  };

  const res = await fetch("/api/sessions/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include"
  });

  const response = await res.json();

if (res.status !== 200) {
  errorP.innerText = response.error || "Error en login";
} else {
  window.location.href = "/";
}
});

document.getElementById("loadUser").addEventListener("click", async () => {
  const res = await fetch("/api/sessions/current", {
    credentials: "include"
  });

  const data = await res.json();

  if (res.status !== 200) {
    result.innerText = "Unauthorized";
  } else {
    result.innerText = JSON.stringify(data, null, 2);
  }
});