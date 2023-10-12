import Footer from "../../components/Footer";
import Header from "../../components/Header";
import "./AdminDefaultLayout.css";

const AdminDefaultLayout: any = ({ children }: any) => {
  return (
    <div>
      <Header isAdmin={true}></Header>
      {children}
      <Footer></Footer>
    </div>
  );
};

export default AdminDefaultLayout;
