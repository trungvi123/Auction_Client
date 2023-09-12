import AdminHeader from "../../components/Admin/AdminHeader";
import Footer from "../../components/Footer";
import "./AdminDefaultLayout.css";

const AdminDefaultLayout: any = ({ children }: any) => {
  return (

    <div className="d-flex h-100">
      <div className="ad-content">
        <AdminHeader></AdminHeader>
        {children}
        <Footer></Footer>
      </div>
    </div>
  );
};

export default AdminDefaultLayout;
