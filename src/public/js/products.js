const socket = io();

let sessionCartID;

//Obtener datos de session mongo desde cookie
(async () => {
  try {
    const result = await fetch("/api/sessions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (result.status === 401) {
      let sessionContainer = document.getElementById("session-container");
      sessionContainer.innerHTML = "";

      let sessionElement = document.createElement("div");
      sessionElement.innerHTML = `
        <p> No hay usuario logueado </p>
        <button id="login"> Iniciar sesión </button>
      `;

      let loginButton = sessionElement.querySelector("#login");
      loginButton.addEventListener("click", () => {
        window.location.href = "/login";
      });

      sessionContainer.appendChild(sessionElement);
    } else {
      let session = await result.json();
      sessionCartID = session.cartID;

      let sessionContainer = document.getElementById("session-container");
      sessionContainer.innerHTML = "";

      let sessionElement = document.createElement("div");
      sessionElement.innerHTML = `
        <p> Nombre: ${session.name} </p>
        <p> Email: ${session.email} </p>
        <p> Edad: ${session.age} </p>
        <p> Rol: ${session.role} </p>
        <p> Carrito: ${session.cartID} </p>
        <button id="logout"> Cerrar sesión </button>
      `;

      let logoutButton = sessionElement.querySelector("#logout");
      logoutButton.addEventListener("click", async () => {
        await fetch("/api/sessions/logout", {});
        window.location.href = "/login";
      });

      sessionContainer.appendChild(sessionElement);
    }
  } catch (error) {
    console.error({ error: "No se pudo obtener la session" });
  }
})();

// Socket.on
socket.on("products", (products) => {
  //carritoID
  let carritoID;

  // Renderizar productos
  let productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";

  console.log(products);

  for (let product of products.products) {
    // Crear elemento
    let productElement = document.createElement("div");
    productElement.innerHTML = `
      <p> Title: ${product.title} </p>
      <p> Description: ${product.description} </p>
      <p> Code: ${product.code} </p>
      <p> Category: ${product.category} </p>
      <p> Price: ${product.price} </p>
      <button id=${product._id}> Agregar a Carrito </button>
    `;

    // Estilos
    productElement.setAttribute(
      "style",
      "border: 1px solid #000; border-radius: 1rem; padding: 1rem; margin-bottom: 1rem"
    );

    // Agregar evento al botón
    let addButton = productElement.querySelector("button");
    addButton.addEventListener("click", () => {
      // id del carrito
      carritoID = sessionCartID;
      //id del producto
      addCartProduct(carritoID, product._id);
    });

    // Agregar elemento al DOM
    productsContainer.appendChild(productElement);
  }
});

//Agregar producto al carrito
// function addCartProduct(carritoID, productId) {
//   console.log("CarritoID: " + carritoID);
//   console.log("ProductoID: " + productId);

//   //Agregar producto al carrito
//   try {
//     socket.emit("addProductToCart", carritoID, productId);
//     alert("Producto agregado al carrito");
//   } catch (error) {
//     alert("No se pudo agregar el producto al carrito");
//   }
// }
