import { useSelector, useDispatch } from "react-redux";
import { removeFavorite, clearFavorites } from "../ReduxTemp/favoritesSlice";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const FavoritesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const favorites = useSelector((state) => state.favorites.favorites);

  return (
    <Layout>
      <h2 className="text-xl sm:text-2xl font-bold mb-4">
        Favorite Repositories
      </h2>

      {favorites.length === 0 ? (
        <p className="text-gray-500">No favorite repositories yet.</p>
      ) : (
        <>
          {favorites.map((repo) => (
            <div
              key={repo.id}
              className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800 mb-4 hover:shadow-md transition"
            >
              <div className="flex-1">
                <h3 className="font-bold text-base sm:text-lg text-blue-600">
                  {repo.name}
                </h3>

                <p className="text-gray-700 dark:text-gray-300 mt-1">
                  {repo.description || "No description"}
                </p>
                <p className="text-gray-500 mt-1">
                  <span className="font-medium">Language:</span>{" "}
                  {repo.language || "N/A"} | ⭐ {repo.stargazers_count}
                </p>
              </div>

              <button
                onClick={() => dispatch(removeFavorite(repo.id))}
                className="mt-3 md:mt-0 w-full md:w-auto px-4 py-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-md transition"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="flex flex-col justify-start items-start gap-4">
            <button
              onClick={() => dispatch(clearFavorites())}
              className="mt-4 w-full md:w-auto  px-4 py-2 bg-gray-500 text-white rounded cuesor-pointer hover:bg-gray-600 transition"
            >
              Clear All
            </button>
            {/* Back Button always visible */}
            <button
              onClick={() => navigate("/dashboard")}
              className="mb-4 w-full md:w-auto  px-4 py-2 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-900 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </>
      )}
    </Layout>
  );
};

export default FavoritesPage;
