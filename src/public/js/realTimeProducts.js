const socket = io();

//SESSION
let sessionCartID;
// Obtener datos de Session mongoDB con fetch api/sessions
const getSession = async () => {
  try {
    const response = await fetch("/api/sessions");
    const session = await response.json();
    //Guardar el id del carrito de la sesión
    sessionCartID = session.cartID;
    return session; // Devolver los datos de la sesión
  } catch (error) {
    console.error("Error al obtener la sesión:", error);
  }
};
// Renderizar Session
const renderSession = async () => {
  // Obtener datos de la sesión
  const session = await getSession();
  //Obtener objetos del DOM para renderizar la sesión
  let sessionContainer = document.getElementById("session-data");
  let sessionElement = document.createElement("div");

  //Renderizar la sesión
  sessionElement.innerHTML = `
  <h4 class="small-text">Bienvenido, ${session.name}</h4>
  <p class="small-text"><strong>Usuario: </strong>${session.email} |
    <strong>Rol: ${session.role}</strong></p>
  <p class="small-text"><strong>Carrito: ${session.cartID} </strong> </p>
  <button class="btn btn-danger small-btn" id="logout">Cerrar Sesión</button>
  `;
  let logoutButton = sessionElement.querySelector("#logout");
  logoutButton.addEventListener("click", async () => {
    await fetch("/api/sessions/logout", {});
    window.location.href = "/login";
  });

  sessionContainer.appendChild(sessionElement);
};
//Ejecutar renderSession
renderSession();

//PRODUCTOS
//Obtener productos con Socket.io al conectarse
const getProducts = async () => {
  try {
    socket.on("products", (products) => {
      renderProducts(products);
    });
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
};

//Renderizar productos
const renderProducts = (products) => {
  //Obtener objetos del DOM para renderizar los productos
  let productsContainer = document.getElementById("products-container");
  productsContainer.innerHTML = "";
  products.docs.forEach((product) => {
    let productElement = document.createElement("div");
    productElement.classList.add("product");
    productElement.innerHTML = `
    <div class="product-img">
      <img src="public/img/No-Image-Placeholder.svg" alt="${product.title}" />
    </div>
    <div class="product-info">
      <h4 class="product-title">${product.title}</h4>
      <p class="product-description">$ ${product.description}</p>
      <p class="product-category">Category: ${product.category}</p>
      <p class="product-stock">Price u$d: ${product.price}</p>
      <button class="btn btn-primary small-btn" id="addProduct${product._id}">Agregar al carrito</button>
    </div>
    `;
    //Agregar evento al botón agregar al carrito
    let addProductButton = productElement.querySelector(
      `#addProduct${product._id}`
    );
    addProductButton.addEventListener("click", async () => {
      await addProduct(sessionCartID, product._id);
    });
    productsContainer.appendChild(productElement);
  });

  //Renderizar elementos de paginado
  let paginateContainer = document.getElementById("paginate-container");
  paginateContainer.innerHTML = "";

  //Renderizar botón de página anterior
  let prevPageElement = document.createElement("button");
  prevPageElement.classList.add("btn", "btn-primary", "small-btn", "col-2");
  prevPageElement.innerText = "Página anterior";
  prevPageElement.addEventListener("click", async () => {
    const nroPage = products.prevPage;
    await getProductsPage(nroPage);
  });
  paginateContainer.appendChild(prevPageElement);
  if (!products.prevPage) {
    prevPageElement.disabled = true;
  }

  //Renderizar número de página actual
  let currentPageElement = document.createElement("p");
  currentPageElement.classList.add("small-text", "text-center", "col-4");
  currentPageElement.innerText = `Página ${products.page} de ${products.totalPages}`;
  paginateContainer.appendChild(currentPageElement);

  //Renderizar botón de página siguiente
  let nextPageElement = document.createElement("button");
  nextPageElement.classList.add("btn", "btn-primary", "small-btn", "col-2");
  nextPageElement.innerText = "Página siguiente";
  nextPageElement.addEventListener("click", async () => {
    const nroPage = products.nextPage;
    await getProductsPage(nroPage);
  });
  paginateContainer.appendChild(nextPageElement);
  if (!products.nextPage) {
    nextPageElement.disabled = true;
  }
};
//Ejecutar getProducts
getProducts();

//FILTROS
//Obtener del DOM los filtros
const filtersForm = document.getElementById("filters-form");
//Agregar evento al submit del formulario de filtros
filtersForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  //Obtener valores de los filtros
  const filters = {
    //Si el Limit es 0, asignar 10, si no, asignar el valor del input
    limit: filtersForm.limit.value === "0" ? 10 : filtersForm.limit.value,
    //Si el Sort es Ascendente, asignar 1, si es Descendente, asignar -1
    sort: filtersForm.sort.value === "asc" ? -1 : 1,
    filtro: "category",
    filtroVal: filtersForm.category.value,
  };

  //Emitir busqueda de productos filtrados al servidor
  socket.emit("productsFilter", filters);
});

//Obtener Foiltros Cargados del DOM
const getFilters = async () => {
  const filters = {
    //Si el Limit es 0, asignar 10, si no, asignar el valor del input
    limit: filtersForm.limit.value === "" ? 10 : filtersForm.limit.value,
    //Si el Sort es Ascendente, asignar 1, si es Descendente, asignar -1
    sort: filtersForm.sort.value === "asc" ? -1 : 1,
    ////si filtroVal es = a "Todos", asignar null, si no, asignar "category"
    filtro: filtersForm.category.value === "Todos" ? null : "category",
    //si filtroVal es = a "Todos", asignar null, si no, asignar el valor del input
    filtroVal:
      filtersForm.category.value === "Todos"
        ? null
        : filtersForm.category.value,
  };
  return filters;
};
//Obtener productos de pagina específica
const getProductsPage = async (nroPage) => {
  const filters = await getFilters();
  filters.page = nroPage; //Asignar el número de página a los filtros
  try {
    //Emitir busqueda de productos filtrados al servidor
    socket.emit("productsFilter", filters);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
  }
};
//Obtener productos filtrados del servidor
socket.on("productsFilters", (prosuctsFilters) => {
  renderProducts(prosuctsFilters);
});

//CARRITO
//Agregar producto al carrito
const addProduct = async (cid, pid) => {
  try {
    const response = await fetch(`/api/carts/${cid}/product/${pid}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    //Sweet Alert
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Producto agregado al carrito",
      showConfirmButton: false,
      timer: 1500,
    });
  } catch (error) {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "No se pudo agregar el producto al carrito",
      showConfirmButton: false,
      timer: 1500,
    });
  }
};
