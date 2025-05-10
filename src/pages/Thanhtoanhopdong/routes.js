import config from '~/config';

// Pages
import Home from '~/pages/Home';
import Duyetkehoach from '~/pages/Duyetkhms';
import Duyetnhathau from '~/pages/Duyetkcnt';
import Duyetngansach from '~/pages/Duyetngansach';
import Thanhtoanhopdong from '~/pages/Thanhtoanhopdong';
// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.Duyetkehoach, component: Duyetkehoach },
    { path: config.routes.Duyetnhathau, component: Duyetnhathau },
    { path: config.routes.Duyetngansach, component: Duyetngansach },
    { path: config.routes.Thanhtoanhopdong, component: Thanhtoanhopdong },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
