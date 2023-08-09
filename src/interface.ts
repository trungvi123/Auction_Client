export interface IMyModal {
  show: boolean;
  status: string;
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
}
