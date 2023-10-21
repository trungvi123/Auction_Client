import Footer from "../../components/Footer";
import Header from "../../components/Header";
import "./AdminDefaultLayout.css";

const AdminDefaultLayout: any = ({ children }: any) => {
  return (
    <div>
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  );
};

export default AdminDefaultLayout;
