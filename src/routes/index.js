const { Router } = require("express");
const { db } = require("../firebase");

const router = Router();

// GET /books: Devuelve una lista de todos los libros almacenados en Firebase Firestore.
router.get("/books", async (req, res) => {
  try {
    const booksCollection = db.collection("books");
    const booksSnapshot = await booksCollection.get();

    const books = [];
    booksSnapshot.forEach((doc) => {
      const bookData = doc.data();
      books.push(bookData);
    });

    res.json({ books });
  } catch (error) {
    res.status(500).json({ error: "error en la petición" });
  }
});

// GET /books/{id}: Devuelve los detalles de un libro específico según su ID.
router.get("/books/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    const book = await db.collection("books").doc(idParam).get();

    if (!book.exists) {
      return res.status(400).json({ error: "El id proporcionado no existe" });
    }

    res.json({ book: book.data() });
    console.log("Libro:", book);
  } catch (error) {
    res.status(500).json({ error: "error en la petición" });
  }
});

// GET /books/count: Devuelve el numero de libros que hay en la coleccion
router.get("/count", async (req, res) => {
  try {
    const snapshot = await db.collection("books").get();
    const count = snapshot.size; // tamaño del snapshot, que es el conteo de documentos
    res.json({ count });
    console.log("Numero de libros:", count);
  } catch (error) {
    console.error("Error en el conteo de libros:", error);
    res.status(500).json({ error: "error en la petición" });
  }
});

// POST /books: Crea un nuevo libro con la información proporcionada en la solicitud.
router.post("/books", async (req, res) => {
  try {
    const dataBody = req.body;

    if (!dataBody || !dataBody.titulo || !dataBody.autor || !dataBody.info) {
      return res.status(500).json({ error: "Falta información del libro" });
    }

    // Validacion de que el titulo no existe ya
    const existingBook = await db
      .collection("books")
      .where("titulo", "==", dataBody.titulo)
      .get();
    if (!existingBook.empty) {
      return res
        .status(400)
        .json({ error: "Ya existe un libro con el mismo título" });
    }
    const newBookRef = db.collection("books").doc();
    const newBookId = newBookRef.id;
    // Obtener el ID asignado por Firebase

    await newBookRef.set({ id: newBookId, ...dataBody });

    res.json({ msg: "Libro agregado con uuid", id: newBookId });
    console.log("Nuevo ID del libro:", newBookId);
  } catch (error) {
    res.status(500).json({ error: "error en la petición" });
  }
});

// PUT /books/{id}: Actualiza la información de un libro existente según su ID.
router.put("/books/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    const book = await db.collection("books").doc(idParam).get();

    if (!book.exists) {
      return res.status(400).json({ error: "El id proporcionado no existe" });
    }

    const dataBody = req.body;
    if (!dataBody || !dataBody.titulo || !dataBody.autor || !dataBody.info) {
      return res.status(500).json({ error: "Falta información del libro" });
    }

    await db.collection("books").doc(idParam).update(dataBody);
    res.json({ msg: "Libro modificado" });
  } catch (error) {
    res.status(500).json({ error: "error en la petición" });
  }
});

// DELETE /books/{id}: Elimina un libro específico según su ID.
router.delete("/books/:id", async (req, res) => {
  try {
    const idParam = req.params.id;
    // const book = await db.collection('books').doc(idParam).get();

    if (!idParam) {
      return res.status(400).json({ error: "El id proporcionado no existe" });
    }
    const book = await db.collection("books").doc(idParam).get();
    if (!book.exists) {
      return res.status(400).json({ error: "El id proporcionado no existe" });
    }

    await db.collection("books").doc(idParam).delete();
    res.json({ msg: "Libro borrado" });
  } catch (error) {
    res.status(500).json({ error: "error en la petición" });
  }
});

// [Debug] GET /restartBooks Re-Genera la colleccion books inicial
router.get("/restartBooks", async (req, res) => {
  const booksCollection = db.collection("books");

  const querySnapshot = await booksCollection.get();
  for (const doc of querySnapshot.docs) {
    await doc.ref.delete();
  }

  const booksObjs = [
    {
      titulo: "La Colmena",
      autor: "Camilo José Cela",
      info: "Una obra que retrata la vida en la posguerra española.",
    },
    {
      titulo: "Cien años de soledad",
      autor: "Gabriel García Márquez",
      info: "Un clásico de la literatura latinoamericana.",
    },
    {
      titulo: "Niebla",
      autor: "Miguel de Unamuno",
      info:
        "Una obra existencialista que explora la naturaleza de la realidad y la ficción.",
    },
    {
      titulo: "La familia de Pascual Duarte",
      autor: "Camilo José Cela",
      info: "Una novela brutal que explora la violencia y la tragedia.",
    },
    {
      titulo: "San Camilo, 1936",
      autor: "Camilo José Cela",
      info: "Una obra que retrata la Guerra Civil Española.",
    },
    {
      titulo: "La ciudad y los perros",
      autor: "Mario Vargas Llosa",
      info: "Una novela que aborda la vida en una academia militar en Lima.",
    },
    {
      titulo: "La Regenta",
      autor: 'Leopoldo Alas "Clarín"',
      info: "Una novela realista que critica la sociedad de la época.",
    },
    {
      titulo: "Los santos inocentes",
      autor: "Miguel Delibes",
      info:
        "Una obra que critica las desigualdades sociales en la España rural.",
    },
    {
      titulo: "La sombra del viento",
      autor: "Carlos Ruiz Zafón",
      info: "Un misterio ambientado en la posguerra en Barcelona.",
    },
    {
      titulo: "El túnel",
      autor: "Ernesto Sábato",
      info: "Una novela existencialista de un hombre obsesionado.",
    },
    {
      titulo: "Tiempo de silencio",
      autor: "Luis Martín-Santos",
      info:
        "Una novela que critica la opresión y la censura durante la dictadura franquista.",
    },
    {
      titulo: "Tirano Banderas",
      autor: "Ramón María del Valle-Inclán",
      info: "Una sátira política que critica la dictadura en América Latina.",
    },
    {
      titulo: "El Aleph",
      autor: "Jorge Luis Borges",
      info:
        "Una colección de cuentos que exploran la metafísica y la realidad.",
    },
    {
      titulo: "Nada",
      autor: "Carmen Laforet",
      info: "Una novela que retrata la vida en la posguerra en Barcelona.",
    },
    {
      titulo: "Soldados de Salamina",
      autor: "Javier Cercas",
      info:
        "Una novela que mezcla realidad y ficción en la Guerra Civil Española.",
    },
    {
      titulo: "Cinco horas con Mario",
      autor: "Miguel Delibes",
      info: "Un monólogo que reflexiona sobre la vida y la muerte.",
    },
    {
      titulo: "La forja de un rebelde",
      autor: "Arturo Barea",
      info:
        "Una trilogía autobiográfica que narra la vida durante la Guerra Civil Española.",
    },
    {
      titulo: "Retahílas",
      autor: "Carmen Martín Gaite",
      info:
        "Una obra que mezcla poesía y prosa para explorar la infancia y la memoria.",
    },
    {
      titulo: "La invención del Quijote",
      autor: "Fernando Fernán Gómez",
      info:
        "Una obra que reflexiona sobre la creación literaria y la figura de Don Quijote.",
    },
  ];

  const batch = db.batch();

  for (const b of booksObjs) {
    // Crea una nueva referencia de documento sin identificador específico
    const newBookRef = booksCollection.doc();

    // Agrega el set al batch para escribir eficientemente
    batch.set(newBookRef, b);
  }

  // Ejecuta el batch
  await batch.commit();

  res.json({
    msg: "collection reset",
  });
});

module.exports = router;
