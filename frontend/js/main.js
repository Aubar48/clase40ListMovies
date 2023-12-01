window.onload = async () => {
  const app = document.getElementById("root");
  const container = document.createElement("div");
  container.setAttribute("class", "container");
  app.appendChild(container);

  // Agregamos nuestro fetch
  try {
    const response = await fetch('http://localhost:3031/api/movies');
    const { meta, data } = await response.json();

    data.forEach((movie) => {
      const card = document.createElement("div");
      card.setAttribute("class", "card");

      const h1 = document.createElement("h1");
      h1.textContent = movie.title;

      const p = document.createElement("p");
      p.textContent = `Rating: ${movie.rating}`;

      const duracion = document.createElement("p");
      duracion.textContent = `Duración: ${movie.length}`;

      const link = document.createElement("a");
      link.textContent = "ver mas";
      link.setAttribute('href', `formulario.html?movie=${movie.id}`);

      // Agregamos un espacio entre "ver mas" y la estrella
      const space = document.createElement("span");
      space.innerHTML = "&nbsp;&nbsp;&nbsp;";

      // Ahora usamos un botón para marcar como favorita
      const estrellaButton = document.createElement("button");
      estrellaButton.textContent = "⭐";
      estrellaButton.setAttribute('class', 'favorita');
      estrellaButton.addEventListener('click', () => toggleFavorite(movie.id, card, estrellaButton));

      container.appendChild(card);

      card.appendChild(h1);
      card.appendChild(p);
      if (movie.genre !== null) {
        const genero = document.createElement("p");
        genero.textContent = `Género: ${movie.genre.name}`;
        card.appendChild(genero);
      }
      card.appendChild(duracion);
      card.appendChild(link);
      card.appendChild(space); // Agregamos el espacio
      card.appendChild(estrellaButton);
    });
  } catch (error) {
    console.error('Error al cargar las películas:', error);
  }

  // Verificamos si hay películas favoritas y mostramos el botón correspondiente
  const favorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
  if (favorites.length > 0) {
    const favoritesButton = document.createElement('button');
    favoritesButton.textContent = 'Mis películas favoritas';
    favoritesButton.addEventListener('click', () => window.location.href = 'favoritas.html');
    app.appendChild(favoritesButton);
  }
};

// Función para marcar/desmarcar como favorita y almacenar en localStorage
const toggleFavorite = (movieId, card, button) => {
  const favorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
  
  // Verificar si la película ya está en favoritos
  const index = favorites.indexOf(movieId);
  if (index === -1) {
    // Si no está en favoritos, agregarla
    favorites.push(movieId);
    card.style.backgroundColor = 'lightgreen'; // Opcional: Cambiar el color de fondo para indicar que es favorita
    button.textContent = '⭐';
    alert('Película marcada como favorita');
  } else {
    // Si ya está en favoritos, quitarla
    favorites.splice(index, 1);
    card.style.backgroundColor = ''; // Opcional: Restaurar el color de fondo original
    button.textContent = '⭐';
    alert('Película eliminada de favoritos');
  }

  // Actualizar el localStorage
  localStorage.setItem('favoriteMovies', JSON.stringify(favorites));
};
