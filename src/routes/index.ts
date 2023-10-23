const routes = {
  home: "/",
  news: "/news",
  management: "/management",
  register: "/dang-ky",
  forgotPass: "/quen-mat-khau",
  productDetail: "/chi-tiet-dau-gia/:id",
  freeProductDetail: "/chi-tiet-chia-se/:id",
  receivedList: "/danh-sach/:id",
  createAuction: "/tao-dau-gia",
  productList: "/danh-muc-tai-san/:cate?",
  createFreeProduct: "/chia-se-vat-pham",
  checkOut: "/thanh-toan/:type?/:id",
  search: "/tim-kiem",
  managementAuction: "/quan-li-dau-gia",
  editAuction: "/chinh-sua-dau-gia/:id",
  editFreeProduct: "/chinh-sua-chia-se/:id",
  profile: "/profile",
  introduce: "/gioi-thieu",
  contact: "/lien-he",
  // share: "/share/:type/:id",


  dashboard: "/admin/dashboard",
  ui: "/admin/ui",
  reports: "/admin/reports",
  AdUsers: "/admin/users",
  AdAuction: "/admin/auction",
};

export default routes;
