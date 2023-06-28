const socket = io();

// Socket.on
socket.on("getProducts", (products) => {
  // Renderizar productos
  let productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";

  let productos = products;
  console.log(productos);

  for (let product of products.docs) {
    // Crear elemento
    let productElement = document.createElement("div");
    productElement.innerHTML = `
      <p> Title: ${product.title} </p>
      <p> Description: ${product.description} </p>
      <p> Code: ${product.code} </p>
      <p> Category: ${product.category} </p>
      <p> Price: ${product.price} </p>
      <button id=${product.id}> Agregar a Carrito </button>
    `;

    // Estilos
    productElement.setAttribute(
      "style",
      "border: 1px solid #000; border-radius: 1rem; padding: 1rem; margin-bottom: 1rem"
    );

    // Agregar evento al botón
    let addButton = productElement.querySelector("button");
    addButton.addEventListener("click", () => {
      addCartProduct(product.id);
    });

    // Agregar elemento al DOM
    productsContainer.appendChild(productElement);
  }
});

function addCartProduct(productId, quantity = 1) {
  // Socket.emit para agregar producto al carrito
  socket.emit("add-product", productId);
  console.log("Producto agregado al carrito:", productId);
}
