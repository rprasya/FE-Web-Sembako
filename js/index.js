const API_URL = "http://localhost:3000";

// memanggil data hanya di halaman yang di targetkan
document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.pathname.includes("product.html")) {
    await fetchAllProducts();
  } else if (window.location.pathname.includes("catalog.html")) {
    await setupCatalogPage();
  }
});

// Fetch api Products start
const fetchAllProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products`);
    const products = await response.json();
    console.log(products);

    // function convert int to price
    const formatRupiah = (price) =>
      new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(price);

    // menampilkan data di web
    const section = document.getElementById("product-list");
    products.forEach((product) => {
      const div = document.createElement("div");
      div.innerHTML = `
      <h3>${product.name}</h3>
      <img src="${product.imageUrl}">
      <p>Price: ${formatRupiah(product.price)}</p>
      <button><i class="fa-solid fa-basket-shopping"></i>Keranjang</button>
      `;
      section.appendChild(div);
    });
  } catch (error) {
    console.error("Error:", error);
  }
};
// Fetch api Products end

// Fetch api Catalog start
const setupCatalogPage = async () => {
  try {
    // 1. untuk mendapatkan list catalogs
    const response = await fetch(`${API_URL}/catalogs`);
    const catalogs = await response.json();

    // 2. menampilkan data catalog di list of option
    const selector = document.getElementById("catalog-select");
    catalogs.forEach((catalog) => {
      const anotherOption = document.createElement("option");
      anotherOption.value = catalog.id;
      anotherOption.textContent = catalog.name;
      selector.appendChild(anotherOption);
    });

    // 3. fetch product berdasarkan catalog yang dipilih dari option
    // 3.1 pilih catalognya
    document
      .getElementById("catalog-select")
      .addEventListener("change", async (event) => {
        console.log(event.target.value, "cek ada event apa aja");
        // 3.2 fetch si productnya
        const response = await fetch(
          `${API_URL}/products/${event.target.value}`
        );
        const productCatalogs = await response.json();

        // 3.3 function convert int to price
        const formatRupiah = (price) =>
          new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(price);

        // 3.4 display product dari catalog yang di pilih di option
        const section = document.getElementById("product-catalog");
        
        // untuk tampilan products di perbarui sesuai catalog yg di pilih tanpa mereset seluruh halaman
        section.innerHTML ="";

        productCatalogs.forEach((product) => {
          const div = document.createElement("div");
          div.innerHTML = `
          <h3>${product.name}</h3>
          <img src="${product.imageUrl}">
          <p>Price: ${formatRupiah(product.price)}</p>
          <button><i class="fa-solid fa-basket-shopping"></i>Keranjang</button>
          `;
          section.appendChild(div);
        });
      });
  } catch (error) {
    console.error("Error:", error);
  }
};
// Fetch api Catalog end
