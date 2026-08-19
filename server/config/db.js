const mysql = require("mysql2");

let isConnected = false;

const initialAuthors = [
  { author_id: 1, author_name: "J.K. Rowling", email: "rowling@example.com", phone: "+1 555-0101", bio: "British author best known for writing the Harry Potter fantasy series." },
  { author_id: 2, author_name: "George R.R. Martin", email: "grrm@example.com", phone: "+1 555-0102", bio: "American novelist and short story writer, author of A Song of Ice and Fire." },
  { author_id: 3, author_name: "James Clear", email: "james@jamesclear.com", phone: "+1 555-0103", bio: "Author of Atomic Habits, focused on habits, decision making, and continuous improvement." },
  { author_id: 4, author_name: "Robert Kiyosaki", email: "robert@richdad.com", phone: "+1 555-0104", bio: "American businessman and author of Rich Dad Poor Dad." }
];

const initialBooks = [
  { book_id: 1, author_id: 1, author_name: "J.K. Rowling", title: "Harry Potter and the Philosopher's Stone", isbn: "978-0747532699", price: "499.00", stock: 25, description: "A young wizard discovers his magical heritage on his eleventh birthday.", image: "/uploads/harry_potter.webp", category_id: 1, created_at: new Date() },
  { book_id: 2, author_id: 2, author_name: "George R.R. Martin", title: "A Game of Thrones", isbn: "978-0553103540", price: "699.00", stock: 18, description: "Noble families fight for control of the mythical land of Westeros.", image: "/uploads/game_of_thrones.webp", category_id: 1, created_at: new Date() },
  { book_id: 3, author_id: 3, author_name: "James Clear", title: "Atomic Habits", isbn: "978-0735211292", price: "550.00", stock: 40, description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones.", image: "/uploads/atomic_habits.webp", category_id: 2, created_at: new Date() },
  { book_id: 4, author_id: 4, author_name: "Robert Kiyosaki", title: "Rich Dad Poor Dad", isbn: "978-1612680194", price: "399.00", stock: 30, description: "What the Rich Teach Their Kids About Money That the Poor and Middle Class Do Not!", image: "/uploads/rich_dad.webp", category_id: 2, created_at: new Date() }
];

const initialBlogs = [
  { blog_id: 1, title: "10 Books You Must Read in 2026", slug: "10-books-you-must-read-in-2026", content: "Discover the best selling and most inspiring books of this year to elevate your reading list.", image: "/uploads/blog1.webp", author: "Editorial Team", status: "Published", created_at: new Date(), updated_at: new Date() },
  { blog_id: 2, title: "How Daily Reading Enhances Productivity", slug: "how-daily-reading-enhances-productivity", content: "Learn how taking 30 minutes a day to read can reshape your focus and mental clarity.", image: "/uploads/blog2.webp", author: "James Clear", status: "Published", created_at: new Date(), updated_at: new Date() }
];

const fallbackStore = {
  authors: [...initialAuthors],
  books: [...initialBooks],
  blogs: [...initialBlogs],
  nextAuthorId: 5,
  nextBookId: 5,
  nextBlogId: 3
};

const mysqlConnection = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "bookify",
});

mysqlConnection.connect((err) => {
  if (err) {
    console.log("⚠️ MySQL Not Connected (Using Fallback Data Engine):", err.message);
    isConnected = false;
  } else {
    console.log("✅ MySQL Connected Successfully");
    isConnected = true;
  }
});

const executeFallback = (sql, params, callback) => {
  const queryStr = typeof sql === "string" ? sql : "";
  const args = Array.isArray(params) ? params : [];

  // DASHBOARD STATS
  if (queryStr.includes("COUNT(*) FROM books") || queryStr.includes("stats")) {
    const res = [{
      books: fallbackStore.books.length,
      authors: fallbackStore.authors.length,
      blogs: fallbackStore.blogs.length,
      categories: 4
    }];
    return callback(null, res);
  }

  // GET AUTHORS
  if (queryStr.includes("sp_get_authors") || queryStr.includes("FROM authors")) {
    if (queryStr.includes("WHERE author_id = ?") || queryStr.includes("sp_get_author_by_id")) {
      const id = Number(args[0]);
      const found = fallbackStore.authors.filter(a => Number(a.author_id) === id);
      return callback(null, queryStr.includes("sp_") ? [found] : found);
    }
    const sorted = [...fallbackStore.authors].sort((a, b) => b.author_id - a.author_id);
    return callback(null, queryStr.includes("sp_") ? [sorted] : sorted);
  }

  // ADD AUTHOR
  if (queryStr.includes("sp_add_author") || queryStr.includes("INSERT INTO authors")) {
    const [name, email, phone, bio] = args;
    const newAuthor = {
      author_id: fallbackStore.nextAuthorId++,
      author_name: name,
      email: email || "",
      phone: phone || "",
      bio: bio || ""
    };
    fallbackStore.authors.push(newAuthor);
    return callback(null, { insertId: newAuthor.author_id });
  }

  // UPDATE AUTHOR
  if (queryStr.includes("sp_update_author") || queryStr.includes("UPDATE authors")) {
    let id, name, email, phone, bio;
    if (queryStr.includes("sp_update_author")) {
      [id, name, email, phone, bio] = args;
    } else {
      [name, email, phone, bio, id] = args;
    }
    const idx = fallbackStore.authors.findIndex(a => Number(a.author_id) === Number(id));
    if (idx !== -1) {
      fallbackStore.authors[idx] = {
        ...fallbackStore.authors[idx],
        author_name: name,
        email: email || "",
        phone: phone || "",
        bio: bio || ""
      };

      // update author_name in books
      fallbackStore.books.forEach(b => {
        if (Number(b.author_id) === Number(id)) {
          b.author_name = name;
        }
      });
      return callback(null, { affectedRows: 1 });
    }
    return callback(null, { affectedRows: 0 });
  }

  // DELETE AUTHOR
  if (queryStr.includes("sp_delete_author") || queryStr.includes("DELETE FROM authors")) {
    const id = Number(args[0]);
    const idx = fallbackStore.authors.findIndex(a => Number(a.author_id) === id);
    if (idx !== -1) {
      fallbackStore.authors.splice(idx, 1);
      return callback(null, { affectedRows: 1 });
    }
    return callback(null, { affectedRows: 0 });
  }

  // GET BOOKS
  if (queryStr.includes("sp_get_books") || queryStr.includes("FROM books")) {
    if (queryStr.includes("sp_get_book_by_id")) {
      const id = Number(args[0]);
      const found = fallbackStore.books.filter(b => Number(b.book_id) === id);
      return callback(null, [found]);
    }
    const sorted = [...fallbackStore.books].sort((a, b) => b.book_id - a.book_id);
    return callback(null, [sorted]);
  }

  // ADD BOOK
  if (queryStr.includes("sp_add_book") || queryStr.includes("INSERT INTO books")) {
    const [author_id, title, isbn, price, stock, description, image] = args;
    const author = fallbackStore.authors.find(a => Number(a.author_id) === Number(author_id));
    const newBook = {
      book_id: fallbackStore.nextBookId++,
      author_id: Number(author_id),
      author_name: author ? author.author_name : "Unknown Author",
      title,
      isbn: isbn || "N/A",
      price: price || "0",
      stock: Number(stock) || 0,
      description: description || "",
      image: image || "",
      created_at: new Date()
    };
    fallbackStore.books.push(newBook);
    return callback(null, { insertId: newBook.book_id });
  }

  // UPDATE BOOK
  if (queryStr.includes("sp_update_book") || queryStr.includes("UPDATE books")) {
    const [id, author_id, title, isbn, price, stock, description, image] = args;
    const idx = fallbackStore.books.findIndex(b => Number(b.book_id) === Number(id));
    if (idx !== -1) {
      const author = fallbackStore.authors.find(a => Number(a.author_id) === Number(author_id));
      fallbackStore.books[idx] = {
        ...fallbackStore.books[idx],
        author_id: Number(author_id),
        author_name: author ? author.author_name : fallbackStore.books[idx].author_name,
        title: title || fallbackStore.books[idx].title,
        isbn: isbn || fallbackStore.books[idx].isbn,
        price: price || fallbackStore.books[idx].price,
        stock: stock !== undefined ? Number(stock) : fallbackStore.books[idx].stock,
        description: description || fallbackStore.books[idx].description,
        image: image || fallbackStore.books[idx].image
      };
      return callback(null, { affectedRows: 1 });
    }
    return callback(null, { affectedRows: 0 });
  }

  // DELETE BOOK
  if (queryStr.includes("sp_delete_book") || queryStr.includes("DELETE FROM books")) {
    const id = Number(args[0]);
    const idx = fallbackStore.books.findIndex(b => Number(b.book_id) === id || Number(b.id) === id);
    if (idx !== -1) {
      fallbackStore.books.splice(idx, 1);
      return callback(null, { affectedRows: 1 });
    }
    return callback(null, { affectedRows: 0 });
  }

  // GET BLOGS
  if (queryStr.includes("sp_get_blogs") || queryStr.includes("FROM blogs")) {
    if (queryStr.includes("sp_get_blog_by_id")) {
      const id = Number(args[0]);
      const found = fallbackStore.blogs.filter(b => Number(b.blog_id) === id);
      return callback(null, [found]);
    }
    const sorted = [...fallbackStore.blogs].sort((a, b) => b.blog_id - a.blog_id);
    return callback(null, [sorted]);
  }

  // ADD BLOG
  if (queryStr.includes("sp_add_blog") || queryStr.includes("INSERT INTO blogs")) {
    const [title, slug, content, image, author, status] = args;
    const newBlog = {
      blog_id: fallbackStore.nextBlogId++,
      title,
      slug: slug || title?.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      content: content || "",
      image: image || "",
      author: author || "Admin",
      status: status || "Published",
      created_at: new Date(),
      updated_at: new Date()
    };
    fallbackStore.blogs.push(newBlog);
    return callback(null, { insertId: newBlog.blog_id });
  }

  // UPDATE BLOG
  if (queryStr.includes("sp_update_blog") || queryStr.includes("UPDATE blogs")) {
    const [id, title, slug, content, image, author, status] = args;
    const idx = fallbackStore.blogs.findIndex(b => Number(b.blog_id) === Number(id));
    if (idx !== -1) {
      fallbackStore.blogs[idx] = {
        ...fallbackStore.blogs[idx],
        title: title || fallbackStore.blogs[idx].title,
        slug: slug || fallbackStore.blogs[idx].slug,
        content: content || fallbackStore.blogs[idx].content,
        image: image || fallbackStore.blogs[idx].image,
        author: author || fallbackStore.blogs[idx].author,
        status: status || fallbackStore.blogs[idx].status,
        updated_at: new Date()
      };
      return callback(null, { affectedRows: 1 });
    }
    return callback(null, { affectedRows: 0 });
  }

  // DELETE BLOG
  if (queryStr.includes("sp_delete_blog") || queryStr.includes("DELETE FROM blogs")) {
    const id = Number(args[0]);
    const idx = fallbackStore.blogs.findIndex(b => Number(b.blog_id) === id);
    if (idx !== -1) {
      fallbackStore.blogs.splice(idx, 1);
      return callback(null, { affectedRows: 1 });
    }
    return callback(null, { affectedRows: 0 });
  }

  return callback(null, []);
};

const db = {
  query: (sql, params, callback) => {
    if (typeof params === "function") {
      callback = params;
      params = [];
    }

    if (!isConnected) {
      return executeFallback(sql, params, callback);
    }

    try {
      mysqlConnection.query(sql, params, (err, results) => {
        if (err) {
          console.log("⚠️ MySQL Query failed, using fallback engine:", err.message);
          return executeFallback(sql, params, callback);
        }
        callback(null, results);
      });
    } catch (e) {
      executeFallback(sql, params, callback);
    }
  }
};

module.exports = db;