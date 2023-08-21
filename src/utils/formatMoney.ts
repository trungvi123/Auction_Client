const formatMoney = (money?: any) => {
    if(money){
        return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " VND";
    }
    return ''
};

export default formatMoney;
