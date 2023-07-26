import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { FaSignOutAlt } from "react-icons/fa";
const Signout = () => {
  const navigate = useNavigate();
  const { signout } = useContext(UserContext);

  const handleSignout = () => {
    signout();
    navigate("/giris");
  };

  return (
    <Button className="bg-danger text-light" onClick={handleSignout}>
      <FaSignOutAlt></FaSignOutAlt>
    </Button>
  );
};

export default Signout;
