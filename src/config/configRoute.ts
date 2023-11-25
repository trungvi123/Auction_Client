import routes from "../routes";
import {
  Home,
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
  Introduce,
  Contact,
  Store,
  ContactManagement,
  ManagementNews,
  NewsManagement,
  NewsDetail,
  // Share
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
  { path: routes.introduce, element: Introduce },
  { path: routes.contact, element: Contact },
  { path: routes.store, element: Store },
  { path: routes.newsManagement, element: ManagementNews },
  { path: routes.newsDetail, element: NewsDetail }


];

export const privateRoute: IRoute[] = [
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
  {
    path: routes.Adcontact,
    element: ContactManagement,
    layout: "AdminDefaultLayout",
  },
  {
    path: routes.AdNews,
    element: NewsManagement,
    layout: "AdminDefaultLayout",
  },
];