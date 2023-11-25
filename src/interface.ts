export interface IMyModal {
  show: boolean;
  status: string;
}

export interface IProductSlice {
  happenningProduct: IProduct[];
  upcomingProduct: IProduct[];
}

export interface IUi {
  fireworks: boolean;
  changeTheme: boolean;
  images: {
    short_intro: string;
    logo: string;
    mini_logo: string;
    breadcrum: string;
  };
  inforPage: {
    shortIntro: string;
    longIntro: string;
    address: string;
    phoneNumber: string;
    email: string;
    map: string;
    mst: string;
  };
}

export interface IUtils {
  prodName: string;
}

export interface IAuth {
  email: string;
  emailPaypal: string;
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
  product: IProductSlice;
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
  follower: string[];
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
  outOfStock: boolean;
  images: string[];
  name: string;
  owner: string;
  sold: boolean;
  createAt: string;
  updatedAt: string;
  _id: string;
}
