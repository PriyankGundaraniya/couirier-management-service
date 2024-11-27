import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/header/header";
import Home from "./components/home/home";
import Login from "./components/login/login";
import SetItem from "./components/setItem/setItem";
import SendPlacetable from "./components/itemtable/sendPlacetable";
import ItemTable from "./components/itemtable/itemTable";
import ColorTable from "./components/itemtable/colorTable";
import HomePaid from "./components/home/homePaid";
import HomeTopay from "./components/home/homeTopay";
import { useEffect, useState } from "react";
import { CONSTANTS } from "./utils/contants";
import General from "./components/general/general";
import LrEdit from "./components/LrEdit/LrEdit";
import Manual from "./components/manual/manual";
import Access from "./components/access/access";
import { Toaster } from 'react-hot-toast';

function App() {
  const navigate = useNavigate();
  const [hasUser, setHasUser] = useState(false);
  const type = localStorage.getItem(CONSTANTS.USER_TYPE);
  useEffect(() => {
    const isUser = localStorage.getItem(CONSTANTS.USER_TYPE);
    if (isUser) {
      setHasUser(true);
    } else {
      setHasUser(false);
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (hasUser) {
      const type = localStorage.getItem(CONSTANTS.USER_TYPE);
      if (type !== "admin") {
        navigate("/");
      } else {
        navigate("/setting/items");
      }
    } else {
      navigate("/login");
    }
  }, [hasUser]);

  return (
    <div>
      <Toaster position="top-right" />
      {(window.location.pathname !== "/login" 
        // window.location.pathname !== "/setting/items" &&
        // window.location.pathname !== "/setting/color" &&
        // window.location.pathname !== "/setting/sendplace"
        ) && <Header />}

      <Routes>
        <Route path="/login" element={<Login />} />
        {type !== "admin" &&
        <>
          <Route path="/" element={<Home />} />
        <Route path="/lr" element={<LrEdit />} />
        <Route path="/general" element={<General />} />
        <Route path="/manual" element={<Manual />} />
        <Route path="*" element={<Navigate to={"/"} />} />
        </>}
        {type === "admin" &&
          <>
          <Route path="/setting/items" element={<ItemTable />} />
        <Route path="/setting/color" element={<ColorTable />} />
        <Route path="/setting/sendplace" element={<SendPlacetable />} />
        <Route path="/setting/access" element={<Access />} />
          <Route path="/lr" element={<LrEdit />} />
        <Route path="*" element={<Navigate to={"/setting/items"} />} />
          </>
        }
      </Routes>
    </div>
  );
}

export default App;
