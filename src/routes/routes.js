import config from '~/config';

// Pages
import Home from '~/pages/Home';
import Profile from '~/pages/Profile';
import SendRequest from '~/pages/SendRequest';
import ChiTietYeuCau from '~/pages/ChiTietYeuCau';

// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.sendrequest, component: SendRequest },
    { path: config.routes.sendrequestDetail, component: ChiTietYeuCau }, // thêm dòng này
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
