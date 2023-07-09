//Obtener Formulario de resetPass
const form = document.getElementById("resetPassForm");
//Obtener div de mensaje de estado
const statusResetPass = document.getElementById("statusResetPass");

//Ocultar el mensaje de error
statusResetPass.style.display = "none";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  //Obtener los datos del formulario
  const data = new FormData(form);
  //Convertir los datos a un objeto
  const obj = {};
  //Recorrer los datos del formulario
  data.forEach((value, key) => (obj[key] = value));

  //Enviar los datos al servidor
  fetch("/api/sessions/resetPass", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    //Verificar si el resultado es 200
    if (result.status === 200) {
      console.log("por aca");
      //Mostrar mensaje de exito con clase success
      statusResetPass.style.display = "block";
      statusResetPass.classList.remove("alert-danger");
      statusResetPass.classList.add("alert-success");
      statusResetPass.textContent = "Contraseña cambiada con exito";

      //Redireccionar a login
      window.location.replace("/login");
    } else {
      //tomar el valor del mensaje de error
      result.json().then((data) => {
        //Mostrar mensaje de error con clase error
        statusResetPass.style.display = "block";
        statusResetPass.classList.remove("alert-success");
        statusResetPass.classList.add("alert-danger");
        statusResetPass.textContent = data.message;

        //Borrar el mensaje de error despues de 3 segundos
        setTimeout(() => {
          statusResetPass.style.display = "none";
        }, 3000);

        //Limpia el formulario
        form.reset();
        //Ubicar el cursor en el primer input
        form[0].focus();
      });
    }
  });
});
