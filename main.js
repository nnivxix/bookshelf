const books = [];
let bookContent = {};
let isEditing = false;

const title = document.getElementById('inputBookTitle');
const author = document.getElementById('inputBookAuthor');
const year = document.getElementById('inputBookYear')
const isComplete = document.getElementById('inputBookIsComplete');
const searchBookTitle = document.getElementById('searchBookTitle')
const bookSubmit = document.getElementById('bookSubmit');

function loadDataFromStorage() {
  const serializedData = localStorage.getItem('books');
  let data = JSON.parse(serializedData);
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event('render-book'))
}

function addBook() {
  books.push({
    id: Math.random().toString(16).substr(2, 8),
    title: title.value,
    author: author.value,
    year: parseInt(year.value),
    isComplete: isComplete.checked
  })
  alert('Mantap, Buku telah berhasil ditambah')
  updateView()
}

function checkedBook(id){
  bookContent = findBookById(id)
  bookContent.isComplete = !bookContent.isComplete
  updateView()
}

function deleteBook(id, namabuku) {
  const question = confirm('Apakah kamu yakin ingin menghapus buku ' + namabuku + '?')
  if (question) books.splice(getIndexBook(id),1);
  updateView()
}

function editBook(id) {
  isEditing = true;
  bookContent = findBookById(id)

  title.value = bookContent.title;
  year.value = bookContent.year;
  author.value = bookContent.author
  isComplete.checked = bookContent.isComplete

  bookSubmit.innerText = "Perbaharui Buku"
  window.location.href = '#inputBookTitle'
}

function updateBook(){
  bookContent = {
    id: bookContent.id,
    title: title.value,
    author: author.value,
    year: parseInt(year.value),
    isComplete: isComplete.checked
  }

  books.splice(getIndexBook(bookContent.id), 1, bookContent)
  isEditing = false
  alert('Mantap, Buku ' +'berhasil diubah' );
  updateView()
}

function getIndexBook(id) {
  return books.findIndex(book => book.id == id)
}

function findBookById(id) {
  return books.find(book => book.id == id)
}

function updateView() {
  document.dispatchEvent(new Event('render-book'))
  localStorage.setItem('books', JSON.stringify(books)) 
  return;
}

function resetValue() {
  title.value = "";
  author.value = "";
  year.value = "";
  isComplete.checked = false;
  bookContent = {};
  searchBookTitle.value = "";
}

function findBookByName(title) {
  const bookItem = document.getElementsByClassName('book_item');
  for (const book of bookItem) {
    const itemTitle = book.querySelector(".item-title")
    if(itemTitle.textContent.toLowerCase().includes(title.value)) {
      book.style.display = 'block'
    } else {
      book.style.display = 'none'
    }
  }
  return;
}

function renderBook(book, selector){
    if (book.length > 0) {
      selector.innerHTML = book.map(book => {
        return `
        <article class="book_item ${book.isComplete ? 'completed' : 'incompleted'}">
          <h3 class="item-title">${book.title}</h3>
          <p>${book.author} · ${book.year}</p>
          <div class="action">
            <button onClick="checkedBook('${book.id}')">${book.isComplete ? 'Tandai sedang dibaca': 'Tandai sudah dibaca'}</button>
            <button onClick="editBook('${book.id}')">Ubah Buku</button>
            <button onClick="deleteBook('${book.id}','${book.title}')">Hapus buku</button>
          </div>
        </article>
        `
      }).join('')
    } else {
      selector.innerHTML = '<p>Belum ada buku.</p>'
    }
  }


document.addEventListener('DOMContentLoaded', function() {
  const searchBook = document.getElementById('searchBook');
  searchBook.addEventListener('input', function(e) {
    e.preventDefault()
    findBookByName(searchBookTitle)
  })
  
  const formInput = document.getElementById('inputBook');
  formInput.addEventListener('submit', function(e) {
    e.preventDefault()
    isEditing ? updateBook() : addBook()

    resetValue()
  })
  loadDataFromStorage()
})

document.addEventListener('render-book', function() { 
  if (!isEditing) bookSubmit.innerText = "Tambahkan Buku";
  console.log(isEditing)
    const targetBookIncomplete = books.filter(book => book.isComplete == false);
    const targetBookComplete = books.filter(book => book.isComplete == true);
    
    renderBook(targetBookIncomplete, document.getElementById('incompleteBookshelfList'))
    renderBook(targetBookComplete, document.getElementById('completeBookshelfList'))
  
})