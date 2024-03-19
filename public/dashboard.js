if (performance.navigation.type === 2) {
  window.location.href = "/";
}

let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".sidebarBtn");
sidebarBtn.onclick = function () {
  sidebar.classList.toggle("active");
  if (sidebar.classList.contains("active")) {
    sidebarBtn.innerHTML = "menu_open";
  } else {
    sidebarBtn.innerHTML = "menu";
  }
};

function showSection(sectionId) {
  const sections = ["dashboard", "agents", "history", "settings"];
  let title = document.querySelector(".hc-title");
  sections.forEach((section) => {
    const button = document.querySelector(`.${section}`);
    const content = document.querySelector(`.hc-${section}`);

    button.addEventListener("click", function () {
      sections.forEach((s) => {
        const sButton = document.querySelector(`.${s}`);
        const sContent = document.querySelector(`.hc-${s}`);
        sButton.classList.remove("active");
        sContent.classList.remove("active");
      });

      button.classList.add("active");
      content.classList.add("active");
      title.innerHTML = section.charAt(0).toUpperCase() + section.slice(1);
    });
  });
}

showSection();

function sortTable(columnIndex) {
  var table,
    rows,
    switching,
    i,
    x,
    y,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("myTable");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < rows.length - 1; i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("td")[columnIndex];
      y = rows[i + 1].getElementsByTagName("td")[columnIndex];
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
  var th = table.getElementsByTagName("th");
  for (var i = 0; i < th.length; i++) {
    th[i].classList.remove("asc", "desc");
  }
  th[columnIndex].classList.toggle("asc", dir === "asc");
  th[columnIndex].classList.toggle("desc", dir === "desc");
}
function filterTable() {
  var input, filter, table, tr, td, i, j, txtValue;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    for (j = 0; j < tr[i].getElementsByTagName("td").length; j++) {
      td = tr[i].getElementsByTagName("td")[j];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
          break;
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }
}
