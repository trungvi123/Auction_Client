
import Breadcrumbs from "../../components/Breadcrumbs";
import Footer from "../../components/Footer";
import Header from "../../components/Header";

const ThirdLayout = ({ children }: any) => {
  return (
    <div>
      <Header></Header>
      <Breadcrumbs></Breadcrumbs>
      {children}
      <Footer></Footer>
    </div>
  );
};

export default ThirdLayout;
