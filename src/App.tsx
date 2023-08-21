import { Route, Routes } from "react-router-dom";
import { publicRoute, privateRoute } from "./config/configRoute";
import DefaultLayout from "./layouts/DefaultLayout";
import SecondLayout from "./layouts/SecondLayout";
import { Fragment } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MyModal from "./components/MyModal";
import SearchModal from "./components/SearchModal";
import { Toaster } from "react-hot-toast";
import ThirdLayout from "./layouts/ThirdLayout";

function App() {
  return (
    <div className="App">
      <Routes>
        {publicRoute.map((item, index) => {
          let Layout: any = DefaultLayout;
          if (item.layout === "SecondLayout") {
            Layout = SecondLayout;
          }else if(item.layout === "ThirdLayout"){
            Layout = ThirdLayout;
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
      </Routes>
      <MyModal placement={"top"} name={"myModal"}></MyModal>
      <SearchModal placement={"top"} name={"searchModal"}></SearchModal>
      <Toaster position="top-left" reverseOrder={true} />
    </div>
  );
}

export default App;
