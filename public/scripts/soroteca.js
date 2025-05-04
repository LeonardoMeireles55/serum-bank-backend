
    function getSelectedBankCode() {
      const bankSelect = document.getElementById('bankSelect');
      return bankSelect.value;
    }

    function getCurrentDayIndex() {
      const today = new Date();
      let dayOfWeek = today.getDay();
      return dayOfWeek !== 0 ? dayOfWeek * 2 : dayOfWeek;
    }

    async function loadSerumBanks() {
      try {
        const response = await fetch('../v1/serum-banks');
        if (!response.ok) throw new Error('Erro ao carregar os bancos de soro.');

        const { response: serumBanks } = await response.json();
        const bankSelect = document.getElementById('bankSelect');

        const selectOption = document.createElement('option');
        selectOption.value = ""; // Empty value for "selecione"
        selectOption.textContent = "SELECIONE";
        bankSelect.appendChild(selectOption);


        serumBanks.forEach(bank => {
          const option = document.createElement('option');
          option.value = bank.serumBankCode;
          option.textContent = bank.serumBankCode;
          bankSelect.appendChild(option);
        });

        if (serumBanks.length > 0) fetchAvailablePositions();
      } catch (error) {
        document.getElementById('result').innerHTML = `<p>Erro: ${error.message}</p>`;
      }
    }



    let selectedBankCodeForDelete;

    function openModal() {
      document.getElementById('confirmationModal').style.display = 'flex';
    }

    function closeModal() {
      document.getElementById('confirmationModal').style.display = 'none';
    }

    function deleteAllSamples(serumBankCode) {
      selectedBankCodeForDelete = serumBankCode;
      openModal();
    }

    async function confirmDelete() {
      closeModal();

      const url = `../v1/serum-banks/samples/${selectedBankCodeForDelete}/allSamples`;


      try {
        const refreshButton = document.getElementById('refresh-button');
        refreshButton.addEventListener('click', refreshOptions);

        const response = await fetch(url, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.status === 204) {
          refreshOptions();
        } else {
          console.error(`Failed to delete all samples. Status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error while deleting all samples:', error);
      }
    }
    async function fetchAvailablePositions() {
      const bankCode = getSelectedBankCode();
      const resultDiv = document.getElementById('result');
      const infosBanks = document.getElementById('infos-banks');

      if (!bankCode) {
        infosBanks.innerHTML = '<p>Por favor, selecione um banco de soro.</p>';
        return;
      }

      try {
        const [positionsResponse, samplesResponse] = await Promise.all([
          fetch(`../v1/serum-banks/${bankCode}/available-positions`),
          fetch(`../v1/serum-banks/${bankCode}/samples`)
        ]);

        if (!positionsResponse.ok) throw new Error('Erro ao obter as posições disponíveis.');

        const occupiedPositions = await positionsResponse.json();
        const samples = await samplesResponse.json();
        console.log("Samples:", samples);
        // const samplesCodes = samples.map(sample => sample.sampleCode);

        renderPositions(occupiedPositions, samples);
      } catch (error) {
        resultDiv.innerHTML = `<p>Erro: ${error.message}</p>`;
      }
    }

    function renderPositions(occupiedPositions, samples) {
      console.log(samples);
      const resultDiv = document.getElementById('result');
      const infosBanks = document.getElementById('infos-banks');
      resultDiv.innerHTML = '';
      infosBanks.innerHTML = `<p>Posições ocupadas: ${samples.length}</p>`;

      for (let i = 0; i < 100; i++) {
        const positionDiv = document.createElement('div');
        positionDiv.className = 'position';
        positionDiv.textContent = i;

        positionDiv.title = samples[i] || 'VAZIA';
        const sampleInfo = samples.find(sample => sample.position === i);
        positionDiv.title = sampleInfo ? sampleInfo.sample.sampleCode : 'VAZIA';

        if (occupiedPositions.includes(i)) {
          positionDiv.classList.add('occupied');
        }

        positionDiv.addEventListener('click', () => {
          resultDiv.querySelectorAll('.position').forEach(p => p.classList.remove('selected'));
          positionDiv.classList.add('selected');
        });

        resultDiv.appendChild(positionDiv);
      }
    }

    function refreshOptions() {
      loadSerumBanks();
    }

    window.onload = loadSerumBanks;
