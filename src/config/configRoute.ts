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
  Dashboard,
  AuctionManagement,
  UsersManagement,
  CreateFreeProduct,
  Checkout,
  EditFreeProduct,
  FreeProductDetail,
  ReceivedList,
  ProductList,
  Search,
  ReportManagement,
  Profile,
  UiManagement,
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
  { path: routes.createFreeProduct, element: CreateFreeProduct },
  { path: routes.checkOut, element: Checkout },
  { path: routes.editFreeProduct, element: EditFreeProduct },
  { path: routes.freeProductDetail, element: FreeProductDetail },
  { path: routes.receivedList, element: ReceivedList },
  { path: routes.productList, element: ProductList },
  { path: routes.search, element: Search },
  { path: routes.profile, element: Profile },
];

export const privateRoute: IRoute[] = [
  { path: routes.management, element: Management },
  { path: routes.ui, element: UiManagement },
  { path: routes.dashboard, element: Dashboard, layout: "AdminDefaultLayout" },
  {
    path: routes.AdAuction,
    element: AuctionManagement,
    layout: "AdminDefaultLayout",
  },
  {
    path: routes.AdUsers,
    element: UsersManagement,
    layout: "AdminDefaultLayout",
  },
  {
    path: routes.reports,
    element: ReportManagement,
    layout: "AdminDefaultLayout",
  },
];
