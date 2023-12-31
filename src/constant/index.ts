const baseUrl = 'http://localhost:3000'
// const baseUrl = 'https://auction-server-nu.vercel.app'


const auctionType: any = {
  "dau-gia-xuoi": "Đấu giá xuôi (trả giá lên)",
  "dau-gia-nguoc": "Đấu giá ngược (trả giá xuống)",
};
const checkoutType: any = {
  cod: "Thanh toán khi nhận hàng",
  payment: "Chuyển khoản qua Paypal",
};

const reportType: any = {
  "qua-han-thanh-toan": "Quá hạn thanh toán",
  "khong-nhan-hang": "Người mua không nhận hàng",
  "khong-nhan-duoc-hang": "Người bán không gửi hàng",
};

export { auctionType,baseUrl, checkoutType,reportType };
