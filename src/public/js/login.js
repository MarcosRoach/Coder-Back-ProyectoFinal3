const form = document.getElementById("loginForm");
const statusLogin = document.getElementById("statusLogin");

//Ocultar el mensaje de error
statusLogin.style.display = "none";

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
      //Crear la session
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
