export interface IMyModal {
    show:boolean
}

export interface ISearchModal {
    show:boolean
}

export interface IRootState {
    myModal : IMyModal,
    searchModal : ISearchModal
    
}