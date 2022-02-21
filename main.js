"use strict";

const openModal = () =>
	document.getElementById("modal").classList.add("active");

const closeModal = () => {
	clearFields();
	document.getElementById("modal").classList.remove("active");
};

/* const tempClient = {
    nome: 'Nicolas',
    email: 'teste@teste.com',
    phone: '1234-5678',
    cidade: 'Maua'
} */

// CONEXÃO COM LOCALSTORAGE
const getLocalStorage = () =>
	JSON.parse(localStorage.getItem("db_client")) ?? [];
const setLocalStorage = (dbClient) =>
	localStorage.setItem("db_client", JSON.stringify(dbClient));

// CREATE
const createClient = (client) => {
	const dbClient = getLocalStorage();
	dbClient.push(client);
	setLocalStorage(dbClient);
};

// READ
const readClient = () => getLocalStorage();

// UPDATE
const updateClient = (index, client) => {
	const dbClient = readClient();
	dbClient[index] = client;
	setLocalStorage(dbClient);
};

// DELETE
const deleteClient = (index) => {
	const dbClient = readClient();
	dbClient.splice(index, 1);
	setLocalStorage(dbClient);
};

// INTERAÇÃO COM LAYOUT
const isValidFields = () => {
	return document.getElementById("form").reportValidity();
};

const clearFields = () => {
	const fields = document.querySelectorAll(".modal-field");
	fields.forEach((field) => (field.value = ""));
};

const saveClient = () => {
	if (isValidFields()) {
		const client = {
			nome: document.getElementById("name").value,
			email: document.getElementById("email").value,
			phone: document.getElementById("phone").value,
			cidade: document.getElementById("city").value,
		};
		const index = document.getElementById("name").dataset.action;
		if (index == "new") {
			createClient(client);
			updateTable();
			closeModal();
		} else {
			updateClient(index, client);
			updateTable();
			closeModal();
		}
	}
};

const createRow = (client, index) => {
	const newRow = document.createElement("tr");
	newRow.innerHTML = `
			<td>${client.nome}</td>
			<td>${client.email}</td>
			<td>${client.phone}</td>
			<td>${client.cidade}</td>
			<td>
					<button type="button" class="button green" id="edit-${index}">Editar</button>
					<button type="button" class="button red" id="delete-${index}">Excluir</button>
			</td>
	`;
	document.querySelector("#tableClient>tbody").appendChild(newRow);
};

const clearTable = () => {
	const rows = document.querySelectorAll("#tableClient>tbody tr");
	rows.forEach((row) => row.parentNode.removeChild(row));
};

const updateTable = () => {
	const dbClient = readClient();
	clearTable();
	dbClient.forEach(createRow);
};

const fillFields = (client) => {
	document.getElementById("name").value = client.nome;
	document.getElementById("email").value = client.email;
	document.getElementById("phone").value = client.phone;
	document.getElementById("city").value = client.cidade;
	document.getElementById("name").dataset.action = client.action;
};

const editClient = (index) => {
	const client = readClient()[index];
	client.action = index;
	fillFields(client);
	openModal();
};

const editDelete = (event) => {
	if (event.target.type == "button") {
		const [action, index] = event.target.id.split("-");
		console.log(index);
		if (action == "edit") {
			editClient(index);
		} else {
			const client = readClient()[index];
			const response = confirm(
				`Deseja realmente excluir o cliente ${client.nome}`
			);
			if (response) {
				deleteClient(index);
				updateTable();
			}
		}
	}
};

// INTERFACE
updateTable();

// EVENTOS
document
	.getElementById("cadastrarCliente")
	.addEventListener("click", openModal);

document.getElementById("modalClose").addEventListener("click", closeModal);

document.getElementById("save").addEventListener("click", saveClient);

document
	.querySelector("#tableClient>tbody")
	.addEventListener("click", editDelete);
