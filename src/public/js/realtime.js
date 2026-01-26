const socket = io();

// 📩 Recibir lista actualizada de productos
socket.on("updateProducts", (products) => {
  const list = document.getElementById("productList");
  list.innerHTML = "";

  products.forEach((p) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${p.title}</strong> - $${p.price}
      <button onclick="deleteProduct('${p.id}')">🗑️ Eliminar</button>
    `;
    list.appendChild(li);
  });
});

// 📤 Enviar nuevo producto al servidor
document.getElementById("productForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const productData = Object.fromEntries(formData.entries());
  socket.emit("addProduct", productData);
  e.target.reset();
});

// 🗑️ Eliminar producto
function deleteProduct(id) {
  socket.emit("deleteProduct", id);
}

