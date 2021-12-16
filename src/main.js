import Vue from 'vue';
import uView from "uview-ui";
Vue.use(uView);

import App from './App';
import Bmob from "hydrogen-js-sdk";

Bmob.initialize("08bb8bb9c1ad92e8", "123456");

Vue.config.productionTip = false;
Vue.prototype.Bmob = Bmob;

App.mpType = 'app';

const app = new Vue({
    ...App
});
app.$mount();
