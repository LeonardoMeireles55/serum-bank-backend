document.addEventListener('DOMContentLoaded', () => {
  const formSignin = document.querySelector('#signin');
  const formSignup = document.querySelector('#signup');
  const btnColor = document.querySelector('.btnColor');
  const btnSignin = document.querySelector('#btnSignin');
  const btnSignup = document.querySelector('#btnSignup');

  const inputEmail = document.getElementById('inputEmail');
  const inputSenha = document.getElementById('inputSenha');
  const buttonEnviar = document.getElementById('submit-enviar'); // Sign In button

  const inputNome = document.getElementById('inputNome');
  const inputMatricula = document.getElementById('inputMatricula');
  const inputEmail2 = document.getElementById('inputEmail2'); // Sign Up email
  const inputSenha2 = document.getElementById('inputSenha2'); // Sign Up password
  const inputSenha3 = document.getElementById('inputSenha3'); // Sign Up confirm password
  const buttonCadastrar = document.getElementById('submit-cadastrar'); // Sign Up button
  const passwordHelpBlock = document.getElementById('passwordHelpBlock');
  const termsCheckbox = document.getElementById('terms'); // Use ID selector

  const inputTelefone = document.getElementById('inputTelefone');
  const inputCargo = document.getElementById('inputCargo');

  // --- Form Switching Logic ---
  function showSigninForm() {
    if (formSignin && formSignup && btnColor && btnSignin && btnSignup) {
      formSignin.style.left = '20px'; // Match CSS
      formSignup.style.left = 'calc(100% + 20px)'; // Match CSS
      btnColor.style.left = '0px';
      btnSignin.classList.add('active');
      btnSignup.classList.remove('active');

      formSignin.classList.add('active-form');
      formSignup.classList.remove('active-form');
    }
  }

  function showSignupForm() {
    if (formSignin && formSignup && btnColor && btnSignin && btnSignup) {
      formSignin.style.left = '-100%'; // Move far left
      formSignup.style.left = '20px'; // Match CSS
      btnColor.style.left = '50%'; // Move color slider
      btnSignin.classList.remove('active');
      btnSignup.classList.add('active');

      formSignin.classList.remove('active-form');
      formSignup.classList.add('active-form');
    }
  }

  if (btnSignin) {
    btnSignin.addEventListener('click', showSigninForm);
  }

  if (btnSignup) {
    btnSignup.addEventListener('click', showSignupForm);
  }

  // Function to switch back to login (used after successful signup)
  function backToLogin() {
    showSigninForm();
    if (formSignup) formSignup.reset();
  }

  // --- Input Validation Helpers ---
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function validatePassword(password) {
    const re = /^[A-Za-z0-9]{8,20}$/;
    return re.test(password);
  }

  // --- Sign In Logic ---
  async function handleSignIn(event) {
    event.preventDefault();

    const email = inputEmail.value.trim();
    const password = inputSenha.value;

    if (!email || !validateEmail(email)) {
      alert('Por favor, insira um email válido.');
      inputEmail.focus();
      return;
    }
    if (!password) {
      alert('Por favor, preencha o campo de senha.');
      inputSenha.focus();
      return;
    }

    buttonEnviar.disabled = true;
    buttonEnviar.textContent = 'Entrando...';

    try {
      const body = { email, password };
      const response = await fetch('../v1/login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorMsg = 'Email ou senha inválidos.';
        if (response.status !== 401) {
          try {
            const errorData = await response.json();
            errorMsg = errorData.message || `Erro ${response.status}`;
          } catch (e) {
            console.error('Failed to parse login error response body:', e);
            errorMsg = `Erro ${response.status}`;
          }
        }
        throw new Error(errorMsg);
      }

      const data = await response.json();
      const token = data?.response?.token;

      if (!token) {
        console.error('Token not found in response:', data);
        throw new Error('Falha ao obter token de autenticação.');
      }

      localStorage.setItem('authToken', token.split('Token:')[0].trim());

      alert('Login realizado com sucesso!');
      window.location.href = '../v1/index';
    } catch (error) {
      console.error('Login failed:', error);
      alert(`Falha ao realizar login: ${error.message}`);
      inputSenha.value = '';
      inputSenha.focus();
    } finally {
      buttonEnviar.disabled = false;
      buttonEnviar.textContent = 'Sign In';
    }
  }

  if (buttonEnviar && formSignin) {
    formSignin.addEventListener('submit', handleSignIn);
  }

  // --- Sign Up Logic ---
  function validateSignUpForm() {
    let isValid = true;
    passwordHelpBlock.style.color = 'var(--primary-color)';

    if (!inputNome.value.trim()) {
      alert('Por favor, preencha o Nome Completo.');
      inputNome.focus();
      isValid = false;
    } else if (!inputMatricula.value.trim()) {
      alert('Por favor, preencha a Matrícula.');
      inputMatricula.focus();
      isValid = false;
    } else if (!inputEmail2.value.trim() || !validateEmail(inputEmail2.value.trim())) {
      alert('Por favor, insira um email válido.');
      inputEmail2.focus();
      isValid = false;
    } else if (!inputTelefone.value.trim() || !/^\d+$/.test(inputTelefone.value.trim())) {
      alert('Por favor, insira um telefone válido (apenas números).');
      inputTelefone.focus();
      isValid = false;
    } else if (!inputCargo.value) {
      alert('Por favor, selecione o Cargo Profissional.');
      inputCargo.focus();
      isValid = false;
    } else if (!inputSenha2.value || !validatePassword(inputSenha2.value)) {
      alert('Senha inválida. Verifique os requisitos.');
      passwordHelpBlock.style.color = 'red';
      inputSenha2.focus();
      isValid = false;
    } else if (inputSenha2.value !== inputSenha3.value) {
      alert('As senhas não coincidem.');
      inputSenha3.value = '';
      inputSenha3.focus();
      isValid = false;
    } else if (!termsCheckbox.checked) {
      alert('Você deve aceitar os Termos.');
      termsCheckbox.focus();
      isValid = false;
    }

    return isValid;
  }

  async function handleSignUp(event) {
    event.preventDefault();

    if (!validateSignUpForm()) {
      return;
    }

    buttonCadastrar.disabled = true;
    buttonCadastrar.textContent = 'Cadastrando...';

    const userData = {
      name: inputNome.value.trim(),
      registration: inputMatricula.value.trim(),
      email: inputEmail2.value.trim(),
      password: inputSenha2.value,
      phone: inputTelefone.value.trim(),
      professionalPosition: inputCargo.value,
    };

    console.log('Enviando dados de cadastro:', userData);

    try {
      const response = await fetch('../v1/users', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.status === 201 || response.ok) {
        alert('Cadastro realizado com sucesso! Faça o login.');
        backToLogin();
      } else {
        let errorMsg = `Erro ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorData.error || JSON.stringify(errorData);
        } catch (e) {
          console.error('Failed to parse signup error response body:', e);
          errorMsg = `${errorMsg} - ${response.statusText}`;
        }
        throw new Error(errorMsg);
      }
    } catch (error) {
      console.error('Signup failed:', error);
      alert(`Erro ao realizar cadastro: ${error.message}`);
    } finally {
      buttonCadastrar.disabled = false;
      buttonCadastrar.textContent = 'Sign up';
    }
  }

  if (buttonCadastrar && formSignup) {
    formSignup.addEventListener('submit', handleSignUp);
  }

  // --- Initial State ---
  showSigninForm();
  if (inputEmail) inputEmail.focus();
});
