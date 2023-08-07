import routes from "../routes";
import { Home, Management, News,Register } from "../pages";

interface IRoute {
  path: string;
  element: any;
  layout?: string;
}
export const publicRoute: IRoute[] = [
  { path: routes.home, element: Home },
  { path: routes.news, element: News },
  { path: routes.register, element: Register },

];

export const privateRoute: IRoute[] = [
  { path: routes.management, element: Management },
];
