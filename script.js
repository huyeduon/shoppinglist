const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');

let isEditMode = false;

function displayItems() {
  const itemsFromStroage = getItemsFromStorage();
  itemsFromStroage.forEach((item) => {
    addItemToDOM(item);
  });
  checkUI();
}

function onAddItemSubmit(e) {
  e.preventDefault();
  // Validate input
  const newItem = itemInput.value;
  if (newItem === '') {
    alert('Please add an item');
    return;
  }
  // Check for edit Mode
  // if in edit mode: remove it from localstorage, remove from DOM and update edit mode flag to false
  if (isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');

    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.classList.remove('edit-mode');
    itemToEdit.remove();
    isEditMode = false;
  } else {
    if (checkIfItemExists(newItem)) {
      alert('That item already exists');
      return;
    }
  }

  // Create item DOM element
  addItemToDOM(newItem);

  // Add item to local storage
  addItemToStorage(newItem);
  // check the UI again once we add an item

  itemInput.value = '';
  checkUI();
}

function addItemToDOM(item) {
  // create li elment
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));
  // create a button with icon
  const button = createButton('remove-item btn-link text-red');
  // at bottom to li element
  li.appendChild(button);
  // add li to item list
  itemList.appendChild(li);
}

// Function to create a button
function createButton(classes) {
  const button = document.createElement('button');
  button.className = classes;
  const icon = createIcon('fa-solid fa-xmark');
  button.appendChild(icon);
  return button;
}

// Function to create a icon
function createIcon(classes) {
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function addItemToStorage(item) {
  const itemsFromStorage = getItemsFromStorage();

  // add new item to array
  itemsFromStorage.push(item);

  // convert to JSON string and set to localStorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage() {
  // itemsFromStorage is an array
  let itemsFromStorage;

  if (localStorage.getItem('items') === null) {
    itemsFromStorage = [];
  } else {
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}

function onClickItem(e) {
  if (e.target.parentElement.classList.contains('remove-item')) {
    removeItem(e.target.parentElement.parentElement);
  } else if (e.target.tagName.toLowerCase() === 'li') {
    setItemToEdit(e.target);
    console.log(e.target);
  }
}

// function to prevent adding duplicate item
function checkIfItemExists(item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}

function setItemToEdit(item) {
  // item is a li element
  isEditMode = true;
  // remove edit mode to make sure if we click on 2nd item the previous item will no longer in edit
  itemList
    .querySelectorAll('li')
    .forEach((i) => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');
  formBtn.innerHTML = '<i class="fa-solid fa-pen"></i>  Update Item';
  formBtn.style.backgroundColor = '#228b22';
  itemInput.value = item.textContent;
}

function removeItem(item) {
  if (confirm('Are you sure?')) {
    // Remove item from DOM
    item.remove();
    // Remove item from storage
    removeItemFromStorage(item.textContent);
    checkUI();
  }
}

function removeItemFromStorage(item) {
  // item is a text
  let itemsFromStorage = getItemsFromStorage();
  //Filter out item to be removed
  // return new array
  itemsFromStorage = itemsFromStorage.filter((i) => i != item);

  // Re-set to localstorage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems() {
  while (itemList.firstChild) {
    itemList.removeChild(itemList.firstChild);
  }
  // Clear from local storage
  localStorage.removeItem('items');
  checkUI();
}

function filterItems(e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();
  items.forEach((item) => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if (itemName.includes(text)) {
      // if (itemName.indexOf(text) !== -1)
      item.style.display = 'flex';
    } else {
      item.style.display = 'none';
    }
  });
}

function checkUI() {
  itemInput.value = '';
  const items = itemList.querySelectorAll('li');
  if (items.length === 0) {
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  } else {
    clearBtn.style.display = 'block';
    itemFilter.style.display = 'block';
  }

  formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';
  isEditMode = false;
}

// Initialize app
function init() {
  // Event Listeners
  itemForm.addEventListener('submit', onAddItemSubmit);
  itemList.addEventListener('click', onClickItem);
  clearBtn.addEventListener('click', clearItems);
  itemFilter.addEventListener('input', filterItems);
  document.addEventListener('DOMContentLoaded', displayItems);
  checkUI();
}

init();
