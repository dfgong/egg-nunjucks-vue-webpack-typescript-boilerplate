// ts热加载
if ((module as any).hot) {
    (module as any).hot.accept();
}
// import './home.html';
import './home.scss';
import { a } from "../../common/ts/base";

const aa = 2;
let b = 5;
const c = () => {
    if(a) {
        b = 4;
    }
}
c()
