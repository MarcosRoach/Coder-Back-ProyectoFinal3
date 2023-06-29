const socket = io();

// Socket.on
socket.on("getProducts", (products) => {
  //carritoID
  let carritoID;

  // Renderizar productos
  let productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";

  console.log(products);

  for (let product of products.docs) {
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
      carritoID = "6499e24bb8f7e7f21a31b28d";
      //id del producto
      addCartProduct(carritoID, product._id);
    });

    // Agregar elemento al DOM
    productsContainer.appendChild(productElement);
  }
});

function addCartProduct(carritoID, productId) {
  console.log("CarritoID: " + carritoID);
  console.log("ProductoID: " + productId);

  //Agregar producto al carrito
  try {
    socket.emit("addProductToCart", carritoID, productId);
    alert("Producto agregado al carrito");
  } catch (error) {
    alert("No se pudo agregar el producto al carrito");
  }
}
