//Obtener los elementos del DOM
const form = document.getElementById("loginForm");
const statusLogin = document.getElementById("statusLogin");
const email = document.getElementById("email");
const password = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");

//Ocultar el mensaje de error
statusLogin.style.display = "none";

//Login Btn disabled por defecto
loginBtn.disabled = true;
//Login Btn enabled si los campos estan completos
password.addEventListener("input", () => {
  if (email.value && password.value) {
    loginBtn.disabled = false;
  } else {
    loginBtn.disabled = true;
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("/api/sessions/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 200) {
      console.log("Usuario logueado con exito Frontend");
      //Redireccionar si el usuario es correcto
      window.location.replace("/products");
    } else {
      //Codigo para mostrar el mensaje de usuario/pass Incorecto
      statusLogin.style.display = "block";
      statusLogin.textContent = "Usuario/Contraseña incorrecto";
      //Borrar el mensaje de error despues de 3 segundos
      setTimeout(() => {
        statusLogin.style.display = "none";
      }, 3000);
    }
  });
});
