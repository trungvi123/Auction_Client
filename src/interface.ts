export interface IMyModal {
  show: boolean;
  status: string;
}

export interface IUi {
  menuSidebarCollapsed: boolean;
  controlSidebarCollapsed: boolean;
}

export interface IUtils {
  prodDescription: string;
  prodName: string;
}

export interface IAuth {
  email: string;
  _id: any;
  lastName: string;
  basicUser: boolean;
  productPermission: string[];
  freeProductPermission: string[];
}

export interface ISearchModal {
  show: boolean;
}

export interface IRootState {
  myModal: IMyModal;
  searchModal: ISearchModal;
  auth: IAuth;
  utils: IUtils;
  ui: IUi;
}

// interface for product

export interface IProduct {
  auctionEnded: boolean;
  auctionStarted: boolean;
  basePrice: any;
  bids: string[];
  stateSlug: string;
  state: string;
  category: any;
  price: any;
  createdAt: string;
  currentPrice: any;
  description: string;
  checkoutTypeSlug: string;
  auctionTypeSlug: string;
  duration: number;
  endTime: string;
  images: string[];
  name: string;
  owner: any;
  sold: boolean;
  startTime: string;
  stepPrice: any;
  updatedAt: string;
  _id: string;
  room: string;
}

export interface IFreeProduct {
  category: string;
  createdAt: string;
  currentPrice: any;
  description: string;
  images: string[];
  name: string;
  owner: string;
  sold: boolean;
  createAt: string;
  updatedAt: string;
  _id: string;
}
