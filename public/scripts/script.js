var formSignin = document.querySelector('#signin')
var formSignup = document.querySelector('#signup')
var btnColor = document.querySelector('.btnColor')

document.querySelector('#btnSignin')
    .addEventListener('click', () => {
        formSignin.style.left = "25px"
        formSignup.style.left = "450px"
        btnColor.style.left = "0px"
})

document.querySelector('#btnSignup')
    .addEventListener('click', () => {
        formSignin.style.left = "-450px"
        formSignup.style.left = "25px"
        btnColor.style.left = "110px"
})

function backToLogin() {
    formSignin.style.left = "25px"
    formSignup.style.left = "450px"
    btnColor.style.left = "0px"
}
///////////////////////////////////////////

const inputEmail = document.getElementById("inputEmail");
const inputEmail2 = document.getElementById("inputEmail2");
const inputSenha = document.getElementById("inputSenha");
const inputSenha2 = document.getElementById("inputSenha2");
const inputSenha3 = document.getElementById("inputSenha3");
const buttonEnviar = document.getElementById("submit-enviar");
const inputNome = document.getElementById("inputNome");
const inputMatricula = document.getElementById("inputMatricula");
const buttonCadastrar = document.getElementById("submit-cadastrar");

buttonEnviar.addEventListener("click", async (event) => {
	event.preventDefault();

	let isValid = true;

	if (inputEmail.value === "") {
		alert("Por favor, preencha o campo de email.");
		isValid = false;
	} else {
		let body = new Object();
		body.email = inputEmail.value;
		body.password = inputSenha.value;
		await fetch('../v1/login', { 
			method: "POST",
			headers: {
				Accept: "*/*",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		})
			.then(async function (resp) {
				if (!resp.ok) throw new Error("Email ou senha inválidos.");
				const data = await resp.json();
				const token = data.response.token.split('Token:')[0];
				localStorage.setItem('authToken', token);
				alert("Login realizado com sucesso");
				
				return token;
			})
			.then((json) => alert("Login realizado com sucesso"))
			.then(() => document.location.href = "../v1/new-home")
			.catch((err) => alert("Falha ao realizar login: " + err));
	}
});

/////////////////////////////////////////



buttonCadastrar.addEventListener("click", async (event) => {
	event.preventDefault();

	const isValid = validateForm();

	if (isValid) {
		let formulario = new Object();
		formulario.userName = inputNome.value;
		formulario.registerID = inputMatricula.value;
		formulario.email = inputEmail2.value;
		formulario.password = inputSenha2.value;
		formulario.password = inputSenha3.value;
		formulario.workShops = [];
		console.log("Formulário enviado com sucesso!" + JSON.stringify({ ...formulario }));

		try {
			const result = await fetch("http://localhost:3000/user/signup", {
				method: "POST",
				headers: {
					Accept: "*/*",
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formulario),
			})
			if (result.status === 201) {
				alert("Cadastro realizado com sucesso!");
				backToLogin();
			} else {
				alert("Erro ao realizar cadastro." + result.status + " - " + result.statusText + " - " + result.body);
			}
		} catch (error) {
			alert("Erro ao realizar cadastro.", error);
		}
	}

	function validateForm() {
		let isValid = true;

		return isValid;
	}
});
