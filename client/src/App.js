import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";
import Profile from "./pages/profile/Profile";
import { Toaster } from "react-hot-toast";
import RequireUser from "./components/RequireUser";
import { useSelector } from "react-redux";
import Loader from "./components/Loader";

function App() {
  const { loader } = useSelector((state) => state.loaderReducer);
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {loader && <Loader />}
      <Routes>
        <Route
          path="/"
          element={
            <RequireUser>
              <Home />
            </RequireUser>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireUser>
              <Profile />
            </RequireUser>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
