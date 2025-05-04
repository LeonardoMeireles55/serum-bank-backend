/**
 * Renders the navigation bar component
 * @param {string} containerId - ID of the container element where the navbar will be rendered
 */
function renderNavbar(containerId) {
  const navbarHTML = `
    <nav id="navbar" aria-label="Main navigation">
      <img class="nav-logo" src="../v1/soroteca-logo" alt="nav_logo">

      <ul id="nav_list">
        <li class="nav-item">
          <i style="color: rgb(55, 88, 126);font-size: 20px;" class="fa-solid fa-chalkboard-user"></i>
          <a href="../v1/index">Home</a>
        </li>
        <li class="nav-item">
          <i style="color: rgb(55, 88, 126);font-size: 20px;" class="fa-solid fa-vial"></i>
          <a href="../v1/index">Soroteca</a>
        </li>
        <li class="nav-item">
          <i style="color: rgb(55, 88, 126);font-size: 20px;" class="fa-solid fa-eye-dropper"></i>
          <a href="../v1/transaction">Alocação</a>
        </li>
        <li class="nav-item">
          <i style="color: rgb(55, 88, 126);font-size: 20px;" class="fa-solid fa-magnifying-glass"></i>
          <a href="../v1/search">Pesquisa</a>
        </li>
        <li class="nav-item">
          <i style="color: rgb(55, 88, 126);font-size: 20px;" class="fa-solid fa-power-off"></i>
          <a href="../v1/login">Login in/Logout</a>
        </li>
      </ul>
    </nav>
  `;

  document.getElementById(containerId).innerHTML = navbarHTML;
}