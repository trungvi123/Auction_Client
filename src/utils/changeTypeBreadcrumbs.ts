const types = [
  {
    path: "cuoc-dau-gia",
    translate: "Cuộc đấu giá",
  },
  {
    path: "sach",
    translate: "Sách",
  },
  {
    path: "quan-ao",
    translate: "Quần áo",
  },
  {
    path: "do-gia-dung",
    translate: "Đồ gia dụng",
  },
  {
    path: "tai-san-dau-gia",
    translate: "Tài sản đấu giá",
  },
  {
    path: "tin-tuc",
    translate: "Tin tức",
  },
];

const changeTypeBreadcrumbs = (type: string) => {
  let result: any = null;
  for (let i = 0; i < types.length; i++) {
    if (types[i].path === type) {
      result = types[i].translate;
    }
  }
  if(result) return result
  return type;
};

export default changeTypeBreadcrumbs;
