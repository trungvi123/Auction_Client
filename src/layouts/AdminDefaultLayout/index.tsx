import AdminHeader from "../../components/Admin/AdminHeader";
import Footer from "../../components/Footer";
import "./AdminDefaultLayout.css";

const AdminDefaultLayout: any = ({ children }: any) => {
  return (
    <div>
      <AdminHeader></AdminHeader>
      {children}
      <Footer></Footer>
    </div>
  );
};

export default AdminDefaultLayout;
