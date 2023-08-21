import routes from "../routes";
import {
  Home,
  Management,
  News,
  Register,
  ForgotPass,
  ProductDetail,
  CreateAuction,
  ManagementAuction,
} from "../pages";

interface IRoute {
  path: string;
  element: any;
  layout?: string;
}

export const publicRoute: IRoute[] = [
  { path: routes.home, element: Home },
  { path: routes.news, element: News },
  { path: routes.register, element: Register },
  { path: routes.forgotPass, element: ForgotPass, layout: "SecondLayout" },
  { path: routes.productDetail, element: ProductDetail },
  { path: routes.createAuction, element: CreateAuction },
  { path: routes.managementAuction, element: ManagementAuction },
];

export const privateRoute: IRoute[] = [
  { path: routes.management, element: Management },
];
