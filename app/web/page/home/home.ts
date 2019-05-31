// ts热加载
if ((module as any).hot) {
    (module as any).hot.accept();
}
// import './home.html';
import './home.scss';
import Vue from 'vue';
import Home from './home.vue';
new Vue({
    el: '#app',
    components: {
        Home
    }
});



