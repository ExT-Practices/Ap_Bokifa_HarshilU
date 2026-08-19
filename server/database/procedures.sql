-- author Procedures
-- add_author..............................................................................................................................................
DELIMITER $$

CREATE PROCEDURE sp_add_author(
    IN p_author_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(15),
    IN p_bio TEXT
)
BEGIN

    INSERT INTO authors
    (
        author_name,
        email,
        phone,
        bio
    )
    VALUES
    (
        p_author_name,
        p_email,
        p_phone,
        p_bio
    );

END $$

DELIMITER ;

-- get_authors..............................................................................................................................................
DELIMITER $$

CREATE PROCEDURE sp_get_authors()
BEGIN

    SELECT *
    FROM authors
    ORDER BY author_id DESC;

END $$

DELIMITER ;

-- get_author_by_id..............................................................................................................................................
DELIMITER $$

CREATE PROCEDURE sp_get_author_by_id(
    IN p_author_id INT
)
BEGIN

    SELECT *
    FROM authors
    WHERE author_id = p_author_id;

END $$

DELIMITER ;

-- update author..............................................................................................................................................
DELIMITER $$

CREATE PROCEDURE sp_update_author(
    IN p_author_id INT,
    IN p_author_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_phone VARCHAR(15),
    IN p_bio TEXT
)
BEGIN

    UPDATE authors
    SET
        author_name = p_author_name,
        email = p_email,
        phone = p_phone,
        bio = p_bio
    WHERE author_id = p_author_id;

END $$

DELIMITER ;

-- delete author..............................................................................................................................................
DELIMITER $$

CREATE PROCEDURE sp_delete_author(
    IN p_author_id INT
)
BEGIN

    DELETE FROM authors
    WHERE author_id = p_author_id;

END $$

DELIMITER ;

-- Book Procedures
-- add_book..............................................................................................................................................
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_add_book $$

CREATE PROCEDURE sp_add_book(
    IN p_author_id INT,
    IN p_title VARCHAR(200),
    IN p_isbn VARCHAR(50),
    IN p_price DECIMAL(10,2),
    IN p_stock INT,
    IN p_description TEXT,
    IN p_image VARCHAR(255)
)
BEGIN

    INSERT INTO books(
        author_id,
        title,
        isbn,
        price,
        stock,
        description,
        image
    )
    VALUES(
        p_author_id,
        p_title,
        p_isbn,
        p_price,
        p_stock,
        p_description,
        p_image
    );

END $$

DELIMITER ;

-- get_books..............................................................................................................................................
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_get_books $$

CREATE PROCEDURE sp_get_books()
BEGIN

    SELECT

        b.book_id,
        b.title,
        b.isbn,
        b.price,
        b.stock,
        b.description,
        b.image,

        a.author_id,
        a.author_name,

        b.created_at

    FROM books b

    INNER JOIN authors a
        ON b.author_id = a.author_id

    ORDER BY b.book_id DESC;

END $$

DELIMITER ;

-- get_book_by_id..............................................................................................................................................
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_get_book_by_id $$

CREATE PROCEDURE sp_get_book_by_id(

    IN p_book_id INT

)

BEGIN

    SELECT

        b.book_id,
        b.title,
        b.isbn,
        b.price,
        b.stock,
        b.description,
        b.image,

        a.author_id,
        a.author_name,

        b.created_at

    FROM books b

    INNER JOIN authors a
        ON b.author_id = a.author_id

    WHERE b.book_id = p_book_id;

END $$

DELIMITER ;

-- update_book..............................................................................................................................................
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_update_book $$

CREATE PROCEDURE sp_update_book(

    IN p_book_id INT,
    IN p_author_id INT,
    IN p_title VARCHAR(200),
    IN p_isbn VARCHAR(50),
    IN p_price DECIMAL(10,2),
    IN p_stock INT,
    IN p_description TEXT,
    IN p_image VARCHAR(255)

)

BEGIN

    UPDATE books

    SET

        author_id = p_author_id,
        title = p_title,
        isbn = p_isbn,
        price = p_price,
        stock = p_stock,
        description = p_description,
        image = p_image

    WHERE book_id = p_book_id;

END $$

DELIMITER ;

-- delete_book..............................................................................................................................................
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_delete_book $$

CREATE PROCEDURE sp_delete_book(

    IN p_book_id INT

)

BEGIN

    DELETE FROM books

    WHERE book_id = p_book_id;

END $$

DELIMITER ;

-- Blog Procedures
-- add_blog..............................................................................................................................................
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_add_blog $$

CREATE PROCEDURE sp_add_blog(

    IN p_title VARCHAR(255),
    IN p_slug VARCHAR(255),
    IN p_content LONGTEXT,
    IN p_image VARCHAR(255),
    IN p_author VARCHAR(100),
    IN p_status ENUM('Draft','Published')

)

BEGIN

    INSERT INTO blogs(

        title,
        slug,
        content,
        image,
        author,
        status

    )

    VALUES(

        p_title,
        p_slug,
        p_content,
        p_image,
        p_author,
        p_status

    );

END $$

DELIMITER ;

-- get_blogs..............................................................................................................................................
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_get_blogs $$

CREATE PROCEDURE sp_get_blogs()

BEGIN

    SELECT

        blog_id,
        title,
        slug,
        content,
        image,
        author,
        status,
        created_at,
        updated_at

    FROM blogs

    ORDER BY blog_id DESC;

END $$

DELIMITER ;

-- get_blog_by_id..............................................................................................................................................
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_get_blog_by_id $$

CREATE PROCEDURE sp_get_blog_by_id(

    IN p_blog_id INT

)

BEGIN

    SELECT

        blog_id,
        title,
        slug,
        content,
        image,
        author,
        status,
        created_at,
        updated_at

    FROM blogs

    WHERE blog_id = p_blog_id;

END $$

DELIMITER ;

-- update_blog..............................................................................................................................................
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_update_blog $$

CREATE PROCEDURE sp_update_blog(

    IN p_blog_id INT,
    IN p_title VARCHAR(255),
    IN p_slug VARCHAR(255),
    IN p_content LONGTEXT,
    IN p_image VARCHAR(255),
    IN p_author VARCHAR(100),
    IN p_status VARCHAR(20)

)

BEGIN

    UPDATE blogs

    SET

        title = p_title,
        slug = p_slug,
        content = p_content,
        image = p_image,
        author = p_author,
        status = p_status

    WHERE blog_id = p_blog_id;

END $$

DELIMITER ;

-- delete_blog..............................................................................................................................................
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_delete_blog $$

CREATE PROCEDURE sp_delete_blog(

    IN p_blog_id INT

)

BEGIN

    DELETE FROM blogs

    WHERE blog_id = p_blog_id;

END $$

DELIMITER ;

-- admin
-- register_admin..............................................................................................................................................
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_register_admin $$

CREATE PROCEDURE sp_register_admin(

    IN p_name VARCHAR(100),
    IN p_email VARCHAR(100),
    IN p_password VARCHAR(255),
    IN p_role VARCHAR(20)

)

BEGIN

    INSERT INTO admins(

        name,
        email,
        password,
        role

    )

    VALUES(

        p_name,
        p_email,
        p_password,
        p_role

    );

END $$

DELIMITER ;

-- login_admin..............................................................................................................................................
DELIMITER $$

DROP PROCEDURE IF EXISTS sp_login_admin $$

CREATE PROCEDURE sp_login_admin(

    IN p_email VARCHAR(100)

)

BEGIN

    SELECT

        admin_id,
        name,
        email,
        password,
        role

    FROM admins

    WHERE email = p_email

    LIMIT 1;

END $$

DELIMITER ;

-- new..............................................................................................................................................

-- new..............................................................................................................................................

