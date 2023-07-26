import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import UnAuthorized from "../components/UnAuthorized";

// eslint-disable-next-line react/prop-types
function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (user) {
      const isAdmin = user.isAdmin;
      if (isAdmin) {
        setIsAuth(true);
      }
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div id="page">Loading...</div>;
  }

  if (isAuth) {
    return children;
  } else {
    return <UnAuthorized></UnAuthorized>;
  }
}

export default ProtectedRoute;
