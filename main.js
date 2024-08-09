let users = [];
let filteredUsers = [];

// Загружаем данные пользователей с JSONPlaceholder
async function loadUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    users = data.map((user) => ({
      id: user.id,
      firstName: user.name.split(" ")[0],
      lastName: user.name.split(" ")[1] || "",
      age: Math.floor(Math.random() * 25) + 10,
      email: user.email,
      imageUrl: "default.png",
    }));

    // Загружаем изображения из localStorage, если они есть
    loadImagesFromLocalStorage();

    // Фильтруем и отображаем пользователей
    filterByAge();
  } catch (error) {
    console.error("Ошибка загрузки данных пользователей:", error);
  }
}

// Функция загрузки фотографий из localStorage
function loadImagesFromLocalStorage() {
  const storedImages = JSON.parse(localStorage.getItem("userPhotos")) || {};

  users.forEach((user) => {
    if (storedImages[user.id]) {
      user.imageUrl = storedImages[user.id];
    }
  });
}

// Функция отображения пользователей
function displayUsers(userList) {
  const userListContainer = document.getElementById("userList");
  userListContainer.innerHTML = "";
  userList.forEach((user) => {
    const userCard = document.createElement("div");
    userCard.classList.add("user-card");

    userCard.innerHTML = `
          <img src="${user.imageUrl}" alt="${user.firstName}">
          <div class="user-details">
              <h2>${user.firstName} ${user.lastName}</h2>
              <p>Возраст: ${user.age}</p>
              <p>Email: ${user.email}</p>
              <label class="upload-label" for="fileUpload-${user.id}">Загрузить фото</label>
              <input type="file" id="fileUpload-${user.id}" accept="image/*" onchange="uploadPhoto(${user.id}, event)">
          </div>
      `;

    userListContainer.appendChild(userCard);
  });
}

// Функция фильтрации пользователей
function filterByAge() {
  const ageFilter = document.getElementById("ageFilter").checked;
  if (ageFilter) {
    filteredUsers = users.filter((user) => user.age > 18);
  } else {
    filteredUsers = [...users];
  }
  sortUsers(); // Пересортировка после фильтрации
}

// Функция загрузки фотографий
function uploadPhoto(userId, event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const userIndex = users.findIndex((user) => user.id === userId);
      users[userIndex].imageUrl = e.target.result;

      // Сохраняем фото в localStorage
      let storedImages = JSON.parse(localStorage.getItem("userPhotos")) || {};
      storedImages[userId] = e.target.result;
      localStorage.setItem("userPhotos", JSON.stringify(storedImages));

      filterByAge(); // Обновление списка после загрузки фотографии
    };
    reader.readAsDataURL(file);
  }
}

// Функция сортировки пользователей
function sortUsers() {
  const sortOrder = document.getElementById("sortOrder").value;
  if (sortOrder === "name") {
    filteredUsers.sort((a, b) => a.firstName.localeCompare(b.firstName));
  } else if (sortOrder === "age") {
    filteredUsers.sort((a, b) => a.age - b.age);
  }
  displayUsers(filteredUsers);
}

// Делаем функции доступными глобально
window.loadUsers = loadUsers;
window.displayUsers = displayUsers;
window.filterByAge = filterByAge;
window.uploadPhoto = uploadPhoto;
window.sortUsers = sortUsers;

// Инициализация загрузки данных при загрузке страницы
document.addEventListener("DOMContentLoaded", loadUsers);
