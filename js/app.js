//* Variables y selectores
const form = document.querySelector("#agregar-gasto");
const expenseList = document.querySelector("#gastos ul");

//* Eventos

eventListener();
function eventListener() {
  document.addEventListener("DOMContentLoaded", askBudget);

  form.addEventListener("submit", addBill);
}

//* Clases
class Budget {
  constructor(budget) {
    this.budget = Number(budget);
    this.remaining = Number(budget);
    this.bills = [];
  }

  newBill(bill) {
    this.bills = [...this.bills, bill];
    this.calculateRemaining();
  }

  calculateRemaining() {
    const spent = this.bills.reduce( (total, bill) => total + bill.amount, 0 );
    this.remaining = this.budget - spent;    
  }

  deleteBill(id) {
    this.bills = this.bills.filter( bill => bill.id !== id);
    this.calculateRemaining();
  }

}

class UI {
  insertBudget(amount) {
    // Extrayendo valores
    const { budget, remaining } = amount;

    // Agregando al HTML
    document.querySelector("#total").textContent = budget;
    document.querySelector("#restante").textContent = remaining;
  }

  sprintAlert(message, type) {
    // Crear el div
    const divAlert = document.createElement("DIV");
    divAlert.classList.add("text-center", "alert", "message");

    if (type === "error") {
      divAlert.classList.add("alert-danger");
    } else {
      divAlert.classList.add("alert-success");
    }

    // Mensaje de error
    divAlert.textContent = message;

    const messageAlert = document.querySelector(".message");

    // Insertar en el HTML
    if (messageAlert) {
      messageAlert.remove();
      document.querySelector(".primario").insertBefore(divAlert, form);
    } else {
      document.querySelector(".primario").insertBefore(divAlert, form);
    }

    // Quitar la alert
    setTimeout(() => {
      divAlert.remove();
    }, 3000);
  }

  showBills(bills) {
    // limpiar el HTML
    this.cleanHTML();

    // Iterar sobre los gasto
    bills.forEach((bill) => {
      const { amount, name, id } = bill;

      // Crear un LI
      const newBill = document.createElement("LI");
      newBill.className =
        "list-group-item d-flex justify-content-between align-items-center";
      newBill.dataset.id = id;

      // Agregar el HTML del gasto
      newBill.innerHTML = `
                ${name} <span class="badge badge-primary badge-pill"> $${amount} </span>
            `;

      // Boton para borrar el gasto
      const btnDelete = document.createElement("BUTTON");
      btnDelete.classList.add("btn", "btn-danger", "borrar-gasto");
      btnDelete.innerHTML = "Borrar &times";
      btnDelete.onclick = () => {
        deleteBill(id);
      }
      newBill.appendChild(btnDelete);


      // Agregar el HTML
      expenseList.appendChild(newBill);
    });
  }

  updateRemaining(remaining) {
    document.querySelector("#restante").textContent = remaining;
  }

  checkBudget(budgetObj) {
    const { budget, remaining } = budgetObj;

    const remainingDiv = document.querySelector(".restante");

    // Comprobar 25%
    if( ( budget / 4 ) > remaining ) {
        remainingDiv.classList.remove("alert-success", "alert-warning");
        remainingDiv.classList.add("alert-danger");
    } else if ( ( budget / 2 ) > remaining ) {
        remainingDiv.classList.remove("alert-success");
        remainingDiv.classList.add("alert-warning");
    } else {
        remainingDiv.classList.remove("alert-danger", "alert-warning");
        remainingDiv.classList.add("alert-success");
    }


    // Si el total es 0 o menor
    if(remaining <= 0) {
        this.sprintAlert("El presupuesto se ha agotado", "error");

        form.querySelector("button[type='submit']").disabled = true;
    } else {
        form.querySelector("button[type='submit']").disabled = false;
    }
  }

    cleanHTML() {
    while (expenseList.firstChild) {
      expenseList.removeChild(expenseList.firstChild);
    }
  }
}

// Instanciar
let budget;
const ui = new UI();

//* Funciones

function askBudget() {
  const budgetUser = prompt("¿Cual es tu presupuesto?");
  Number(budgetUser);

  if (
    budgetUser === "" ||
    budgetUser === null ||
    isNaN(budgetUser) ||
    budgetUser <= 0
  ) {
    window.location.reload();
  }

  // Presupuesto valido
  budget = new Budget(budgetUser);

  ui.insertBudget(budget);
}

// Agregar gasto
function addBill(e) {
  e.preventDefault();

  // Leer los nombres del formulario
  const name = document.querySelector("#gasto").value.trim();
  const amount = Number(document.querySelector("#cantidad").value.trim());

  if (name === "" || amount === "") {
    ui.sprintAlert("Ambos campos son obligatorios", "error");
    return;
  } else if (amount <= 0 || isNaN(amount)) {
    ui.sprintAlert("Cantidad no valida", "error");
    return;
  }

  // Generar un objeto con el gasto
  const bill = { name, amount, id: Date.now() };

  // Añade el nuevo gasto
  budget.newBill(bill);

  // Mensaje de todo bien
  ui.sprintAlert("Gasto agregado correctamente");

  // Imprimir los gastos
  const { bills, remaining } = budget;
  ui.showBills(bills);

  ui.updateRemaining(remaining);

  ui.checkBudget(budget);

  // Reinicia el formulario
  form.reset();
}


function deleteBill(id) {
    // Elimina los gastos del arreglo gastos
    budget.deleteBill(id);

    // Elimina los gastos del HTML
    const { bills, remaining } = budget;
    ui.showBills(bills);

    ui.updateRemaining(remaining);

    ui.checkBudget(budget);
}