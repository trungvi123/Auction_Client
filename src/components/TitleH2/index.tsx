import { arrowTitleLeft, arrowTitleRight } from "../../asset/images";
import "./TitleH2.css";

interface IProps {
  title: string;
}

const TitleH2 = ({ title = "" }: IProps) => {
  return (
    <div className="title-box">
      <div>
        <img src={arrowTitleLeft} alt="iconL" />
      </div>
      <div>
        <h2 className="title-content">{title}</h2>
      </div>
      <div>
        <img src={arrowTitleRight} alt="iconR" />
      </div>
    </div>
  );
};
export default TitleH2;
