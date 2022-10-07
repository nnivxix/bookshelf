const books = [];

const title = document.getElementById('inputBookTitle');
const author = document.getElementById('inputBookAuthor');
const year = document.getElementById('inputBookYear')
const isComplete = document.getElementById('inputBookIsComplete');

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

// Add Books
function addBook() {
  books.push({
    id: Math.random().toString(16).substr(2, 8),
    title: title.value,
    author: author.value,
    year: year.value,
    isComplete: isComplete.checked
  })
  document.dispatchEvent(new Event('render-book'))
  localStorage.setItem('books', JSON.stringify(books))
}

// Mark book is completed or not
function checkedBook(id){
  const targetBook = books.find(book => book.id == id)
  
  targetBook.isComplete = !targetBook.isComplete
  document.dispatchEvent(new Event('render-book'))
  localStorage.setItem('books', JSON.stringify(books))

}

// Delete book
function deleteBook(id, namabuku) {
  const targetBook = books.findIndex(book => book.id == id)
  const question = confirm('Apakah kamu yakin ingin menghapus buku ' + namabuku + '?')
  if (question) books.splice(targetBook,1);
  document.dispatchEvent(new Event('render-book'))
  localStorage.setItem('books', JSON.stringify(books)) 
}


// find book by name
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
}

// render books
function renderBook(book, selector){
    if (book.length > 0) {
      selector.innerHTML = book.map(book => {
        return `
        <article class="book_item ${book.isComplete ? 'completed' : 'incompleted'}">
          <h3 class="item-title">${book.title}</h3>
          <p>${book.author} · ${book.year}</p>
          <div class="action">
            <button class="green" onClick="checkedBook('${book.id}')">${book.isComplete ? 'Tandai sedang dibaca': 'Tandai sudah dibaca'}</button>
            <button class="red" onClick="deleteBook('${book.id}', '${book.title}')">Hapus buku</button>
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
  const searchBookTitle = document.getElementById('searchBookTitle')
  
  searchBook.addEventListener('submit', function(e) {
    e.preventDefault()
    findBookByName(searchBookTitle)
  })
  
  const formInput = document.getElementById('inputBook');
  formInput.addEventListener('submit', function(e) {
    e.preventDefault()
    addBook()
    title.value = "";
    author.value = "";
    year.value = "";
    isComplete.checked = false;
  })
  loadDataFromStorage()
})

document.addEventListener('render-book', function() { 
    const targetBookIncomplete = books.filter(book => book.isComplete == false);
    const targetBookComplete = books.filter(book => book.isComplete == true);
    
    renderBook(targetBookIncomplete, document.getElementById('incompleteBookshelfList'))
    renderBook(targetBookComplete, document.getElementById('completeBookshelfList'))
  
})