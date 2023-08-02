import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  NavItem,
  NavbarBrand,
  NavbarToggler,
  Collapse,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { UserContext } from "../context/UserContext";
import logo from "../assets/logo.svg";
import Signout from "./SignOut";

const Header = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);
  const togglePanel = () => setPanelOpen((prevState) => !prevState);
  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  useEffect(() => {
    if (user) {
      setIsAuth(user.isAdmin);
    }
    setLoading(false);
  }, [user]);
  if (loading) {
    return <div>...</div>;
  } else {
    return (
      <Navbar id="header" light expand="md">
        <NavbarBrand className="mr-auto">
          <div className="d-flex align-items-center">
            <img
              src={logo}
              className="pe-2 border-end border-black border-3"
              alt="Cook Book Logo"
            />
            <span>COOK BOOK</span>
          </div>
        </NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar className="flex-grow-0 mr-auto">
          <Nav className="ml-auto " navbar>
            <NavItem>
              <Link to="/" className="nav-link ">
                Anasayfa
              </Link>
            </NavItem>
            {user ? (
              <>
                <NavItem>
                  <Link to="/yemekler" className="nav-link">
                    Ne Yiyebilirim?
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/tarifler" className="nav-link">
                    Yemekler
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/malzemeler" className="nav-link">
                    Malzemelerim
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/mekanlar" className="nav-link">
                    Mekanlar
                  </Link>
                </NavItem>
                <div className="d-flex flex-row justify-content-between align-items-center">
                  <NavItem className="nav-item-username ">
                    <Dropdown
                      isOpen={dropdownOpen}
                      toggle={toggleDropdown}
                      direction={"down"}
                    >
                      <DropdownToggle caret className="mx-2">
                        {user.username}
                      </DropdownToggle>
                      <DropdownMenu>
                        <NavItem>
                          <Link
                            to="/favorilerim"
                            className="nav-link border-bottom border-black border-1"
                          >
                            Favorilerim
                          </Link>
                        </NavItem>
                        {isAuth && (
                          <NavItem>
                            <Dropdown
                              isOpen={panelOpen}
                              toggle={togglePanel}
                              className="bg-white"
                            >
                              <DropdownToggle
                                caret
                                className="mx-2 bg-white text-dark my-2 border-0"
                              >
                                Panel
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem>
                                  <Link to="/manage-users">Üyeleri Yönet</Link>
                                </DropdownItem>
                                <DropdownItem divider></DropdownItem>
                                <DropdownItem>
                                  <Link to="/add-igredient">Malzeme ekle</Link>
                                </DropdownItem>
                                <DropdownItem>
                                  <Link to="/manage-ingredient">
                                    Malzemeleri Düzenle
                                  </Link>
                                </DropdownItem>
                                <DropdownItem divider></DropdownItem>
                                <DropdownItem>
                                  <Link to="/add-recipe">Yemek Ekle</Link>
                                </DropdownItem>
                                <DropdownItem>
                                  <Link to="/manage-recipes">
                                    Yemekleri Yönet
                                  </Link>
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </NavItem>
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  </NavItem>

                  <NavItem>
                    <Signout to="/signout" className="nav-link">
                      Sign Out
                    </Signout>
                  </NavItem>
                </div>
              </>
            ) : (
              <>
                <NavItem>
                  <Link to="/giris" className="nav-link">
                    Giriş Yap
                  </Link>
                </NavItem>
                <NavItem>
                  <Link to="/kayit" className="nav-link">
                    Üye Ol
                  </Link>
                </NavItem>
              </>
            )}
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
};

export default Header;
