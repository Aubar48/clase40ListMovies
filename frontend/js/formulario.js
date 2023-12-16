const $ = (id) => document.getElementById(id);
window.onload = async () => {
  let query = new URLSearchParams(location.search);

  try {
    const response = await fetch(
      `http://localhost:3031/api/movies/${query.get("movie")}`
    );

    const result = await response.json();

    $("title").value = result.data.title;
    $("rating").value = result.data.rating;
    $("awards").value = result.data.awards;
    $("length").value = result.data.length;
    $("release_date").value = result.data.release_date.split("T")[0];
    id = result.data.id;

    $("editMovie").addEventListener("click", async function () {
      const updatedData = {
        title: $("title").value,
        rating: $("rating").value,
        awards: $("awards").value,
        release_date: $("release_date").value,
        length: $("length").value,
        id: result.data.id,
      };
      try {
        const updateResponse = await fetch(
          `http://localhost:3031/api/movies/update/${result.data.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
          }
        );

        const updateResult = await updateResponse.json();

        console.log(updateResult);
        window.location.href = "/home.html";
      } catch (error) {
        console.error("Error al actualizar los datos:", error);
      }
    });

    $("createMovie").addEventListener("click", async function () {
      try {
        const newData = {
          title: $("title").value,
          rating: $("rating").value,
          awards: $("awards").value,
          release_date: $("release_date").value,
          length: $("length").value,
        };

        const response = await fetch(
          `http://localhost:3031/api/movies/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newData),
          }
        );

        window.location.href = "home.html";
      } catch (error) {
        console.error("Error al actualizar los datos:", error);
      }
    });

    $("deleteMovie").addEventListener("click", async function () {
      try {
        const response = await fetch(
          `http://localhost:3031/api/movies/delete/${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        window.location.href = "home.html";
      } catch (error) {
        console.error("Error al actualizar los datos:", error);
      }
    });

  } catch (error) {
    console.log(error);
  }
};