const tableBody = document.getElementById('employee-body');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const pageInfo = document.getElementById('page-info');
const departmentFilter = document.getElementById('department');
const genderFilter = document.getElementById('gender');
const sortSelect = document.getElementById('sort');

let currentPage = 1;
let totalPages = 1;
let employees = [];

function fetchEmployees() {
  const url = `https://dbioz2ek0e.execute-api.ap-south-1.amazonaws.com/mockapi/get-employees?page=1&limit=10`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      employees = data;
      renderEmployees();
    })
    .catch(error => console.error('Error fetching employees:', error));
}

function renderEmployees() {
  tableBody.innerHTML = '';
  const filteredEmployees = filterEmployees();
  const sortedEmployees = sortEmployees(filteredEmployees);
  const startIndex = (currentPage - 1) * 10;
  const endIndex = Math.min(startIndex + 10, sortedEmployees.length);

  for (let i = startIndex; i < endIndex; i++) {
    const employee = sortedEmployees[i];
    const row = `
      <tr>
        <td>${i + 1}</td>
        <td>${employee.name}</td>
        <td>${employee.gender}</td>
        <td>${employee.department}</td>
        <td>${employee.salary}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  }

  totalPages = Math.ceil(sortedEmployees.length / 10);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

function filterEmployees() {
  let filtered = employees;
  if (departmentFilter.value) {
    filtered = filtered.filter(employee => employee.department === departmentFilter.value);
  }
  if (genderFilter.value) {
    filtered = filtered.filter(employee => employee.gender === genderFilter.value);
  }
  return filtered;
}

function sortEmployees(employees) {
  const sortBy = sortSelect.value;
  if (sortBy === 'asc') {
    return employees.sort((a, b) => a.salary - b.salary);
  } else if (sortBy === 'desc') {
    return employees.sort((a, b) => b.salary - a.salary);
  } else {
    return employees;
  }
}

prevBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchEmployees();
  }
});

nextBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    fetchEmployees();
  }
});

departmentFilter.addEventListener('change', fetchEmployees);
genderFilter.addEventListener('change', fetchEmployees);
sortSelect.addEventListener('change', fetchEmployees);

fetchEmployees();
