import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const DefaultLayout:any = ({children}:any) => {
  return (
    <div>
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  );
};

export default DefaultLayout;
