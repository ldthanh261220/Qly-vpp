import config from '~/config';

// Pages
import Home from '~/pages/Home';
import Profile from '~/pages/Profile';
import SendRequest from '~/pages/SendRequest';
import Qly from '~/pages/Qlytaikhoan';
import Phanquyen from '~/pages/Phanquyen';
import Dsthietbi from '~/pages/Dsthietbi';
// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.sendrequest, component: SendRequest },
    { path: config.routes.Qlytaikhoan, component: Qly },
    { path: config.routes.Phanquyen, component: Phanquyen },
    { path: config.routes.Dsthietbi, component: Dsthietbi },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
