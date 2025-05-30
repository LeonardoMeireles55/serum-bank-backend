// Footer component
function createFooter() {
  return `
    <footer style="
      background-color: var(--color-white, #ffffff);
      padding: var(--padding-large, 24px) 8%;
      box-shadow: var(--box-shadow, 0 2px 5px rgba(8, 57, 97, 0.1));
      text-align: center;
      margin-top: 100px;
      width: 100%;
    ">
      <div style="
        display: flex;
        justify-content: space-between;
        align-items: center;
        max-width: 1200px;
        margin: 0 auto;
        flex-wrap: wrap;
        gap: 20px;
      ">
        <div style="flex: 1; text-align: left; min-width: 200px;">
          <h4 style="color: var(--color-dark, #2c3e50); margin-bottom: var(--padding-small, 8px); font-size: var(--font-large, 1.25rem);">
            Soroteca
          </h4>
          <p style="color: var(--color-primary, #bdc3c7); font-size: var(--font-small, 0.875rem);">
            Gestão eficiente de amostras laboratoriais
          </p>
        </div>
        <div style="flex: 1; text-align: center; min-width: 200px;">
        </div>
        <div style="flex: 1; text-align: right; min-width: 200px;">
          <p style="color: var(--color-primary, #bdc3c7); font-size: var(--font-small, 0.875rem);">© 2025 Soroteca</p>
          <div style="display: flex; justify-content: flex-end; gap: var(--padding-small, 8px); margin-top: var(--padding-small, 8px);">
            <i class="fab fa-facebook" style="color: var(--color-primary, #bdc3c7);"></i>
            <i class="fab fa-twitter" style="color: var(--color-primary, #bdc3c7);"></i>
            <i class="fab fa-linkedin" style="color: var(--color-primary, #bdc3c7);"></i>
          </div>
        </div>
      </div>
    </footer>
  `;
}

// Renderizar o footer no elemento com ID específico ou ao final do body
function renderFooter(elementId) {
  document.addEventListener("DOMContentLoaded", function() {
    if (elementId && document.getElementById(elementId)) {
      document.getElementById(elementId).innerHTML = createFooter();
    } else {
      document.body.insertAdjacentHTML("beforeend", createFooter());
    }
  });
}

