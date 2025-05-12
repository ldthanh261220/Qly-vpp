import config from '~/config';

// Pages
import Home from '~/pages/Home';
import Profile from '~/pages/Profile';
import SendRequest from '~/pages/SendRequest';
import Qly from '~/pages/Qlytaikhoan';
import Phanquyen from '~/pages/Phanquyen';
import QlyNhaThau from '~/pages/NhaThau/QlyNhaThau';
import ChiTietNhaThau from '~/pages/NhaThau/ChiTietNhaThau/ChiTietNhaThau';
import QlyHopDong from '~/pages/HopDong/QlyHopDong';
import ChiTietHopDong from '~/pages/HopDong/ChiTietHopDong/ChiTietHopDong';
// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.sendrequest, component: SendRequest },
    { path: config.routes.Qlytaikhoan, component: Qly },
    { path: config.routes.Phanquyen, component: Phanquyen },
    { path: config.routes.nhathau, component: QlyNhaThau },
    { path: config.routes.chitietnhathau, component: ChiTietNhaThau },
    { path: config.routes.hopdong, component: QlyHopDong },
    { path: config.routes.chitiethopdong, component: ChiTietHopDong },
];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
