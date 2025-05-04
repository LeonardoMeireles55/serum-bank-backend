// Declare helper functions at file top level
let serumBankSelect;
let sampleBarCodeInput;
let sampleTypeSelect;
let resultDiv;
let positionsDiv;
let submitButton;

document.addEventListener('DOMContentLoaded', () => {
  // Assign DOM elements to the variables we declared at file top level
  sampleBarCodeInput = document.getElementById('sampleBarCode')
  serumBankSelect = document.getElementById('serumBankSelect')
  sampleTypeSelect = document.getElementById('sampleType')
  resultDiv = document.getElementById('result')
  positionsDiv = document.getElementById('positions')
  submitButton = document.querySelector('.btn')

  // --- Event Listeners ---
  if (sampleBarCodeInput) {
    sampleBarCodeInput.addEventListener('input', function () {
      // Trigger submission automatically if length is 11 (adjust if needed)
      if (this.value.trim().length === 11) {
        submitSample()
      }
    })
    sampleBarCodeInput.focus() // Auto-focus on load
  }

  if (submitButton) {
    submitButton.addEventListener('click', submitSample)
  }

  if (serumBankSelect) {
    serumBankSelect.addEventListener('change', () => {
      fetchAndRenderPositions(serumBankSelect.value)
    })
  }

  // --- Initial Load ---
  loadSerumBanks()
  if (serumBankSelect.value) {
    fetchAndRenderPositions(serumBankSelect.value)
  }
})

function getCurrentDayIndex() {
  const today = new Date()
  let dayOfWeek = today.getDay() // 0 for Sunday, 1 for Monday, etc.
  // Assuming banks are indexed starting from Monday (index 2 if Sunday is 0)
  // Adjust logic based on actual bank indexing if needed.
  return dayOfWeek === 0 ? 0 : dayOfWeek * 2 // Example logic, adjust as needed
}

function redirectPage(url) {
  window.open(url, '_blank')
}

async function loadSerumBanks() {
  try {
    const response = await fetch('../v1/serum-banks')
    if (!response.ok) {
      throw new Error(
        `Erro ao carregar os bancos de soro (${response.status}).`,
      )
    }

    const data = await response.json()
    // Access the paginated response correctly - the API returns data in response.response
    const serumBanks = data.response
    
    if (!Array.isArray(serumBanks)) {
      console.error('Dados de bancos de soro não estão no formato esperado:', data)
      resultDiv.innerHTML = `<p style="color: var(--color-error)">Erro: Formato de dados inválido.</p>`
      return
    }

    serumBankSelect.innerHTML = '' // Clear existing options
    serumBanks.forEach((bank) => {
      const option = document.createElement('option')
      option.value = bank.serumBankCode
      option.textContent = bank.serumBankCode
      serumBankSelect.appendChild(option)
    })

    // Pre-select based on the day index
    const dayIndex = getCurrentDayIndex()
    if (dayIndex < serumBanks.length) {
      serumBankSelect.selectedIndex = dayIndex
    }
  } catch (error) {
    resultDiv.innerHTML = `<p style="color: var(--color-error)">Erro: ${error.message}</p>`
    console.error('Erro ao carregar bancos de soro:', error)
  }
}

async function fetchAndRenderPositions(serumBankCode) {
  const token = localStorage.getItem('authToken')
  if (!token) {
    // Handle missing token (redirect or show message)
    console.warn('Token não encontrado, redirecionando para login.')
    return
  }

  if (!serumBankCode) {
    positionsDiv.innerHTML = '' // Clear positions if no bank is selected
    return
  }

  try {
    const response = await fetch(
      `../v1/serum-banks/${serumBankCode}/samples`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    if (!response.ok) {
      if (response.status === 401) {
        redirectPage('../v1/login')
        throw new Error('Não autorizado. Faça login novamente.')
      }
      throw new Error(
        `Erro ao buscar amostras da bandeja (${response.status}).`,
      )
    }

    const samples = await response.json()
    const occupiedPositionsMap = new Map()
    samples.forEach((sample) => {
      occupiedPositionsMap.set(sample.position, sample.sample.sampleCode)
    })

    renderPositionsGrid(occupiedPositionsMap)
  } catch (error) {
    resultDiv.innerHTML = `<p style="color: var(--color-error)">Erro ao carregar posições: ${error.message}</p>`
    console.error(error)
  }
}

async function submitSample() {
  const token = localStorage.getItem('authToken')
  if (!token) {
    window.location.href = '../v1/login'
    return
  }

  const serumBankCode = serumBankSelect.value
  const sampleBarCode = sampleBarCodeInput.value.trim()
  const sampleType = sampleTypeSelect.value

  resultDiv.innerHTML = '' // Clear previous results

  if (!serumBankCode || !sampleBarCode || !sampleType) {
    resultDiv.innerHTML =
      '<p style="color: var(--color-error)">Por favor, preencha todos os campos.</p>'
    return
  }

  const data = {
    serumBankCode,
    sampleBarCode,
    sampleType,
  }

  console.log('Enviando dados:', data)

  try {
    const response = await fetch('../v1/serum-banks/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      let errorMessage = 'Erro ao alocar a amostra.'
      if (response.status === 409) {
        errorMessage = 'A amostra já foi alocada nesta ou em outra bandeja.'
      } else if (response.status === 401) {
        redirectPage('../v1/login')
        errorMessage = 'Não autorizado. Faça login novamente.'
      } else {
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          console.error('Failed to parse error response body:', e)
        }
      }
      throw new Error(`${errorMessage} (Status: ${response.status})`)
    }

    const result = await response.json()
    resultDiv.innerHTML = `<p>Amostra ${sampleBarCode} alocada com sucesso na bandeja ${serumBankCode}, posição ${result.position}.</p>`

    // Re-fetch and render positions to show the newly added sample
    await fetchAndRenderPositions(serumBankCode)
    sampleBarCodeInput.value = '' // Clear input after successful submission
    sampleBarCodeInput.focus() // Focus input for next scan
  } catch (error) {
    resultDiv.innerHTML = `<p style="color: var(--color-error)">Erro: ${error.message}</p>`
    console.error(error)
  }
}

function renderPositionsGrid(occupiedPositionsMap) {
  positionsDiv.innerHTML = '' // Clear previous positions

  for (let j = 0; j < 100; j++) {
    const positionDiv = document.createElement('div')
    positionDiv.className = 'position'
    positionDiv.textContent = j

    if (occupiedPositionsMap.has(j)) {
      positionDiv.classList.add('occupied')
      positionDiv.title = `Ocupado por: ${occupiedPositionsMap.get(j)}`
    } else {
      positionDiv.title = 'Vazia'
    }

    positionsDiv.appendChild(positionDiv)
  }
}
