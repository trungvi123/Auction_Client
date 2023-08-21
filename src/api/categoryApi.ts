import axiosClient from "./axiosClient";
import apiConfig from "./axiosConfig";


const categoryApi = {
    getCategoryById: (id: string) => {
      const url = apiConfig.baseUrl + `category/${id}`;
      return axiosClient.get(url);
    },
    getAllCategory: () => {
      const url = apiConfig.baseUrl + `category`;
      return axiosClient.get(url);
    },
  };
  
  export default categoryApi;