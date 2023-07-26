import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

// eslint-disable-next-line react/prop-types
function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setIsAuth(true);
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Lütfen giriş yapın</div>;
  }

  if (isAuth) {
    return children;
  } else {
    return <Navigate to="/giris" />;
  }
}

export default PrivateRoute;
