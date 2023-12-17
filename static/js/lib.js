
export const updateTable = (products, skipIds=false, addToCart=undefined) => {
  const table = document.getElementById("table");
  table.innerHTML = "";
  // make table first row
  const keys = Object.keys(products[0]);
  const upperRow = document.createElement("tr");
  for (let pks of keys) {
    if (skipIds && pks === "_id") continue; // saltarse _ids
    if (pks === "thumbnail") continue; // saltarse las thumbnails
    const td = document.createElement("td");
    td.innerHTML = `<b>${pks}</b>`;
    upperRow.appendChild(td);
  }
  if (addToCart) {
    const td = document.createElement("td");
    td.innerHTML = `<b>cart</b>`;
    upperRow.appendChild(td);
  }
  table.appendChild(upperRow);

  // delcaracion de funcion de utilidad para updateTable
  const fillRow = (tr, prodIndex) => {
    for (let k of keys) {
      if (skipIds && k === "_id") continue; // saltarse _ids
      if (k === "thumbnail") continue; // saltarse las thumbnails
      const td = document.createElement("td");
      td.innerHTML = products[prodIndex][k];
      tr.appendChild(td);
    }
    if (addToCart) {
      const td = document.createElement("td");
      const btn = document.createElement("button");
      btn.addEventListener("click", () => addToCart(products[prodIndex]._id))
      td.appendChild(btn)
      tr.appendChild(td);
    }
  };

  // instanciacion de las filas
  for (let cont = 0; cont < products.length; cont++) {
    const tr = document.createElement("tr");
    fillRow(tr, cont);
    table.appendChild(tr);
  }
};
