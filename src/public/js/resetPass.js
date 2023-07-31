//Obtener Formulario de resetPass
const form = document.getElementById("resetPassForm");
//Obtener div de mensaje de estado
const statusResetPass = document.getElementById("statusResetPass");

//Ocultar el mensaje de error
statusResetPass.style.display = "none";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const obj = Object.fromEntries(data.entries());

  console.log("Datos Enviados");
  console.log(obj);

  try {
    // Enviar la solicitud
    const res = await fetch("/api/sessions/resetPass", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Resp");
    console.log(res);

    if (res.ok) {
      //Mostrar mensaje de exito con clase success
      statusResetPass.style.display = "block";
      statusResetPass.classList.remove("alert-danger");
      statusResetPass.classList.add("alert-success");
      statusResetPass.textContent = "Contraseña cambiada con exito";

      //Redireccionar a login
      window.location.replace("/login");
    } else {
      //Mostrar mensaje de error con clase error
      statusResetPass.style.display = "block";
      statusResetPass.classList.remove("alert-success");
      statusResetPass.classList.add("alert-danger");
      statusResetPass.textContent = "Error al cambiar la contraseña";

      //Borrar el mensaje de error despues de 3 segundos
      setTimeout(() => {
        statusResetPass.style.display = "none";
      }, 3000);

      //Limpia el formulario
      form.reset();
      //Ubicar el cursor en el primer input
      form[0].focus();
    }
  } catch (error) {
    console.log("Error " + error);
    alert(
      "Ocurrió un error al enviar el formulario. Inténtalo nuevamente más tarde."
    );
  }
});
