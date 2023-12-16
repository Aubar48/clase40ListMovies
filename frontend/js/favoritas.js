window.onload = async () => {
  const app = document.getElementById("root");
  const container = document.createElement("div");
  container.setAttribute("class", "container");
  app.appendChild(container);

  // Obtener las películas favoritas del almacenamiento local
  const favorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

  if (favorites.length > 0) {
    // Consultar la información de las películas favoritas
    try {
      const response = await fetch(`http://localhost:3031/api/movies`);
      const { meta, data } = await response.json();

      // Filtrar las películas favoritas
      const favoriteMovies = data.filter(movie => favorites.includes(movie.id));

      // Mostrar las películas favoritas
      favoriteMovies.forEach((movie) => {
        const card = document.createElement("div");
        card.setAttribute("class", "card");

        const h1 = document.createElement("h1");
        h1.textContent = movie.title;

        const p = document.createElement("p");
        p.textContent = `Rating: ${movie.rating}`;

        const duracion = document.createElement("p");
        duracion.textContent = `Duración: ${movie.length}`;

        const link = document.createElement("a");
        link.textContent = "ver más";
        link.setAttribute('href', `formulario.html?movie=${movie.id}`);

        // Botón (estrella) para quitar de favoritas
        const removeFavoriteButton = document.createElement('button');
        removeFavoriteButton.innerHTML = '⭐';
        removeFavoriteButton.setAttribute('class', 'remove-favorite');
        removeFavoriteButton.addEventListener('click', () => removeMovieFromFavorites(movie.id, card));
        
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
        card.appendChild(removeFavoriteButton);
      });
    } catch (error) {
      console.error('Error al cargar las películas:', error);
      // Manejar el error, por ejemplo, mostrar un mensaje al usuario
      const errorMessage = document.createElement("p");
      errorMessage.textContent = 'Hubo un error al cargar las películas.';
      container.appendChild(errorMessage);
    }
  } else {
    // Manejar el caso donde no hay películas favoritas
    const noFavoritesMessage = document.createElement("p");
    noFavoritesMessage.textContent = 'Aún no tienes películas favoritas.';
    container.appendChild(noFavoritesMessage);
  }

  // Agregar un botón de regreso a la página de inicio
  const backButton = document.createElement('button');
  backButton.textContent = 'Volver a Inicio';
  backButton.addEventListener('click', () => window.location.href = 'home.html');
  app.appendChild(backButton);

  
};

// Función para quitar una película de favoritas
function removeMovieFromFavorites(movieId, card) {
  const favorites = JSON.parse(localStorage.getItem('favoriteMovies')) || [];
  const updatedFavorites = favorites.filter(id => id !== movieId);
  localStorage.setItem('favoriteMovies', JSON.stringify(updatedFavorites));

  // Eliminar la tarjeta de la vista
  card.remove();
}
