

export interface IMyModal {
  show: boolean;
  status: string;
}

export interface IUtils {
  prodDescription:string
}

export interface IAuth {
  email: string;
  _id: any;
  lastName: string;
}

export interface ISearchModal {
  show: boolean;
}

export interface IRootState {
  myModal: IMyModal;
  searchModal: ISearchModal;
  auth: IAuth;
  utils:IUtils
}

// interface for product

export interface IProduct {
  auctionEnded: boolean;
  auctionStarted: boolean;
  basePrice: any;
  bids: string[];
  category: string;
  price:any;
  createdAt: string;
  currentPrice: any;
  description: string;
  duration: number;
  endTime: string;
  images: string[];
  name: string;
  owner: string;
  sold: boolean;
  startTime: string;
  stepPrice: any;
  updatedAt: string;
  _id: string;
}
