document.addEventListener('DOMContentLoaded', () => {
  const sampleCodeInput = document.getElementById('sampleCode');
  const searchButton = document.querySelector(
    '.btn[onclick="fetchSamplePosition()"]',
  ); // More specific selector
  const deleteButton = document.getElementById('delete-sample');
  const resultDiv = document.getElementById('result');

  async function fetchSamplePosition() {
    const sampleCode = sampleCodeInput.value.trim();
    resultDiv.innerHTML = ''; // Clear previous results

    if (!sampleCode) {
      resultDiv.innerHTML =
        '<p style="color: var(--color-error);">Por favor, insira o código da amostra.</p>';
      return;
    }

    resultDiv.innerHTML = `<p>Buscando amostra ${sampleCode}...</p>`;

    try {
      // Add Authorization header if required by the endpoint
      const token = localStorage.getItem('authToken');
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(
        `../v1/serum-banks/samples/${sampleCode}/position`,
        { headers },
      );

      if (!response.ok) {
        let errorMessage = 'Erro ao buscar a posição da amostra.';
        if (response.status === 404) {
          errorMessage = `Amostra ${sampleCode} não encontrada.`;
        } else if (response.status === 401) {
          errorMessage = 'Não autorizado. Faça login novamente.';
          // Optionally redirect: window.location.href = '../v1/login';
        } else {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error('Failed to parse error response body:', e);
          }
        }
        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }

      const positionData = await response.json();
      if (
        positionData &&
        typeof positionData.position === 'number' &&
        positionData.serumBankCode
      ) {
        renderPositions(positionData, sampleCode);
      } else {
        throw new Error('Resposta inválida do servidor ao buscar posição.');
      }
    } catch (error) {
      resultDiv.innerHTML = `<p style="color: var(--color-error);">Erro: ${error.message}</p>`;
      console.error(error);
    }
  }

  async function removeSample() {
    const sampleCode = sampleCodeInput.value.trim();
    resultDiv.innerHTML = ''; // Clear previous results

    if (!sampleCode) {
      resultDiv.innerHTML =
        '<p style="color: var(--color-error);">Por favor, insira o código da amostra para remover.</p>';
      return;
    }

    // Confirmation dialog
    if (!confirm(`Tem certeza que deseja remover a amostra ${sampleCode}?`)) {
      return;
    }

    resultDiv.innerHTML = `<p>Removendo amostra ${sampleCode}...</p>`;

    try {
      // Add Authorization header if required by the endpoint
      const token = localStorage.getItem('authToken');
      const headers = { 'Content-Type': 'application/json' }; // Usually needed for DELETE, even if empty body
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`../v1/serum-banks/samples/${sampleCode}`, {
        method: 'DELETE',
        headers: headers,
      });

      if (response.status === 204 || response.ok) {
        // 204 No Content is common for DELETE
        resultDiv.innerHTML = `<p>Amostra ${sampleCode} removida com sucesso.</p>`;
        sampleCodeInput.value = ''; // Clear input after successful deletion
      } else {
        let errorMessage = 'Erro ao remover a amostra.';
        if (response.status === 404) {
          errorMessage = `Amostra ${sampleCode} não encontrada para remoção.`;
        } else if (response.status === 401) {
          errorMessage = 'Não autorizado. Faça login novamente.';
          // Optionally redirect: window.location.href = '../v1/login';
        } else {
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            console.error('Failed to parse error response body:', e);
          }
        }
        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }
    } catch (error) {
      resultDiv.innerHTML = `<p style="color: var(--color-error);">Erro: ${error.message}</p>`;
      console.error(error);
    }
  }

  function renderPositions(occupiedPositionData, searchedSampleCode) {
    resultDiv.innerHTML = ''; // Clear previous content (like loading message)

    const serumBankCodeDiv = document.createElement('div');
    serumBankCodeDiv.className = 'serumBankCode';
    serumBankCodeDiv.textContent = `BANDEJA: ${occupiedPositionData.serumBankCode}`;
    resultDiv.appendChild(serumBankCodeDiv);

    const positionsGrid = document.createElement('div');
    positionsGrid.className = 'positions-grid'; // Use the class defined in CSS

    for (let i = 0; i < 100; i++) {
      const positionDiv = document.createElement('div');
      positionDiv.className = 'position';
      positionDiv.textContent = i;

      if (i === occupiedPositionData.position) {
        positionDiv.classList.add('occupied'); // Highlight the occupied position
        positionDiv.title = `Amostra ${searchedSampleCode} encontrada na Posição ${i}`;
        // Optional: Add click event to link to traceability
        // positionDiv.addEventListener('click', () =>
        //   window.open(`http://****/*****/app/rastreabilidade/${searchedSampleCode.slice(0, -2)}`, '_blank')
        // );
      } else {
        positionDiv.title = `Posição ${i}: Vazia`;
      }

      positionsGrid.appendChild(positionDiv);
    }

    resultDiv.appendChild(positionsGrid);
  }

  // --- Event Listeners ---
  if (searchButton) {
    searchButton.addEventListener('click', fetchSamplePosition);
  }

  if (deleteButton) {
    deleteButton.addEventListener('click', removeSample);
  }

  // Optional: Allow search on pressing Enter in the input field
  if (sampleCodeInput) {
    sampleCodeInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission if it's inside a form
        fetchSamplePosition();
      }
    });
    sampleCodeInput.focus(); // Auto-focus on load
  }
});
