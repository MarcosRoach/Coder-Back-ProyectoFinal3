const form = document.getElementById("registerForm");
const statusUsuario = document.getElementById("statusUsuario");

statusUsuario.style.display = "none";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Validar los campos aquí antes de enviar la solicitud

  const data = new FormData(form);
  const obj = Object.fromEntries(data.entries());

  console.log("Datos Enviados");
  console.log(obj);

  try {
    // Enviar la solicitud
    const res = await fetch("/api/sessions/register", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Resp");
    console.log(res);

    //Si res es ok, redirigir a login
    if (res.ok) {
      alert("Usuario creado con éxito");
      window.location.href = "/login";
    } else {
      // Mostrar el mensaje de usuario existente
      statusUsuario.style.display = "block";
      statusUsuario.textContent = "El usuario ya existe";
      form.reset();
      form.elements[0].focus();

      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        statusUsuario.style.display = "none";
      }, 3000); // 3000 milisegundos = 3 segundos
    }
  } catch (error) {
    alert(
      "Ocurrió un error al enviar el formulario. Inténtalo nuevamente más tarde."
    );
  }
});
