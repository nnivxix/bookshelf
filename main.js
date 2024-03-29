const books = [];
let bookContent = {};
let bookTemp = {};
let isEditing = false;

const title = document.getElementById("inputBookTitle");
const author = document.getElementById("inputBookAuthor");
const year = document.getElementById("inputBookYear");
const isComplete = document.getElementById("inputBookIsComplete");
const searchBookTitle = document.getElementById("searchBookTitle");
const searchBook = document.getElementById("searchBook");
const clearSearch = document.getElementById("clearSearch");
const bookSubmit = document.getElementById("bookSubmit");
const formInput = document.getElementById("inputBook");
const inputSection = document.getElementById("input_section");
const bookItems = document.getElementsByClassName("book_item");
const inputBookYear = document.getElementById("inputBookYear");
/**
 *
 * Add clear search input
 *
 */
searchBookTitle.addEventListener("input", function () {
  if (searchBookTitle.value.length) {
    clearSearch.style.display = "block";
  } else {
    clearSearch.style.display = "none";
  }
});

clearSearch.addEventListener("click", function () {
  searchBookTitle.value = "";
  clearSearch.style.display = "none";
  inputSection.classList.remove("hidden");
  inputSection.classList.add("flex");
  filterByName("");
  document.dispatchEvent(new Event("render-book"));
});

/**
 *
 * Add keyboard event
 *
 */
window.addEventListener("keydown", function (event) {
  // when user click `ctrl + K`
  if ((event.ctrlKey && event.key === "k") || event.key === "K") {
    event.preventDefault();

    searchBookTitle.focus();
    return;
  }

  // when user click `ctrl + alt+ N`
  if (
    (event.ctrlKey && event.altKey && event.key === "n") ||
    event.key === "N"
  ) {
    event.preventDefault();
    if (!isEditing) {
      title.focus();
    }
    return;
  }
});

inputBookYear.addEventListener("keydown", function (event) {
  if (isNaN(event.key) && event.key !== "Backspace") {
    event.preventDefault();
  }
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem("books");
  let data = JSON.parse(serializedData);
  if (data) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event("render-book"));
}

function addBook() {
  books.push({
    id: Math.random().toString(16).substr(2, 8),
    title: title.value.trim(),
    author: author.value.trim(),
    year: parseInt(year.value),
    isComplete: isComplete.checked,
  });
  alert("Yayy, Buku telah berhasil ditambah.");
  updateView();
}

function checkedBook(id) {
  bookContent = findBookById(id);
  bookContent.isComplete = !bookContent.isComplete;

  showHideForm();
  resetValue();
  updateView();
}

function deleteBook(id, namabuku) {
  const question = confirm('Yakin nih mau menghapus buku: "' + namabuku + '"?');
  if (question) {
    books.splice(getIndexBook(id), 1);
    showHideForm();
    resetValue();
    updateView();
  }
}

function editBook(id) {
  isEditing = true;
  bookContent = findBookById(id);
  bookTemp = findBookById(id);

  title.value = bookContent.title;
  year.value = bookContent.year;
  author.value = bookContent.author;
  isComplete.checked = bookContent.isComplete;

  showHideForm();
  updateView();
  bookSubmit.innerText = "Perbaharui Buku";
  title.focus();
}

function updateBook() {
  bookContent = {
    id: bookContent.id,
    title: title.value.trim(),
    author: author.value.trim(),
    year: parseInt(year.value),
    isComplete: isComplete.checked,
  };

  isEditing = false;
  books.splice(getIndexBook(bookContent.id), 1, bookContent);

  if (
    bookTemp.title != title.value ||
    bookTemp.author != author.value ||
    bookTemp.year != year.value ||
    bookTemp.isComplete != isComplete.checked
  ) {
    alert("Mantap, buku berhasil diubah.");
  }
  updateView();
}

function getIndexBook(id) {
  return books.findIndex((book) => book.id == id);
}

function findBookById(id) {
  return books.find((book) => book.id == id);
}

function filterBookIscomplete(isComplete) {
  return filterByName(searchBookTitle.value)
    .filter((book) => book.isComplete == isComplete)
    .sort((a, b) =>
      a.title.toLowerCase() > b.title.toLowerCase()
        ? 1
        : b.title.toLowerCase() > a.title.toLowerCase()
        ? -1
        : 0
    );
}

const filterByName = (title) => {
  return books.filter((book) =>
    book.title.toLocaleLowerCase().includes(title.toLocaleLowerCase())
  );
};

function showHideForm() {
  if (inputSection.classList.contains("hidden")) {
    inputSection.classList.add("flex");
    inputSection.classList.remove("hidden");
  }
}

function updateView() {
  document.dispatchEvent(new Event("render-book"));
  localStorage.setItem("books", JSON.stringify(books));
  searchBookTitle.value = searchBookTitle.value;
  return;
}

function resetValue() {
  title.value = "";
  author.value = "";
  year.value = "";
  isComplete.checked = false;
  bookContent = {};
  bookTemp = {};
  // searchBookTitle.value = "";
}

function renderBook(book, selector) {
  if (book.length > 0) {
    selector.innerHTML = book
      .map((book) => {
        return `
        <article class="book_item ${
          book.isComplete ? "completed" : "incompleted"
        }">
          <h3 class="item-title">${book.title}</h3>
          <p>${book.author} · ${book.year}</p>
          <div class="action">
            <button onClick="checkedBook('${book.id}')">${
          book.isComplete ? "Tandai sedang dibaca" : "Tandai sudah dibaca"
        }</button>
            <button onClick="editBook('${book.id}')">Perbaharui Buku</button>
            <button class="deleteBook" onClick="deleteBook('${book.id}','${
          book.title
        }')">Hapus buku</button>
          </div>
        </article>
        `;
      })
      .join("");
  } else {
    selector.innerHTML = "<p>Belum ada buku.</p>";
  }
}

document.addEventListener("DOMContentLoaded", function () {
  searchBookTitle.addEventListener("input", function () {
    filterByName(searchBookTitle.value);
    document.dispatchEvent(new Event("render-book"));
  });

  formInput.addEventListener("submit", function (e) {
    e.preventDefault();
    isEditing ? updateBook() : addBook();
    resetValue();
  });

  loadDataFromStorage();
});

document.addEventListener("render-book", function () {
  if (!isEditing) bookSubmit.innerText = "Tambahkan Buku";

  renderBook(
    filterBookIscomplete(false),
    document.getElementById("incompleteBookshelfList")
  );
  renderBook(
    filterBookIscomplete(true),
    document.getElementById("completeBookshelfList")
  );
});
