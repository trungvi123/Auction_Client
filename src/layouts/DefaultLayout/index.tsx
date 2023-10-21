import Header from "../../components/Header";
import Footer from "../../components/Footer";
import './DefaultLayout.css'
import { useSelector } from "react-redux";
import { IRootState } from "../../interface";
import Fireworks from "../../components/Fireworks";

const DefaultLayout:any = ({children}:any) => {
  const fire = useSelector((e:IRootState)=>e.ui.fireworks)
  return (
    <div style={{position:'relative'}}>
      {fire && <Fireworks></Fireworks>}
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  );
};

export default DefaultLayout;
