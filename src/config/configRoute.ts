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
  EditAuction,
  Dashboard,AuctionManagement,UsersManagement
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
  { path: routes.editAuction, element: EditAuction },

  //test , khi test xong để vào private

  { path: routes.dashboard, element: Dashboard, layout: "AdminDefaultLayout" },
  { path: routes.AdAuction, element: AuctionManagement, layout: "AdminDefaultLayout" },
  { path: routes.AdUsers, element: UsersManagement, layout: "AdminDefaultLayout" },

];

export const privateRoute: IRoute[] = [
  { path: routes.management, element: Management },
];
