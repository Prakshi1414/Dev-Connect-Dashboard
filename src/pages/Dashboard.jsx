import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../ReduxTemp/userSlice";
import axios from "axios";
import { addFavorite, removeFavorite } from "../ReduxTemp/favoritesSlice";
import Layout from "../components/Layout";
import { RxCross2 } from "react-icons/rx";

const Dashboard = () => {
  // Get user info and authentication status from Auth0
  const { user, isAuthenticated } = useAuth0(); // get user info and auth status from Auth0
  const dispatch = useDispatch(); // get Redux dispatch function

  const [githubData, setGithubData] = useState(null); // state to hold GitHub user data
  const [githubUsername, setGithubUsername] = useState("");

  const [loading, setLoading] = useState(false); // state to track loading status of GitHub data

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(setUser(user)); // store user info in Redux
    }
  }, [isAuthenticated, user, dispatch]); // run effect when auth status or user info changes

  // Fetch GitHub user data based on entered username
  const fetchGithubUser = async () => {
    if (!githubUsername.trim()) return;

    try {
      setLoading(true);
      setUserNotFound(false);
      setGithubData(null);
      setRepos([]); // clear previous repos

      const res = await axios.get(
        `https://api.github.com/users/${githubUsername}`,
        {
          headers: {
            Authorization: `token ${import.meta.env.VITE_KEY_TOKEN}`,
          },
        },
      );
      setUserNotFound(true);
      setGithubData(res.data);
      setCurrentPage(1);
      fetchGithubRepos(githubUsername, 1); // fetch first page of repos
      setUserNotFound(false);

      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setUserNotFound(true);
      } else {
        setUserNotFound(false);
      }

      console.error("GitHub API Error:", error);
      setGithubData(null);
      setRepos([]);
      setLoading(false);
    }
  };
  //for repositories
  const [repos, setRepos] = useState([]); // List of repositories
  const [repoLoading, setRepoLoading] = useState(false); // Loading state for repos
  const [repoError, setRepoError] = useState(null); // Error state for repos
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [reposPerPage] = useState(5); // Number of repos per page

  // Fetch repositories for the given GitHub username and page
  const fetchGithubRepos = async (username, page = 1) => {
    try {
      setRepoLoading(true);
      setRepoError(null);

      const res = await axios.get(
        `https://api.github.com/users/${username}/repos`,
        {
          params: {
            per_page: reposPerPage,
            page: page,
            sort: "updated",
          },
          headers: {
            Authorization: `token ${import.meta.env.VITE_KEY_TOKEN}`,
          },
        },
      );

      setRepos(res.data);
      setRepoLoading(false);
    } catch (error) {
      console.error("GitHub Repos Error:", error);
      setRepoError("Failed to fetch repositories");
      setRepoLoading(false);
    }
  };
  // Handle page change for pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchGithubRepos(githubUsername, page);
  };

  const favorites = useSelector((state) => state.favorites.favorites); // Get favorites from Redux store
  // Check if a repository is in the favorites list
  const isFavorite = (repoId) => {
    return favorites.some((repo) => repo.id === repoId);
  };
  // State to track if user was not found
  const [userNotFound, setUserNotFound] = useState(false);

  //for search feature
  const [suggestions, setSuggestions] = useState([]); // For live username suggestions
  const [showSuggestions, setShowSuggestions] = useState(false); // Control dropdown visibility

  // Fetch top 10 GitHub users matching the query for suggestions
  const fetchSuggestions = async (query) => {
    const trimmedQuery = query.trim(); // remove spaces
    if (!trimmedQuery) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await axios.get("https://api.github.com/search/users", {
        params: { q: trimmedQuery, per_page: 10 },
        headers: { Authorization: `token ${import.meta.env.VITE_KEY_TOKEN}` },
      });

      setSuggestions(res.data.items || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold dark:text-gray-300 ">
          Hello, Code Master!
        </h2>
      </div>
      <div className="bg-white shadow p-6 rounded mb-6 dark:bg-gray-800">
        <h2 className="text-lg font-bold mb-2">Enter GitHub Username</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative w-full">
            <input
              type="text"
              value={githubUsername}
              onChange={(e) => {
                const value = e.target.value;
                setGithubUsername(value); // update input
                fetchSuggestions(value); // fetch top 10 suggestions
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setShowSuggestions(false); // hide suggestions when searchinga
                  fetchGithubUser();
                }
              }}
              placeholder="Enter GitHub username"
              className="border border-gray-300 px-3 py-2 rounded w-full"
            />
            {/* Show dropdown only if there are suggestions and user is typing */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="absolute top-full left-0 w-full bg-white hide-scrollbar dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded mt-1 max-h-60 overflow-y-auto z-50">
                {suggestions.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => {
                      setGithubUsername(user.login); // set input to clicked username
                      fetchGithubUser(); // fetch user data
                      setShowSuggestions(false); // hide dropdown
                    }}
                    className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-gray-900 dark:text-gray-200">
                        {user.login}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Clear button inside input , it clear whole screen */}
            {githubUsername && (
              <button
                onClick={() => {
                  setGithubUsername(""); // clear input
                  setGithubData(null); // remove GitHub user data
                  setRepos([]); // clear repos
                  setUserNotFound(false); // reset not found
                  setCurrentPage(1); // reset pagination
                  setSuggestions([]); // clear suggestions
                  setShowSuggestions(false); // hide suggestions
                }}
                className="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-600"
              >
                <RxCross2 size={20} />
              </button>
            )}
          </div>

          <button
            onClick={fetchGithubUser}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition"
          >
            Search
          </button>
        </div>
      </div>

      {loading && (
        <p className="mb-4 text-blue-600 font-medium">Loading GitHub data...</p>
      )}

      {!loading && userNotFound && (
        <p className="mb-4 text-red-500  font-medium">
          No user found with this username.
        </p>
      )}

      {/* Example for repos rendering */}
      {!loading && !userNotFound && repos.length > 0 && (
        <div className="mt-6">{/* Your repos list code here */}</div>
      )}

      {/* GitHub User Data */}
      {githubData && (
        <div className="space-y-3 ">
          {/* Row 1: Centered profile */}
          <div className="flex flex-col items-center bg-white dark:bg-gray-800 shadow rounded p-2 ">
            <img
              src={githubData.avatar_url}
              alt="GitHub Avatar"
              className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full mb-3"
            />
            <h2 className=" text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {githubData.name || githubData.login}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              @{githubData.login}
            </p>
          </div>

          {/* Row 2: 3 Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Repositories Box */}
            <div className="bg-white dark:bg-gray-800 shadow rounded p-3 flex flex-col items-center dark:bg-gray-600">
              <h3 className="text-md sm:text-lg font-semibold text-gray-700 dark:text-gray-200">
                Total Repositories
              </h3>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {githubData.public_repos}
              </p>
            </div>

            {/* Followers Box */}
            <div className="bg-white dark:bg-gray-800 shadow rounded p-3 flex flex-col items-center dark:bg-gray-600">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Followers
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {githubData.followers}
              </p>
            </div>

            {/* Following Box */}
            <div className="bg-white dark:bg-gray-800 shadow rounded p-3 flex flex-col items-center dark:bg-gray-600">
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                Following
              </h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                {githubData.following}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Repositories List */}
      {repoLoading && <p>Loading repositories...</p>}
      {repoError && <p className="text-red-500">{repoError}</p>}

      {repos.length > 0 && (
        <div className="mt-6 w-full  mx-auto px-4">
          <h3 className="text-2xl font-bold text-center justify-center items-center mb-4">
            Repositories
          </h3>
          <ul className="space-y-4">
            {repos.map((repo) => {
              const fav = isFavorite(repo.id);
              return (
                <li
                  key={repo.id}
                  className="p-4 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white dark:bg-gray-800 shadow-sm"
                >
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-600 text-lg">
                      {repo.name}
                    </h4>
                    <p className="text-gray-700 mt-1 dark:text-gray-100">
                      {repo.description || "No description"}
                    </p>
                    <p className="text-gray-500 mt-1">
                      <span className="font-medium">Language:</span>{" "}
                      {repo.language || "N/A"} | ⭐ {repo.stargazers_count}
                    </p>
                  </div>

                  <div className="mt-2 md:mt-0">
                    {fav ? (
                      <button
                        onClick={() => dispatch(removeFavorite(repo.id))}
                        className="px-3 py-1 cursor-pointer bg-red-500 w-full md:w-auto hover:bg-red-600 text-white rounded-md transition"
                      >
                        Remove Favorite
                      </button>
                    ) : (
                      <button
                        onClick={() => dispatch(addFavorite(repo))}
                        className="px-3 py-1 cursor-pointer bg-yellow-400 w-full md:w-auto hover:bg-yellow-500 text-white rounded-md transition"
                      >
                        Add Favorite
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Pagination Buttons */}
          <div className="flex flex-wrap gap-2 mt-6 justify-center">
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-500"
              >
                Prev
              </button>
            )}
            {repos.length === reposPerPage && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition cursor-pointer dark:bg-gray-800 dark:hover:bg-gray-500"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Dashboard;
