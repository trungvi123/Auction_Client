const formatMoney = (money?: any) => {
  if (money) {
    
    return Number(money).toLocaleString("vi", { style: "currency", currency: "VND" });
    // return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
  }
  return "";
};

export default formatMoney;
