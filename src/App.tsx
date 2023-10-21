import { Route, Routes } from "react-router-dom";
import { publicRoute, privateRoute } from "./config/configRoute";
import DefaultLayout from "./layouts/DefaultLayout";
import SecondLayout from "./layouts/SecondLayout";
import { Fragment, useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MyModal from "./components/MyModal";
import SearchModal from "./components/SearchModal";
import { Toaster } from "react-hot-toast";
import ThirdLayout from "./layouts/ThirdLayout";
import AdminDefaultLayout from "./layouts/AdminDefaultLayout";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "./interface";
import { Home } from "./pages";
import userApi from "./api/userApi";
import { setImages } from "./redux/uiSlice";
import Favicon from 'react-favicon';

function App() {
  const dispatch = useDispatch();
  const basicUser = useSelector((e: IRootState) => e.auth.basicUser);
  const changeTheme = useSelector((e: IRootState) => e.ui.changeTheme);
  const [favicon,setFavicon] = useState<string>('')
  let totalRoute = publicRoute;
  if (!basicUser) {
    totalRoute = [...publicRoute, ...privateRoute];
  } 
  useEffect(() => {
    const fetchTheme = async () => {
      const res: any = await userApi.getTemplateActive();
      if (res?.status === "success") {
        document.body.style.setProperty(
          `--primary-color`,
          res.data.colors[0].color_primary
        );
        document.body.style.setProperty(
          `--second-color`,
          res.data.colors[0].color_secondary
        );

        dispatch(
          setImages({
            short_intro: res.data.images[0].img_intro_homePage,
            logo: res.data.images[0].img_logo,
            mini_logo: res.data.images[0].img_mini_logo,
            breadcrum: res.data.images[0].img_breadcrum,
          })
        );
        setFavicon(res.data.images[0].img_mini_logo)
      }
    };
    fetchTheme();
  }, [changeTheme, dispatch]);

  return (
    <div className="App">
      <Favicon url={favicon} />
      <Routes>
        {totalRoute.map((item, index) => {
          let Layout: any = DefaultLayout;
          if (item.layout === "SecondLayout") {
            Layout = SecondLayout;
          } else if (item.layout === "ThirdLayout") {
            Layout = ThirdLayout;
          } else if (item.layout === "AdminDefaultLayout") {
            Layout = AdminDefaultLayout;
          } else if (item.layout === null) {
            Layout = Fragment;
          }
          return (
            <Route
              key={index}
              path={item.path}
              element={
                <Layout>
                  <item.element></item.element>
                </Layout>
              }
            ></Route>
          );
        })}

        <Route
          path="*"
          element={
            <DefaultLayout>
              <Home></Home>
            </DefaultLayout>
          }
        ></Route>
      </Routes>
      <MyModal placement={"top"} name={"myModal"}></MyModal>
      <SearchModal placement={"top"} name={"searchModal"}></SearchModal>
      <Toaster
        position="top-left"
        reverseOrder={true}
        toastOptions={{
          duration: 6000,
          // Default options for specific types
          success: {
            duration: 5000,
          },
        }}
      />
    </div>
  );
}

export default App;
