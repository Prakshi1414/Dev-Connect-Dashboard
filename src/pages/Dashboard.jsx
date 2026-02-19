import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../ReduxTemp/userSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { addFavorite, removeFavorite } from "../ReduxTemp/favoritesSlice";

const Dashboard = () => {
  const navigate = useNavigate(); // for navigation
  const { user, logout, isAuthenticated } = useAuth0(); // get user info and auth status from Auth0
  const dispatch = useDispatch(); // get Redux dispatch function
  const userData = useSelector((state) => state.user.userInfo); // get user info from Redux store

  const [githubData, setGithubData] = useState(null); // state to hold GitHub user data
  const [githubUsername, setGithubUsername] = useState("");

  const [loading, setLoading] = useState(false); // state to track loading status of GitHub data

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(setUser(user)); // store user info in Redux
    }
  }, [isAuthenticated, user, dispatch]); // run effect when auth status or user info changes

  const fetchGithubUser = async () => {
    if (!githubUsername.trim()) return;

    try {
      setLoading(true);
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

      setGithubData(res.data);
      setCurrentPage(1);
      fetchGithubRepos(githubUsername, 1); // fetch first page of repos

      setLoading(false);
    } catch (error) {
      console.error("GitHub API Error:", error);
      setGithubData(null);
      setRepos([]);
      setLoading(false);
    }
  };

  // Handle logout by clearing user info from Redux and logging out of Auth0
  const handleLogout = () => {
    dispatch(clearUser());
    logout({ logoutParams: { returnTo: window.location.origin } }); // log out and return to home page
  };

  const [repos, setRepos] = useState([]); // List of repositories
  const [repoLoading, setRepoLoading] = useState(false); // Loading state for repos
  const [repoError, setRepoError] = useState(null); // Error state for repos
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [reposPerPage] = useState(5); // Number of repos per page

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
            sort: "updated", // latest updated first
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
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchGithubRepos(githubUsername, page);
  };

  const favorites = useSelector((state) => state.favorites.favorites);
  const isFavorite = (repoId) => {
    return favorites.some((repo) => repo.id === repoId);
  };
  useEffect(() => {
    console.log("Favorites:", favorites);
  }, [favorites]);

  return (
    <div className="p-10">
      {/* Auth0 User */}
      <div className="mb-8">
        <h2 className="text-xl font-bold">Authenticated User</h2>
        <div className="flex flex-row items-center gap-4 mt-[10px]">
          <img
            src={userData?.picture}
            alt="auth user"
            className="w-20 h-20 rounded-full border"
          />

          <div className="flex flex-col font-medium">
            <p>Name: {userData?.name}</p>
            <p>Email: {userData?.email}</p>
          </div>
        </div>
      </div>
      <div className="bg-white shadow p-6 rounded mb-6">
        <h2 className="text-lg font-bold mb-2">Enter GitHub Username</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchGithubUser();
              }
            }}
            placeholder="Enter GitHub username"
            className="border px-3 py-2 rounded w-full"
          />

          <button
            onClick={fetchGithubUser}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Search
          </button>
        </div>
      </div>

      {loading && (
        <p className="mb-4 text-blue-600 font-medium">Loading GitHub data...</p>
      )}

      {/* GitHub User Data */}
      {githubData && (
        <div className="bg-white shadow p-6 rounded">
          <div className="flex items-center gap-4">
            <img
              src={githubData.avatar_url}
              alt="github avatar"
              className="w-20 h-20 rounded-full"
            />
            <div>
              <h2 className="text-2xl font-bold">
                {githubData.name || githubData.login}
              </h2>
              <p>Total Repositories: {githubData.public_repos}</p>
              <p>Followers: {githubData.followers}</p>
              <p>Following: {githubData.following}</p>
            </div>
          </div>
        </div>
      )}

      {/* Repositories List */}
      {repoLoading && <p>Loading repositories...</p>}
      {repoError && <p className="text-red-500">{repoError}</p>}

      {repos.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Repositories</h3>
          <ul className="space-y-3">
            {repos.map((repo) => {
              const fav = isFavorite(repo.id);
              return (
                <li
                  key={repo.id}
                  className="p-3 border rounded flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-semibold text-blue-600">{repo.name}</h4>
                    <p>{repo.description || "No description"}</p>
                    <p>
                      <span className="font-medium">Language:</span>{" "}
                      {repo.language || "N/A"} | ⭐ {repo.stargazers_count}
                    </p>
                  </div>

                  {fav ? (
                    <button
                      onClick={() => dispatch(removeFavorite(repo.id))}
                      className="px-2 py-1 bg-red-400 rounded"
                    >
                      Remove Favorite
                    </button>
                  ) : (
                    <button
                      onClick={() => dispatch(addFavorite(repo))}
                      className="px-2 py-1 bg-yellow-400 rounded"
                    >
                      Add Favorite
                    </button>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Pagination Buttons */}
          <div className="flex gap-2 mt-4">
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Prev
              </button>
            )}
            {repos.length === reposPerPage && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Next
              </button>
            )}
          </div>
        </div>
      )}
      <div className="flex flex-col h-auto justify-center items-center">
        <button
          onClick={() => navigate("/favorites")}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          View Favorites
        </button>

        <button
          onClick={handleLogout}
          className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
