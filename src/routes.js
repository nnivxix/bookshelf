const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookHandler,
  deleteBookHandler,
  // getAllReadingBooksHandler
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookByIdHandler
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: editBookHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: deleteBookHandler,
  },
  // {
  //   method: 'GET',
  //   path: '/books',
  //   handler: getAllReadingBooksHandler
  // }
];
 
module.exports = routes;