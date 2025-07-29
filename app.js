// Crear un nuevo archivo app.js con el código del cliente para conectarse a la API
document.addEventListener('DOMContentLoaded', () => {



  // API URL - obtiene la URL base actual (evita problemas de CORS)
  const API_URL = window.location.origin + '/api';

  console.log('Usando API en:', API_URL);
  // Verificar conexión con el servidor al inicio
  console.log('Verificando conexión con el servidor en:', API_URL);

  fetch(`${API_URL}/test`)
    .then(response => {

      console.log('Respuesta del servidor:', response);
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {




      console.log('Prueba de servidor exitosa:', data);

      // Ahora verificar la conexión a la base de datos
      return fetch(`${API_URL}/status`);
    })






































































    .then(response => {
      if (!response.ok) {











        throw new Error(`Error HTTP: ${response.status}`);
      }

































      return response.json();
    })
    .then(data => {
      console.log('Estado del servidor:', data);
      if (!data.connected) {
        console.warn('No hay conexión con la base de datos. Se usará almacenamiento local.');
      }
    })
    .catch(error => {
      console.error('Error al verificar el estado del servidor:', error);
      alert('No se puede conectar con el servidor. Se usará almacenamiento local como respaldo.');
    });

  // Función para mostrar mensajes de error en la interfaz
  function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message p-3 rounded-md mb-4';
    errorDiv.textContent = message;

    // Insertarlo en algún lugar visible
    const container = document.querySelector('.page-content:not(.hidden)') || document.body;
    container.prepend(errorDiv);

    // Removerlo después de unos segundos
      setTimeout(() => {

      errorDiv.remove();
      }, 3000);
    }































































































      
  // Helper function to get local date in YYYY-MM-DD format
  function getLocalDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Day name in Spanish
  const daysInSpanish = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const monthsInSpanish = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // Current day variables
  const today = new Date();
  const dayName = daysInSpanish[today.getDay()];
  const currentDayFormatted = `${dayName}, ${today.getDate()} de ${monthsInSpanish[today.getMonth()]} de ${today.getFullYear()}`;

  document.getElementById('current-day').textContent = currentDayFormatted;
  document.getElementById('current-day-mobile').textContent = currentDayFormatted;

  // Set default date for date query to today
  const todayFormatted = getLocalDateKey(today);
  document.getElementById('date-selector').value = todayFormatted;
  document.getElementById('report-date').value = todayFormatted;

  // Login functionality
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    try {



































































































      console.log('Intentando login con:', { username, password: '***' });

      // Intentar autenticación con el servidor
      const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },

        body: JSON.stringify({ username, password })
        });
        
      console.log('Respuesta del servidor:', response);

        if (!response.ok) {






































































































































































































































































































































































































































































































































































































































































































































































































































































        // Si hay un error HTTP, primero probar el login local
        if (username === 'PanaderiaNubes' && password === 'Latoso8110') {
          console.warn('Usando autenticación local de respaldo');
          sessionStorage.setItem('panaderiaNubesLoggedIn', 'true');
          document.getElementById('login-screen').classList.add('hidden');
          document.getElementById('app-container').classList.remove('hidden');

          // Inicializar datos después de login
          initTodayData();
      return;
    }
        throw new Error(`Error HTTP: ${response.status}`);
      }
    


























































      const data = await response.json();
      console.log('Datos de respuesta:', data);

      if (data.success) {
        // Login exitoso con el servidor
        sessionStorage.setItem('panaderiaNubesLoggedIn', 'true');
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');

        // Inicializar datos después de login
        initTodayData();
        return;
      } else {
        throw new Error(data.message || 'Error de autenticación');
      }
    } catch (error) {


      console.error('Error en login:', error);

      // Si hay error de conexión, intentar login local como respaldo
      if (username === 'PanaderiaNubes' && password === 'Latoso8110') {
        console.warn('Usando autenticación local de respaldo');
        sessionStorage.setItem('panaderiaNubesLoggedIn', 'true');
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('app-container').classList.remove('hidden');

        // Inicializar datos después de login
        initTodayData();
        return;
  }









      // Si llegamos aquí, la autenticación falló
      loginError.classList.remove('hidden');
      setTimeout(() => {
        loginError.classList.add('hidden');
      }, 3000);
    }
});

  // Check if user is logged in
  if (sessionStorage.getItem('panaderiaNubesLoggedIn') === 'true') {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-container').classList.remove('hidden');

    // Inicializar datos al cargar la página si ya está logueado
    initTodayData();
  }

  // Logout functionality
  document.getElementById('logout-button').addEventListener('click', logout);
  document.getElementById('desktop-logout').addEventListener('click', logout);

  function logout() {
    sessionStorage.removeItem('panaderiaNubesLoggedIn');
    document.getElementById('app-container').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
  }

  // Sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const contentArea = document.getElementById('content-area');

  document.getElementById('collapse-sidebar').addEventListener('click', () => {
    console.log('Botón de colapsar sidebar clickeado');
    sidebar.classList.toggle('collapsed');
    contentArea.classList.toggle('full');
  });

  // Mobile menu
  document.getElementById('mobile-menu-button').addEventListener('click', () => {
    console.log('Botón de menú móvil clickeado');
    sidebar.classList.toggle('mobile-open');
  });

  // Navigation
  const navLinks = document.querySelectorAll('.nav-link');
  const pageContents = document.querySelectorAll('.page-content');
  const mobileTitle = document.getElementById('mobile-title');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.getAttribute('data-target');
      console.log('Navegación a:', target);

      // Update active class
      navLinks.forEach(l => l.classList.remove('active-nav', 'bg-gray-700'));
      link.classList.add('active-nav', 'bg-gray-700');

      // Show correct content
      pageContents.forEach(content => {
        content.classList.add('hidden');
      });
      document.getElementById(`${target}-content`).classList.remove('hidden');

      // Initialize today's data when dashboard is shown
      if (target === 'dashboard') {
        initTodayData();
      } else if (target === 'date-query') {
        // Trigger the date selector change event to load data for current date
        const event = new Event('change');
        document.getElementById('date-selector').dispatchEvent(event);
      }

      // Update mobile title
      mobileTitle.textContent = link.querySelector('span').textContent;

      // Close mobile menu when link clicked
      sidebar.classList.remove('mobile-open');
    });
  });

  // Expenses functionality
  const addExpenseBtn = document.getElementById('add-expense');
  const expensesTable = document.getElementById('expenses-table').querySelector('tbody');

  // Initialize expenses array
  let expenses = [];

  // Sales functionality
  let salesAmount = 0;
  const salesInput = document.getElementById('sales-amount');
  const saveSalesBtn = document.getElementById('save-sales');
  const editSalesBtn = document.getElementById('edit-sales');
  const deleteSalesBtn = document.getElementById('delete-sales');
  const salesSuccess = document.getElementById('sales-success');

  // Initialize today's data
  async function initTodayData() {
    const todayDateKey = getLocalDateKey(new Date());
    console.log('Inicializando datos para la fecha:', todayDateKey);

    try {
      // Fetch expenses for today
      console.log('Obteniendo gastos...');
      const expensesResponse = await fetch(`${API_URL}/expenses/${todayDateKey}`);
      if (!expensesResponse.ok) {
        throw new Error(`HTTP error: ${expensesResponse.status}`);
      }
      expenses = await expensesResponse.json();
      console.log('Gastos obtenidos:', expenses);

      // Fetch sales for today
      console.log('Obteniendo ventas...');
      const salesResponse = await fetch(`${API_URL}/sales/${todayDateKey}`);
      if (!salesResponse.ok) {
        throw new Error(`HTTP error: ${salesResponse.status}`);
      }
      const salesData = await salesResponse.json();
      salesAmount = salesData.amount || 0;
      console.log('Ventas obtenidas:', salesAmount);

      // Update sales UI based on loaded data
      if (salesAmount > 0) {
        salesInput.value = salesAmount;
        salesInput.disabled = true;
        saveSalesBtn.disabled = true;
        editSalesBtn.disabled = false;
        deleteSalesBtn.disabled = false;
      } else {
        salesInput.value = '';
        salesInput.disabled = false;
        saveSalesBtn.disabled = false;
        editSalesBtn.disabled = true;
        deleteSalesBtn.disabled = true;
      }

      // Load expenses and update UI
      loadExpenses();
      updateExpenseTotals();
      updateSummary();
      console.log('Datos inicializados correctamente');
    } catch (error) {
      console.error('Error initializing data:', error);
      showError('Error al cargar los datos del servidor. Usando datos locales como respaldo.');

      // Cargar desde localStorage como respaldo
      const localExpenses = JSON.parse(localStorage.getItem(`expenses_${todayDateKey}`)) || [];
      const localSales = parseFloat(localStorage.getItem(`sales_${todayDateKey}`)) || 0;

      expenses = localExpenses.map(e => ({...e, _id: e.id || Date.now().toString()}));
      salesAmount = localSales;

      if (salesAmount > 0) {
        salesInput.value = salesAmount;
        salesInput.disabled = true;
        saveSalesBtn.disabled = true;
        editSalesBtn.disabled = false;
        deleteSalesBtn.disabled = false;
      } else {
        salesInput.value = '';
        salesInput.disabled = false;
        saveSalesBtn.disabled = false;
        editSalesBtn.disabled = true;
        deleteSalesBtn.disabled = true;
      }

      loadExpenses();
      updateExpenseTotals();
      updateSummary();
    }
  }

  // Add expense
  addExpenseBtn.addEventListener('click', async () => {
    console.log('Botón de agregar gasto clickeado');
    const name = document.getElementById('new-expense-name').value.trim();
    const price = parseFloat(document.getElementById('new-expense-price').value);
    const belongsToBakery = document.getElementById('new-expense-belongs').checked;

    if (name && !isNaN(price) && price > 0) {
      const todayDateKey = getLocalDateKey(new Date());
      console.log('Añadiendo gasto:', { name, price, belongsToBakery, date: todayDateKey });

      const expense = {
        name,
        price,
        belongsToBakery,
        date: todayDateKey
      };

      // Guardar en localStorage como respaldo
      const localId = Date.now().toString();
      const localExpenses = JSON.parse(localStorage.getItem(`expenses_${todayDateKey}`)) || [];
      const localExpense = {...expense, id: localId};
      localExpenses.push(localExpense);
      localStorage.setItem(`expenses_${todayDateKey}`, JSON.stringify(localExpenses));

      try {
        // Send to server
        console.log('Enviando gasto al servidor...');
        const response = await fetch(`${API_URL}/expenses`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(expense)
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (data.success) {
          // Add the ID from MongoDB to our expense object
          expense._id = data.id;

          // Update local storage with the server ID
          const updatedLocalExpenses = JSON.parse(localStorage.getItem(`expenses_${todayDateKey}`)) || [];
          const index = updatedLocalExpenses.findIndex(e => e.id === localId);
          if (index >= 0) {
            updatedLocalExpenses[index].id = data.id;
            localStorage.setItem(`expenses_${todayDateKey}`, JSON.stringify(updatedLocalExpenses));
          }

          expenses.push(expense);
          addExpenseToTable(expense);
          updateExpenseTotals();
          updateSummary();

          // Clear form
          document.getElementById('new-expense-name').value = '';
          document.getElementById('new-expense-price').value = '';
          document.getElementById('new-expense-belongs').checked = false;
        } else {
          throw new Error(data.message || 'Error al guardar el gasto');
        }
      } catch (error) {
        console.error('Error adding expense:', error);
        showError('Error al guardar el gasto en el servidor. Se ha guardado localmente.');

        // Usar el ID local y añadir a la interfaz
        expense._id = localId;
        expenses.push(expense);
        addExpenseToTable(expense);
        updateExpenseTotals();
        updateSummary();

        // Limpiar formulario
        document.getElementById('new-expense-name').value = '';
        document.getElementById('new-expense-price').value = '';
        document.getElementById('new-expense-belongs').checked = false;
      }
    } else {
      showError('Por favor complete todos los campos del gasto correctamente.');
    }
  });

  function loadExpenses() {
    console.log('Cargando gastos en la tabla...');
    // Clear table first (except the new expense row)
    const rows = expensesTable.querySelectorAll('tr:not(#expense-new-row)');
    rows.forEach(row => row.remove());

    // Add expenses to table
    expenses.forEach(expense => {
      addExpenseToTable(expense);
    });
    console.log('Gastos cargados en la tabla');
  }

  function addExpenseToTable(expense) {
    const row = document.createElement('tr');
    row.dataset.id = expense._id;

    row.innerHTML = `
      <td>${expense.name}</td>
      <td>$${expense.price.toFixed(2)}</td>
      <td class="text-center">${expense.belongsToBakery ? '<i class="fas fa-check text-green-500"></i>' : '<i class="fas fa-times text-red-500"></i>'}</td>
      <td>
        <div class="flex space-x-2">
          <button class="edit-expense p-2 bg-yellow-700 text-yellow-200 rounded-md">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete-expense p-2 bg-red-700 text-red-200 rounded-md">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </td>
    `;

    // Insert before the new expense row
    expensesTable.insertBefore(row, document.getElementById('expense-new-row'));

    // Add event listeners
    row.querySelector('.edit-expense').addEventListener('click', () => {
      console.log('Botón de editar gasto clickeado:', expense._id);
      editExpense(expense._id);
    });

    row.querySelector('.delete-expense').addEventListener('click', () => {
      console.log('Botón de eliminar gasto clickeado:', expense._id);
      deleteExpense(expense._id);
    });
  }

  function editExpense(id) {
    const expense = expenses.find(e => e._id === id);
    if (!expense) return;

    const row = expensesTable.querySelector(`tr[data-id="${id}"]`);

    row.innerHTML = `
      <td><input type="text" class="w-full p-2 rounded-md" value="${expense.name}"></td>
      <td><input type="number" class="w-full p-2 rounded-md" value="${expense.price}" min="0"></td>
      <td class="text-center">
        <input type="checkbox" class="w-5 h-5" ${expense.belongsToBakery ? 'checked' : ''}>
      </td>
      <td>
        <div class="flex space-x-2">
          <button class="save-edit p-2 bg-green-700 text-green-200 rounded-md">
            <i class="fas fa-save"></i>
          </button>
          <button class="cancel-edit p-2 bg-gray-700 text-gray-200 rounded-md">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </td>
    `;

    row.querySelector('.save-edit').addEventListener('click', async () => {
      console.log('Botón de guardar edición clickeado');
      const newName = row.querySelector('input[type="text"]').value.trim();
      const newPrice = parseFloat(row.querySelector('input[type="number"]').value);
      const newBelongsToBakery = row.querySelector('input[type="checkbox"]').checked;

      if (newName && !isNaN(newPrice) && newPrice > 0) {
        // Guardar cambios localmente primero
        const oldExpense = {...expense};
        expense.name = newName;
        expense.price = newPrice;
        expense.belongsToBakery = newBelongsToBakery;

        // Actualizar en localStorage
        const todayDateKey = getLocalDateKey(new Date());
        const localExpenses = JSON.parse(localStorage.getItem(`expenses_${todayDateKey}`)) || [];
        const localIndex = localExpenses.findIndex(e => e.id === expense._id);
        if (localIndex >= 0) {
          localExpenses[localIndex] = {...expense, id: expense._id};
          localStorage.setItem(`expenses_${todayDateKey}`, JSON.stringify(localExpenses));
        }

        try {
          // Update on server
          console.log('Actualizando gasto en el servidor:', expense);
          const response = await fetch(`${API_URL}/expenses/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(expense)
          });

          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }

          const data = await response.json();
          console.log('Respuesta del servidor:', data);

          if (data.success) {
            // Actualizar la interfaz
            updateExpenseRow(row, expense);
            updateExpenseTotals();
            updateSummary();
          } else {
            throw new Error(data.message || 'Error al actualizar el gasto');
          }
        } catch (error) {
          console.error('Error updating expense:', error);
          showError('Error al actualizar el gasto en el servidor. Los cambios se han guardado localmente.');

          // Actualizar la interfaz de todos modos
          updateExpenseRow(row, expense);
          updateExpenseTotals();
          updateSummary();
        }
      } else {
        showError('Por favor complete todos los campos correctamente.');
      }
    });

    row.querySelector('.cancel-edit').addEventListener('click', () => {
      console.log('Botón de cancelar edición clickeado');
      updateExpenseRow(row, expense);
    });
  }
    function updateExpenseRow(row, expense) {
    row.innerHTML = `
      <td>${expense.name}</td>
      <td>$${expense.price.toFixed(2)}</td>
      <td class="text-center">${expense.belongsToBakery ? '<i class="fas fa-check text-green-500"></i>' : '<i class="fas fa-times text-red-500"></i>'}</td>
      <td>
        <div class="flex space-x-2">
          <button class="edit-expense p-2 bg-yellow-700 text-yellow-200 rounded-md">
            <i class="fas fa-edit"></i>
          </button>
          <button class="delete-expense p-2 bg-red-700 text-red-200 rounded-md">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </td>
    `;

    // Add event listeners again
    row.querySelector('.edit-expense').addEventListener('click', () => {
      editExpense(expense._id);
    });

    row.querySelector('.delete-expense').addEventListener('click', () => {
      deleteExpense(expense._id);
    });
  }

  async function deleteExpense(id) {
    if (confirm('¿Está seguro que desea eliminar este gasto?')) {
      console.log('Eliminando gasto:', id);

      // Eliminar de localStorage primero
      const todayDateKey = getLocalDateKey(new Date());
      let localExpenses = JSON.parse(localStorage.getItem(`expenses_${todayDateKey}`)) || [];
      localExpenses = localExpenses.filter(e => e.id !== id);
      localStorage.setItem(`expenses_${todayDateKey}`, JSON.stringify(localExpenses));

      try {
        // Delete from server
        console.log('Eliminando gasto del servidor...');
        const response = await fetch(`${API_URL}/expenses/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (data.success) {
          expenses = expenses.filter(e => e._id !== id);
          const row = expensesTable.querySelector(`tr[data-id="${id}"]`);
          if (row) {
            row.remove();
            updateExpenseTotals();
            updateSummary();
          }
        } else {
          throw new Error(data.message || 'Error al eliminar el gasto');
        }
      } catch (error) {
        console.error('Error deleting expense:', error);
        showError('Error al eliminar el gasto del servidor. Se ha eliminado localmente.');

        // Eliminar de la interfaz de todos modos
        expenses = expenses.filter(e => e._id !== id);
        const row = expensesTable.querySelector(`tr[data-id="${id}"]`);
        if (row) {
          row.remove();
          updateExpenseTotals();
          updateSummary();
        }
      }
    }
  }

  function updateExpenseTotals() {
    const totalExpenses = expenses.reduce((total, expense) => total + expense.price, 0);
    const totalBakeryExpenses = expenses
      .filter(expense => expense.belongsToBakery)
      .reduce((total, expense) => total + expense.price, 0);

    document.getElementById('total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById('total-bakery-expenses').textContent = `$${totalBakeryExpenses.toFixed(2)}`;
  }

  // Sales functionality
  saveSalesBtn.addEventListener('click', async () => {
    console.log('Botón de guardar ventas clickeado');
    const amount = parseFloat(salesInput.value);
    if (!isNaN(amount) && amount >= 0) {
      salesAmount = amount;
      const todayDateKey = getLocalDateKey(new Date());

      // Guardar en localStorage como respaldo
      localStorage.setItem(`sales_${todayDateKey}`, salesAmount);

      try {
        // Save to server
        console.log('Guardando venta en el servidor:', { date: todayDateKey, amount: salesAmount });
        const response = await fetch(`${API_URL}/sales`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ date: todayDateKey, amount: salesAmount })
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (data.success) {
          salesInput.disabled = true;
          saveSalesBtn.disabled = true;
          editSalesBtn.disabled = false;
          deleteSalesBtn.disabled = false;

          salesSuccess.classList.remove('hidden');
          setTimeout(() => {
            salesSuccess.classList.add('hidden');
          }, 3000);

          updateSummary();
        } else {
          throw new Error(data.message || 'Error al guardar la venta');
        }
      } catch (error) {
        console.error('Error saving sales:', error);
        showError('Error al guardar la venta en el servidor. Se ha guardado localmente.');

        // Actualizar la interfaz de todos modos
        salesInput.disabled = true;
        saveSalesBtn.disabled = true;
        editSalesBtn.disabled = false;
        deleteSalesBtn.disabled = false;

        salesSuccess.classList.remove('hidden');
        setTimeout(() => {
          salesSuccess.classList.add('hidden');
        }, 3000);

        updateSummary();
      }
    } else {
      showError('Por favor ingrese un monto válido para la venta.');
    }
  });

  // Edit sales button
  editSalesBtn.addEventListener('click', () => {
    console.log('Botón de editar ventas clickeado');
    salesInput.disabled = false;
    saveSalesBtn.disabled = false;
    editSalesBtn.disabled = true;
    deleteSalesBtn.disabled = true;
  });

  // Delete sales
  deleteSalesBtn.addEventListener('click', async () => {
    console.log('Botón de eliminar ventas clickeado');
    if (confirm('¿Está seguro que desea eliminar las ventas del día?')) {
      const todayDateKey = getLocalDateKey(new Date());

      // Eliminar de localStorage primero
      localStorage.removeItem(`sales_${todayDateKey}`);

      try {
        // Delete from server
        console.log('Eliminando venta del servidor...');
        const response = await fetch(`${API_URL}/sales/${todayDateKey}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Respuesta del servidor:', data);

        if (data.success) {
          salesAmount = 0;
          salesInput.value = '';
          salesInput.disabled = false;
          saveSalesBtn.disabled = false;
          editSalesBtn.disabled = true;
          deleteSalesBtn.disabled = true;

          updateSummary();
        } else {
          throw new Error(data.message || 'Error al eliminar la venta');
        }
      } catch (error) {
        console.error('Error deleting sales:', error);
        showError('Error al eliminar la venta del servidor. Se ha eliminado localmente.');

        // Actualizar la interfaz de todos modos
        salesAmount = 0;
        salesInput.value = '';
        salesInput.disabled = false;
        saveSalesBtn.disabled = false;
        editSalesBtn.disabled = true;
        deleteSalesBtn.disabled = true;

        updateSummary();
      }
    }
  });

  // Summary update
  function updateSummary() {
    const totalExpenses = expenses.reduce((total, expense) => total + expense.price, 0);
    const totalBakeryExpenses = expenses
      .filter(expense => expense.belongsToBakery)
      .reduce((total, expense) => total + expense.price, 0);

    const grossProfit = salesAmount - totalExpenses;
    const netProfit = salesAmount - totalBakeryExpenses;

    document.getElementById('summary-sales').textContent = `$${salesAmount.toFixed(2)}`;
    document.getElementById('summary-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
    document.getElementById('summary-bakery-expenses').textContent = `$${totalBakeryExpenses.toFixed(2)}`;
    document.getElementById('summary-gross-profit').textContent = `$${grossProfit.toFixed(2)}`;
    document.getElementById('summary-net-profit').textContent = `$${netProfit.toFixed(2)}`;
  }

  // Date query functionality
  document.getElementById('date-selector').addEventListener('change', async function() {
    const selectedDate = this.value;
    console.log('Fecha seleccionada:', selectedDate);

    try {
      // Fetch expenses for selected date
      console.log('Obteniendo gastos para la fecha seleccionada...');
      const expensesResponse = await fetch(`${API_URL}/expenses/${selectedDate}`);

      if (!expensesResponse.ok) {
        throw new Error(`HTTP error: ${expensesResponse.status}`);
      }

      const selectedDateExpenses = await expensesResponse.json();
      console.log('Gastos obtenidos:', selectedDateExpenses);

      // Fetch sales for selected date
      console.log('Obteniendo ventas para la fecha seleccionada...');
      const salesResponse = await fetch(`${API_URL}/sales/${selectedDate}`);

      if (!salesResponse.ok) {
        throw new Error(`HTTP error: ${salesResponse.status}`);
      }

      const salesData = await salesResponse.json();
      const selectedDateSales = salesData.amount || 0;
      console.log('Ventas obtenidas:', selectedDateSales);

      // Show results
      document.getElementById('date-results').classList.remove('hidden');

      // Load expenses
      const dateExpensesTable = document.getElementById('date-expenses-table').querySelector('tbody');
      dateExpensesTable.innerHTML = '';

      selectedDateExpenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${expense.name}</td>
          <td>$${expense.price.toFixed(2)}</td>
          <td class="text-center">${expense.belongsToBakery ? '<i class="fas fa-check text-green-500"></i>' : '<i class="fas fa-times text-red-500"></i>'}</td>
        `;
        dateExpensesTable.appendChild(row);
      });

      // Calculate totals
      const totalExpenses = selectedDateExpenses.reduce((total, expense) => total + expense.price, 0);
      const totalBakeryExpenses = selectedDateExpenses
        .filter(expense => expense.belongsToBakery)
        .reduce((total, expense) => total + expense.price, 0);

      document.getElementById('date-total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
      document.getElementById('date-total-bakery-expenses').textContent = `$${totalBakeryExpenses.toFixed(2)}`;

      // Show sales
      document.getElementById('date-sales-amount').textContent = `$${selectedDateSales.toFixed(2)}`;

      // Update summary
      const grossProfit = selectedDateSales - totalExpenses;
      const netProfit = selectedDateSales - totalBakeryExpenses;

      document.getElementById('date-summary-sales').textContent = `$${selectedDateSales.toFixed(2)}`;
      document.getElementById('date-summary-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
      document.getElementById('date-summary-bakery-expenses').textContent = `$${totalBakeryExpenses.toFixed(2)}`;
      document.getElementById('date-summary-gross-profit').textContent = `$${grossProfit.toFixed(2)}`;
      document.getElementById('date-summary-net-profit').textContent = `$${netProfit.toFixed(2)}`;
    } catch (error) {
      console.error('Error fetching date data:', error);
      showError('Error al obtener datos para la fecha seleccionada. Usando datos locales como respaldo.');

      // Intentar cargar desde localStorage
      const localExpenses = JSON.parse(localStorage.getItem(`expenses_${selectedDate}`)) || [];
      const localSales = parseFloat(localStorage.getItem(`sales_${selectedDate}`)) || 0;

      // Mostrar resultados
      document.getElementById('date-results').classList.remove('hidden');

      // Cargar gastos
      const dateExpensesTable = document.getElementById('date-expenses-table').querySelector('tbody');
      dateExpensesTable.innerHTML = '';

      localExpenses.forEach(expense => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${expense.name}</td>
          <td>$${expense.price.toFixed(2)}</td>
          <td class="text-center">${expense.belongsToBakery ? '<i class="fas fa-check text-green-500"></i>' : '<i class="fas fa-times text-red-500"></i>'}</td>
        `;
        dateExpensesTable.appendChild(row);
      });

      // Calcular totales
      const totalExpenses = localExpenses.reduce((total, expense) => total + expense.price, 0);
      const totalBakeryExpenses = localExpenses
        .filter(expense => expense.belongsToBakery)
        .reduce((total, expense) => total + expense.price, 0);

      document.getElementById('date-total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
      document.getElementById('date-total-bakery-expenses').textContent = `$${totalBakeryExpenses.toFixed(2)}`;

      // Mostrar ventas
      document.getElementById('date-sales-amount').textContent = `$${localSales.toFixed(2)}`;

      // Actualizar resumen
      const grossProfit = localSales - totalExpenses;
      const netProfit = localSales - totalBakeryExpenses;

      document.getElementById('date-summary-sales').textContent = `$${localSales.toFixed(2)}`;
      document.getElementById('date-summary-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
      document.getElementById('date-summary-bakery-expenses').textContent = `$${totalBakeryExpenses.toFixed(2)}`;
      document.getElementById('date-summary-gross-profit').textContent = `$${grossProfit.toFixed(2)}`;
      document.getElementById('date-summary-net-profit').textContent = `$${netProfit.toFixed(2)}`;
    }
  });

  // Reports functionality
  document.getElementById('generate-report').addEventListener('click', async function() {
    console.log('Botón de generar reporte clickeado');
    const reportType = document.getElementById('report-type').value;
    const reportDateRaw = document.getElementById('report-date').value;
    const reportDate = new Date(reportDateRaw + 'T00:00');

    let reportTitle = '';
    let startDate, endDate;

    if (reportType === 'weekly') {
      // Get the Monday of the week
      const day = reportDate.getDay();
      const diff = reportDate.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
      startDate = new Date(reportDate);
      startDate.setDate(diff);

      // Get the Sunday
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      reportTitle = `Reporte Semanal: ${startDate.getDate()} al ${endDate.getDate()} de ${monthsInSpanish[startDate.getMonth()]} de ${startDate.getFullYear()}`;
    } else {
      // Monthly report
      startDate = new Date(reportDate.getFullYear(), reportDate.getMonth(), 1);
      endDate = new Date(reportDate.getFullYear(), reportDate.getMonth() + 1, 0);

      reportTitle = `Reporte Mensual: ${monthsInSpanish[startDate.getMonth()]} de ${startDate.getFullYear()}`;
    }

    const startDateStr = getLocalDateKey(startDate);
    const endDateStr = getLocalDateKey(endDate);

    console.log('Generando reporte para el rango:', startDateStr, 'a', endDateStr);

    try {
      // Fetch report data from server
      console.log('Obteniendo datos del reporte del servidor...');
      const response = await fetch(`${API_URL}/reports?startDate=${startDateStr}&endDate=${endDateStr}`);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const reportData = await response.json();
      console.log('Datos del reporte recibidos:', reportData);

      // Calculate totals
      let totalSales = 0;
      let totalExpenses = 0;
      let totalBakeryExpenses = 0;

      // Process sales data
      reportData.sales.forEach(sale => {
        totalSales += sale.amount;
      });

      // Process expenses data
      reportData.expenses.forEach(expense => {
        totalExpenses += expense.price;
        if (expense.belongsToBakery) {
          totalBakeryExpenses += expense.price;
        }
      });

      // Calculate profit
      const grossProfit = totalSales - totalExpenses;
      const netProfit = totalSales - totalBakeryExpenses;

      // Update report title
      document.getElementById('report-title').textContent = reportTitle;

      // Update table values
      document.getElementById('report-total-sales').textContent = `$${totalSales.toFixed(2)}`;
      document.getElementById('report-total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
      document.getElementById('report-total-bakery-expenses').textContent = `$${totalBakeryExpenses.toFixed(2)}`;
      document.getElementById('report-gross-profit').textContent = `$${grossProfit.toFixed(2)}`;
      document.getElementById('report-net-profit').textContent = `$${netProfit.toFixed(2)}`;

      // Show report
      document.getElementById('report-results').classList.remove('hidden');
    } catch (error) {
      console.error('Error generating report:', error);
      showError('Error al generar el reporte. Intentando usar datos locales...');

      // Intentar generar informe con datos locales
      try {
        console.log('Generando reporte con datos locales...');

        let totalSales = 0;
        let totalExpenses = 0;
        let totalBakeryExpenses = 0;

        // Recorrer cada día en el rango
        for (let d = new Date(startDate.getTime()); d <= endDate; d.setDate(d.getDate() + 1)) {
          const dateStr = getLocalDateKey(d);

          // Obtener ventas del localStorage
          const dateSales = parseFloat(localStorage.getItem(`sales_${dateStr}`)) || 0;
          totalSales += dateSales;

          // Obtener gastos del localStorage
          const dateExpenses = JSON.parse(localStorage.getItem(`expenses_${dateStr}`)) || [];
          dateExpenses.forEach(expense => {
            totalExpenses += expense.price;
            if (expense.belongsToBakery) {
              totalBakeryExpenses += expense.price;
            }
          });
        }

        // Calcular ganancias
        const grossProfit = totalSales - totalExpenses;
        const netProfit = totalSales - totalBakeryExpenses;

        // Actualizar título del reporte
        document.getElementById('report-title').textContent = reportTitle;

        // Actualizar valores de la tabla
        document.getElementById('report-total-sales').textContent = `$${totalSales.toFixed(2)}`;
        document.getElementById('report-total-expenses').textContent = `$${totalExpenses.toFixed(2)}`;
        document.getElementById('report-total-bakery-expenses').textContent = `$${totalBakeryExpenses.toFixed(2)}`;
        document.getElementById('report-gross-profit').textContent = `$${grossProfit.toFixed(2)}`;
        document.getElementById('report-net-profit').textContent = `$${netProfit.toFixed(2)}`;

        // Mostrar reporte
        document.getElementById('report-results').classList.remove('hidden');
      } catch (localError) {
        console.error('Error generating local report:', localError);
        showError('Error al generar el reporte con datos locales.');
      }
    }
  });

  // Export CSV
  document.getElementById('export-csv').addEventListener('click', async function() {
    console.log('Botón de exportar CSV clickeado');
    const reportType = document.getElementById('report-type').value;
    const reportDateRaw = document.getElementById('report-date').value;
    const reportDate = new Date(reportDateRaw + 'T00:00');

    let reportTitle = '';
    let startDate, endDate;

    if (reportType === 'weekly') {
      const day = reportDate.getDay();
      const diff = reportDate.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(reportDate);
      startDate.setDate(diff);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      reportTitle = `Reporte_Semanal_${startDate.toISOString().split('T')[0]}_${endDate.toISOString().split('T')[0]}`;
    } else {
      startDate = new Date(reportDate.getFullYear(), reportDate.getMonth(), 1);
      endDate = new Date(reportDate.getFullYear(), reportDate.getMonth() + 1, 0);

      reportTitle = `Reporte_Mensual_${monthsInSpanish[startDate.getMonth()]}_${startDate.getFullYear()}`;
    }

    const startDateStr = getLocalDateKey(startDate);
    const endDateStr = getLocalDateKey(endDate);

    console.log('Exportando CSV para el rango:', startDateStr, 'a', endDateStr);

    try {
      // Fetch report data from server
      console.log('Obteniendo datos para CSV del servidor...');
      const response = await fetch(`${API_URL}/reports?startDate=${startDateStr}&endDate=${endDateStr}`);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const reportData = await response.json();
      console.log('Datos para CSV recibidos:', reportData);

      // Create a map of sales by date for easy lookup
      const salesByDate = {};
      reportData.sales.forEach(sale => {
        salesByDate[sale.date] = sale.amount;
      });

      // Group expenses by date
      const expensesByDate = {};
      reportData.expenses.forEach(expense => {
        if (!expensesByDate[expense.date]) {
          expensesByDate[expense.date] = [];
        }
        expensesByDate[expense.date].push(expense);
      });

      // Create CSV content
      let csvContent = 'data:text/csv;charset=utf-8,';
      csvContent += 'Fecha,Ventas,Gastos Totales,Gastos Panadería,Ganancia Bruta,Ganancia Neta\n';

      // Loop through each day in the range
      for (let d = new Date(startDate.getTime()); d <= endDate; d.setDate(d.getDate() + 1)) {
        const date = new Date(d);
        const dateStr = getLocalDateKey(date);
        const readableDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        // Get data for this date
        const dateSales = salesByDate[dateStr] || 0;
        const dateExpenses = expensesByDate[dateStr] || [];
        const dateExpensesTotal = dateExpenses.reduce((total, expense) => total + expense.price, 0);
        const dateBakeryExpensesTotal = dateExpenses
          .filter(expense => expense.belongsToBakery)
          .reduce((total, expense) => total + expense.price, 0);

        const dateGrossProfit = dateSales - dateExpensesTotal;
        const dateNetProfit = dateSales - dateBakeryExpensesTotal;

        // Add to CSV
        csvContent += `${readableDate},${dateSales.toFixed(2)},${dateExpensesTotal.toFixed(2)},${dateBakeryExpensesTotal.toFixed(2)},${dateGrossProfit.toFixed(2)},${dateNetProfit.toFixed(2)}\n`;
      }

      // Add totals row
      const totalSales = parseFloat(document.getElementById('report-total-sales').textContent.replace('$', ''));
      const totalExpenses = parseFloat(document.getElementById('report-total-expenses').textContent.replace('$', ''));
      const totalBakeryExpenses = parseFloat(document.getElementById('report-total-bakery-expenses').textContent.replace('$', ''));
      const grossProfit = parseFloat(document.getElementById('report-gross-profit').textContent.replace('$', ''));
      const netProfit = parseFloat(document.getElementById('report-net-profit').textContent.replace('$', ''));

      csvContent += `TOTALES,${totalSales.toFixed(2)},${totalExpenses.toFixed(2)},${totalBakeryExpenses.toFixed(2)},${grossProfit.toFixed(2)},${netProfit.toFixed(2)}\n`;

      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `${reportTitle}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showError('Error al exportar CSV. Intentando usar datos locales...');

      try {
        // Crear CSV con datos locales
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'Fecha,Ventas,Gastos Totales,Gastos Panadería,Ganancia Bruta,Ganancia Neta\n';

        let totalSales = 0;
        let totalExpenses = 0;
        let totalBakeryExpenses = 0;

        // Recorrer cada día en el rango
        for (let d = new Date(startDate.getTime()); d <= endDate; d.setDate(d.getDate() + 1)) {
          const date = new Date(d);
          const dateStr = getLocalDateKey(date);
          const readableDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

          // Obtener datos locales para esta fecha
          const dateSales = parseFloat(localStorage.getItem(`sales_${dateStr}`)) || 0;
          const dateExpenses = JSON.parse(localStorage.getItem(`expenses_${dateStr}`)) || [];
          const dateExpensesTotal = dateExpenses.reduce((total, expense) => total + expense.price, 0);
          const dateBakeryExpensesTotal = dateExpenses
            .filter(expense => expense.belongsToBakery)
            .reduce((total, expense) => total + expense.price, 0);

          const dateGrossProfit = dateSales - dateExpensesTotal;
          const dateNetProfit = dateSales - dateBakeryExpensesTotal;

          // Sumar a los totales
          totalSales += dateSales;
          totalExpenses += dateExpensesTotal;
          totalBakeryExpenses += dateBakeryExpensesTotal;

          // Añadir a CSV
          csvContent += `${readableDate},${dateSales.toFixed(2)},${dateExpensesTotal.toFixed(2)},${dateBakeryExpensesTotal.toFixed(2)},${dateGrossProfit.toFixed(2)},${dateNetProfit.toFixed(2)}\n`;
        }

        // Calcular ganancias totales
        const grossProfit = totalSales - totalExpenses;
        const netProfit = totalSales - totalBakeryExpenses;

        // Añadir fila de totales
        csvContent += `TOTALES,${totalSales.toFixed(2)},${totalExpenses.toFixed(2)},${totalBakeryExpenses.toFixed(2)},${grossProfit.toFixed(2)},${netProfit.toFixed(2)}\n`;

        // Crear enlace de descarga
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${reportTitle}_local.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (localError) {
        console.error('Error exporting local CSV:', localError);
        showError('Error al exportar CSV con datos locales.');
      }
    }
  });

  // Función de migración para datos existentes en localStorage
  async function migrateDataFromLocalStorage() {
    // Verificar si ya se realizó la migración
    if (localStorage.getItem('dataMigrated') === 'true') {
      console.log('La migración ya se realizó anteriormente.');
      return;
    }

    console.log('Iniciando migración de datos desde localStorage...');

    try {
      // Obtener todas las claves de localStorage
      const keys = Object.keys(localStorage);
      const expenseKeys = keys.filter(key => key.startsWith('expenses_'));
      const salesKeys = keys.filter(key => key.startsWith('sales_'));

      // Migrar gastos
      for (const key of expenseKeys) {
        const date = key.replace('expenses_', '');
        const expenses = JSON.parse(localStorage.getItem(key)) || [];

        console.log(`Migrando ${expenses.length} gastos para la fecha ${date}...`);

        for (const expense of expenses) {
          try {
            await fetch(`${API_URL}/expenses`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                name: expense.name,
                price: expense.price,
                belongsToBakery: expense.belongsToBakery,
                date: date
              })
            });
          } catch (e) {
            console.error(`Error migrando gasto: ${e.message}`);
          }
        }
      }

         // Migrar ventas
      for (const key of salesKeys) {
        const date = key.replace('sales_', '');
        const amount = parseFloat(localStorage.getItem(key)) || 0;

        console.log(`Migrando venta de $${amount} para la fecha ${date}...`);

        try {
          await fetch(`${API_URL}/sales`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date, amount })
          });
        } catch (e) {
          console.error(`Error migrando venta: ${e.message}`);
        }
      }

      // Marcar como migrado
      localStorage.setItem('dataMigrated', 'true');
      console.log('Migración completada.');
    } catch (error) {
      console.error('Error durante la migración:', error);
    }
  }

  // Intentar migrar datos existentes cuando el usuario esté logueado
  if (sessionStorage.getItem('panaderiaNubesLoggedIn') === 'true') {
    // Esperar un poco para asegurarse de que el servidor esté listo
    setTimeout(() => {
      migrateDataFromLocalStorage();
    }, 3000);
  }
});