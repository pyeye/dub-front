import Vue from 'vue';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import Notifications from 'vue-notification';
import Vuelidate from 'vuelidate';
import { Switch, Checkbox, Select, InputNumber, Dialog, Collapse, CollapseItem } from 'element-ui';

import DubButton from './components/base/DubButton';
import DubInput from './components/base/DubInput';
import Response from './directives/response/response';
import './directives/response/response.scss';
import './../node_modules/swiper/dist/css/swiper.min.css';
import './style/theme.scss';
import './icons/index';


import App from './App';
import router from './router';
import store from './store';


Vue.config.productionTip = false;

Vue.directive('response', Response);

Vue.component('dub-button', DubButton);
Vue.component('dub-input', DubInput);

// element ui
Vue.component(Switch.name, Switch);
Vue.component(Checkbox.name, Checkbox);
Vue.component(Select.name, Select);
Vue.component(InputNumber.name, InputNumber);
Vue.component(Dialog.name, Dialog);
Vue.component(Collapse.name, Collapse);
Vue.component(CollapseItem.name, CollapseItem);

Vue.use(Vuelidate);
Vue.use(VueAwesomeSwiper);
Vue.use(Notifications);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  validations: {},
});
