import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";

const ApiService = {
  init() {
    Vue.use(VueAxios, axios);
    Vue.axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;
  },
  get(resource, params) {
    return Vue.axios.get(`${resource}`, { params });
  },
  post(resource, params) {
    return Vue.axios.post(`${resource}`, params);
  },
  put(resource, params) {
    return Vue.axios.put(`${resource}`, params);
  },
  delete(resource) {
    return Vue.axios.delete(`${resource}`);
  }
};

export default ApiService;
