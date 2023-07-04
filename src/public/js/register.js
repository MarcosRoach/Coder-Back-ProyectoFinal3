const form = document.getElementById("registerForm");
const statusUsuario = document.getElementById("statusUsuario");

statusUsuario.style.display = "none";

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("/api/sessions/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((json) => {
      if (json.status === "success") {
        alert("Usuario creado con exito");
        window.location.href = "/login";
      } else {
        // Código para mostrar el mensaje de usuario existente
        statusUsuario.style.display = "block";
        statusUsuario.textContent = "El usuario ya existe";
        //borrar el mensaje de error despues de 3 segundos
        setTimeout(() => {
          statusUsuario.style.display = "none";
        }, 3000);
        //Borrar inputs del formulario
        form.reset();
        //Seleccionar el primer input del formulario
        form.elements[0].focus();
      }
    });
});
