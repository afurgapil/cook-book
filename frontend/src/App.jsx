import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
//*comps

import Header from "./components/Header";
import Footer from "./components/Footer";
//*public
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import AppylEditor from "./pages/ApplyEditor";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";
import NotFound from "./pages/NotFound";

//*private
import Home from "./pages/Home";
import Ingredients from "./pages/Ingredients";
import Favorites from "./pages/Favorites";
import Recipes from "./pages/Recipes";
import RecipeDetail from "./pages/RecipeDetail";
import Foods from "./pages/Foods";

//*pro
import ManageUsers from "./pages/ManageUsers";
import ManageRecipes from "./pages/ManageRecipes";
import CreateRecipe from "./pages/CreateRecipe";
import CreateIngredient from "./pages/CreateIngredient";
import EditIngredient from "./pages/ManageIngredient";
//*route
import ProtectedRoute from "./routes/ProtectedRoute";
import PrivateRoute from "./routes/PrivateRoute";
function App() {
  const publicRoutes = [
    { path: "/", component: Home },
    { path: "/kayit", component: SignUp },
    { path: "/giris", component: SignIn },
    { path: "/basvur", component: AppylEditor },
    { path: "/sifre", component: ForgotPassword },
    { path: "/reset-password/", component: ResetPassword },
  ];
  const privateRoutes = [
    { path: "/malzemeler", component: Ingredients },
    { path: "/favorilerim", component: Favorites },
    { path: "/tarifler", component: Recipes },
    { path: "/tarif/:id", component: RecipeDetail },
    { path: "/yemekler", component: Foods },
  ];
  const protectedRoutes = [
    { path: "/manage-users", component: ManageUsers },
    { path: "/manage-recipes", component: ManageRecipes },
    { path: "/add-igredient", component: CreateIngredient },
    { path: "/add-recipe", component: CreateRecipe },
    { path: "/manage-ingredient", component: EditIngredient },
  ];
  return (
    <UserProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          {publicRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
          {privateRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <PrivateRoute>
                  <route.component />
                </PrivateRoute>
              }
            />
          ))}
          {protectedRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={
                <ProtectedRoute>
                  <route.component />
                </ProtectedRoute>
              }
            />
          ))}
          <Route path="/*" element={<NotFound></NotFound>}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
