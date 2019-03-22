// ts热加载
if ((module as any).hot) {
    (module as any).hot.accept();
}
// import './home.html';
import './home.scss';

const a = 2;
let b = 5;
const c = () => {
    if(a) {
        b = 4;
    }
}
c()
console.log(b+1);