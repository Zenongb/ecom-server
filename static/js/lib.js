export const updateTable = products => {
  const table = document.querySelector("table");
  table.innerHTML = "";
  // make table first row
  const keys = Object.keys(products[0]);
  const upperRow = document.createElement("tr");
  const firstTd = document.createElement("td");
  firstTd.innerHTML = "&nbsp;";
  upperRow.appendChild(firstTd);
  for (let pks of keys) {
    if (pks === "thumbnail") continue; // saltarse las thumbnails
    const td = document.createElement("td");
    td.innerHTML = `<b>${pks}</b>`;
    upperRow.appendChild(td);
  }
  table.appendChild(upperRow);

  // delcaracion de funcion de utilidad para updateTable
  const fillRow = (tr, prodIndex) => {
    const firstTd = document.createElement("td");
    firstTd.innerHTML = prodIndex;
    tr.appendChild(firstTd);
    for (let k of keys) {
      if (k === "thumbnail") continue; // saltarse las thumbnails
      const td = document.createElement("td");
      td.innerHTML = products[prodIndex][k];
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
