const cargoList = [
    {
        id: 'CARGO001',
        name: 'Строительные материалы',
        status: 'В пути',
        origin: 'Москва',
        destination: 'Казань',
        departureDate: '2024-11-24',
    },
    {
        id: 'CARGO002',
        name: 'Хрупкий груз',
        status: 'Ожидает отправки',
        origin: 'Санкт-Петербург',
        destination: 'Екатеринбург',
        departureDate: '2024-11-26',
    },
];

const cargoTable = document.getElementById('cargoTable');
const cargoForm = document.getElementById('cargoForm');
const statusFilter = document.getElementById('statusFilter');

function renderTable() {
    const filter = statusFilter.value;
    cargoTable.innerHTML = '';

    cargoList
        .filter(cargo => filter === 'all' || cargo.status === filter)
        .forEach(cargo => {
            const row = document.createElement('tr');
            row.innerHTML = `
          <td>${cargo.id}</td>
          <td>${cargo.name}</td>
          <td>
            <select class="form-select status-select ${getStatusClass(cargo.status)}" 
                    onchange="updateStatus('${cargo.id}', this.value)">
              <option value="Ожидает отправки" ${cargo.status === 'Ожидает отправки' ? 'selected' : ''}>Ожидает отправки</option>
              <option value="В пути" ${cargo.status === 'В пути' ? 'selected' : ''}>В пути</option>
              <option value="Доставлен" ${cargo.status === 'Доставлен' ? 'selected' : ''}>Доставлен</option>
            </select>
          </td>
          <td>${cargo.origin}</td>
          <td>${cargo.destination}</td>
          <td>${cargo.departureDate}</td>
          <td><button class="btn btn-danger btn-sm" onclick="deleteCargo('${cargo.id}')">Удалить</button></td>
        `;
            cargoTable.appendChild(row);
        });
}

function getStatusClass(status) {
    return status === 'Ожидает отправки' ? 'status-awaiting' : status === 'В пути' ? 'status-in-transit' : 'status-delivered';
}

function updateStatus(id, newStatus) {
    const cargo = cargoList.find(cargo => cargo.id === id);
    if (newStatus === 'Доставлен' && new Date(cargo.departureDate) > new Date()) {
        alert('Нельзя установить статус "Доставлен", так как дата отправления в будущем.');
        renderTable();
        return;
    }
    cargo.status = newStatus;
    renderTable();
}

function deleteCargo(id) {
    const index = cargoList.findIndex(cargo => cargo.id === id);
    if (index !== -1) cargoList.splice(index, 1);
    renderTable();
}

cargoForm.addEventListener('submit', event => {
    event.preventDefault();
    const name = document.getElementById('cargoName').value.trim();
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const departureDate = document.getElementById('departureDate').value;

    if (!name || !origin || !destination || !departureDate) {
        alert('Все поля должны быть заполнены!');
        return;
    }

    const newCargo = {
        id: `CARGO${String(cargoList.length + 1).padStart(3, '0')}`,
        name,
        status: 'Ожидает отправки',
        origin,
        destination,
        departureDate,
    };

    cargoList.push(newCargo);
    renderTable();
    cargoForm.reset();
});

statusFilter.addEventListener('change', renderTable);

// Начальная отрисовка
renderTable();
