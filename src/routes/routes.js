import config from '~/config';

// Pages
import Home from '~/pages/Home';
import Profile from '~/pages/Profile';
import SendRequest from '~/pages/SendRequest';

// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.sendrequest, component: SendRequest },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
