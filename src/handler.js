const {
  nanoid
} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage ? true : false;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku'
    });
    response.code(400);
    return response;
  }
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
    });
    response.code(400);
    return response;
  }

  books.push(newBook);
  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    // response.header('Access-Control-Allow-Origin', 'http://notesapp-v1.dicodingacademy.com');
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const {reading, finished, name } = request.query;

  const bookReading = books.filter(br => br.reading == reading);
  if (reading == 1){
    return{
      status: 'success',
      data: {
        books: bookReading.map(book => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        })
        )
      }
    };
  } else if (reading == 0){
    return{
      status: 'success',
      data: {
        books: bookReading.map(book => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        })
        )
      }
    };
  }

  const bookFinished = books.filter(bf => bf.finished == finished);
  if (finished == 1){
    return{
      status: 'success',
      data: {
        books: bookFinished.map(book => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        })
        )
      }
    };
  } else if (finished == 0){
    return{
      status: 'success',
      data: {
        books: bookFinished.map(book => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher
        })
        )
      }
    };
  }

  if (name !== undefined){
    const response = h.response({
      
      status: 'success',
      data: {
        books:
        books.filter(bn => bn.name.toLowerCase().includes(name.toLowerCase()))
          .map(n => ({
            id: n.id,
            name: n.name,
            publisher: n.publisher
          }))
      }
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: books.map(b => ({
        id: b.id,
        name: b.name,
        publisher: b.publisher
      }))
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const {
    id
  } = request.params;
  const book = books.filter((b) => b.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookHandler = (request, h) => {
  const {
    bookId
  } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading
  } = request.payload;

  const updatedAt = new Date().toISOString();


  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }
  
  // console.log(hasNoName, 'ok');
  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }
  
  const index = books.findIndex((book) => book.id === bookId);
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });
    response.code(200);
    return response;
  }
  
  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const deleteBookHandler = (request, h) => {
  const { bookId } = request.params;
 
  const index = books.findIndex((book) => book.id === bookId);
 
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }
 
  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

const getAllReadingBooksHandler = (request, h) => {
  const reading = request.query;
 
  // const index = books.findIndex((book) => book.reading === reading);
  const bookReading = books.filter((b) => b.reading === reading);

  if (reading === 1) {
    return {
      status: 'success',
      data: {
        bookReading,
      },
    };
  }
  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};


module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookHandler,
  deleteBookHandler,
  getAllReadingBooksHandler
};