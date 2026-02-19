import { useSelector, useDispatch } from "react-redux";
import { removeFavorite, clearFavorites } from "../ReduxTemp/favoritesSlice";
import { useNavigate } from "react-router-dom";

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.favorites.favorites);

  return (
    <div className="p-6">
      {/* Back Button always visible */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
         Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold mb-4">Favorite Repositories</h2>

      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorite repositories yet.</p>
      ) : (
        <>
          {favorites.map((repo) => (
            <div key={repo.id} className="border p-3 rounded mb-3">
              <h3 className="font-semibold">{repo.name}</h3>
              <p>{repo.description}</p>

              <button
                onClick={() => dispatch(removeFavorite(repo.id))}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            onClick={() => dispatch(clearFavorites())}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Clear All
          </button>
        </>
      )}
    </div>
  );
};

export default FavoritesPage;
