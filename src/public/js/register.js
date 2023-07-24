const form = document.getElementById("registerForm");
const statusUsuario = document.getElementById("statusUsuario");

statusUsuario.style.display = "none";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validar los campos aquí antes de enviar la solicitud

  try {
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => (obj[key] = value));

    const response = await fetch("/api/sessions/register", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    console.log("status " + response.status);

    if (response.status == 200) {
      alert("Usuario creado con éxito");
      window.location.href = "/login";
    } else {
      // Mostrar el mensaje de usuario existente
      statusUsuario.style.display = "block";
      statusUsuario.textContent = "El usuario ya existe";
      // Enfocar en el primer input del formulario
      form.elements[0].focus();
    }
  } catch (error) {
    alert(
      "Ocurrió un error al enviar el formulario. Inténtalo nuevamente más tarde."
    );
  }
});
