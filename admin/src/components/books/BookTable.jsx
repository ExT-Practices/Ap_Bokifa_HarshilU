import { Link } from "react-router-dom";

const BookTable = ({ books }) => {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4">Title</th>
            <th>Author</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-b">
              <td className="p-4">{book.title}</td>
              <td>{book.author_name}</td>
              <td>₹{book.price}</td>
              <td>{book.stock}</td>

              <td className="space-x-2">
                <Link
                  to={`/admin/books/edit/${book.id}`}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </Link>

                <button className="bg-red-500 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookTable;