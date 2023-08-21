import Header from "../../components/Header";
import Footer from "../../components/Footer";
import './DefaultLayout.css'

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
