import Footer from "../../components/Footer";
import Header from "../../components/Header";

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
