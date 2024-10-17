import { useEffect, useState } from "react";

function Movie() {
  const [movieList, setMovieList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [showPopup, setShowPopup] = useState(false); // Popup state for create/edit movie form
  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    poster_path: "",
  }); // State for new movie data
  const [isEditing, setIsEditing] = useState(false); // State to track if a movie is being edited
  const [editMovieId, setEditMovieId] = useState(null); // Store the ID of the movie being edited

  // Fetch movies based on search or default to discover movies
  const getMovie = (query) => {
    const url = query
      ? `https://api.themoviedb.org/3/search/movie?api_key=8406b08a7853aaf142c9165d1eaca29e&query=${query}`
      : `https://api.themoviedb.org/3/discover/movie?api_key=8406b08a7853aaf142c9165d1eaca29e`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => setMovieList(json.results || [])) // Handle empty results
      .catch((error) => console.error("Error fetching movies:", error));
  };

  useEffect(() => {
    getMovie(); // Fetch discover movies by default
  }, []);

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    getMovie(searchTerm); // Trigger the search API when form is submitted
  };

  // Create or Update Movie Form Submit handler
  const handleCreateOrUpdateMovie = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Update the movie in the list
      setMovieList((prevMovies) =>
        prevMovies.map((movie) =>
          movie.id === editMovieId ? { ...movie, ...newMovie } : movie
        )
      );
      setIsEditing(false);
      setEditMovieId(null);
    } else {
      // Generate a unique ID for the new movie (for demo purposes)
      const newMovieWithId = { ...newMovie, id: Date.now() };
      // Add the new movie to the movieList state (updating the UI)
      setMovieList((prevMovies) => [...prevMovies, newMovieWithId]);
    }

    setShowPopup(false); // Close the popup after saving
    setNewMovie({ title: "", description: "", poster_path: "" }); // Reset form
  };

  // Handle Delete Movie
  const handleDeleteMovie = (id) => {
    setMovieList((prevMovies) => prevMovies.filter((movie) => movie.id !== id));
  };

  // Handle Edit Movie (Open popup with movie data pre-filled)
  const handleEditMovie = (movie) => {
    setNewMovie(movie); // Pre-fill the form with movie details
    setIsEditing(true); // Set editing state to true
    setEditMovieId(movie.id); // Store the ID of the movie being edited
    setShowPopup(true); // Show the form popup
  };

  return (
    <div>
      {/* Search Form aligned to the right */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", alignItems: "center" }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a movie"
            style={{
              padding: "10px",
              width: "300px",
              fontSize: "16px",
              marginRight: "10px",
            }}
          />
          <button type="submit" style={{ padding: "10px 20px", fontSize: "16px" }}>
            Search
          </button>
        </form>

        {/* Create (+) Button */}
        <button
          onClick={() => {
            setNewMovie({ title: "", description: "", poster_path: "" }); // Clear form for new movie
            setShowPopup(true);
            setIsEditing(false); // Ensure not in editing mode
          }}
          style={{ fontSize: "20px", padding: "10px 20px" }}
        >
          +
        </button>
      </div>

      {/* Movie List */}
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {movieList.length === 0 ? (
          <p>No movies found</p>
        ) : (
          movieList.map((movie) => (
            <div key={movie.id} style={{ position: "relative", margin: "15px" }}>
              <img
                style={{ width: "300px", height: "350px",paddingLeft:'25px' }}
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/350"
                }
                alt={movie.title}
              />
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  display: "flex",
                  gap: "10px",
                }}
              >
                {/* Edit (Pencil) Button */}
                <button onClick={() => handleEditMovie(movie)} style={{ cursor: "pointer" }}>
                  ✏️
                </button>
                {/* Delete (Trash) Button */}
                <button
                  onClick={() => handleDeleteMovie(movie.id)}
                  style={{ cursor: "pointer" }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Movie Popup */}
      {showPopup && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            background: "white",
            border: "1px solid black",
            zIndex: 1000,
          }}
        >
          <h2>{isEditing ? "Edit Movie" : "Add a New Movie"}</h2>
          <form onSubmit={handleCreateOrUpdateMovie}>
            <input
              type="text"
              placeholder="Movie Name"
              value={newMovie.title}
              onChange={(e) =>
                setNewMovie({ ...newMovie, title: e.target.value })
              }
              required
              style={{
                display: "block",
                marginBottom: "10px",
                padding: "10px",
                width: "300px",
              }}
            />
            <textarea
              placeholder="Movie Description"
              value={newMovie.description}
              onChange={(e) =>
                setNewMovie({ ...newMovie, description: e.target.value })
              }
              required
              style={{
                display: "block",
                marginBottom: "10px",
                padding: "10px",
                width: "300px",
                height: "100px",
              }}
            />
            <input
              type="text"
              placeholder="Poster URL (optional)"
              value={newMovie.poster_path}
              onChange={(e) =>
                setNewMovie({ ...newMovie, poster_path: e.target.value })
              }
              style={{
                display: "block",
                marginBottom: "10px",
                padding: "10px",
                width: "300px",
              }}
            />
            <button type="submit" style={{ padding: "10px 20px" }}>
              {isEditing ? "Update" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setShowPopup(false)} // Close popup without saving
              style={{ padding: "10px 20px", marginLeft: "10px" }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Movie;
