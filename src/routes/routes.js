import config from '~/config';

// Pages
import Home from '~/pages/Home';
import Kehoach from '~/pages/Kehoach';
import NghiemThuTaiSan from '~/pages/Nghiemthu';
import ChitietNghiemThu from '~/pages/Nghiemthu/Chitietnghiemthu';
import Profile from '~/pages/Profile';
import SendRequest from '~/pages/SendRequest';

import Moithau from '~/pages/Moithau';
import Solanmoithau from '~/pages/Moithau/solanmoithau';
import ChiTietGoiThau from '~/pages/Moithau/chitietmoithau';

import ChiTietKeHoach from '~/pages/Kehoach/chitietkehoach';
import ThemKeHoach from '~/pages/Kehoach/themkehoach';
import SuaKeHoach from '~/pages/Kehoach/updatekehoach';
import TaoMoiHoSoMoiThau from '~/pages/Moithau/Taohoso';

// Public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.profile, component: Profile },
    { path: config.routes.sendrequest, component: SendRequest },
    { path: config.routes.Kehoach, component: Kehoach },
    { path: config.routes.Chitietkehoach, component:ChiTietKeHoach },
    { path: config.routes.Themkehoach, component:ThemKeHoach },
    { path: config.routes.Nghiemthu, component:NghiemThuTaiSan },
    { path: config.routes.Chitietnghiemthu, component:ChitietNghiemThu },
    { path: config.routes.Moithau, component:Moithau},
    { path: config.routes.Solandauthau, component:Solanmoithau},
    { path: config.routes.Chitietmoithau, component:ChiTietGoiThau},
    { path: config.routes.Taohosomoithau, component:TaoMoiHoSoMoiThau},
     { path: config.routes.Suakehoach, component:SuaKeHoach}

];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
