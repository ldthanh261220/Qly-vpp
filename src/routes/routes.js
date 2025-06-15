import config from '~/config';

// Pages
import Home from '~/pages/Home';
import Kehoach from '~/pages/Kehoach';
import NghiemThuTaiSan from '~/pages/Nghiemthu';
import ChitietNghiemThu from '~/pages/Nghiemthu/Chitietnghiemthu';
import Profile from '~/pages/Profile';
import SendRequest from '~/pages/SendRequest';
import Qly from '~/pages/Qlytaikhoan';
import Phanquyen from '~/pages/Phanquyen';
import Moithau from '~/pages/Moithau';
import ChiTietGoiThau from '~/pages/Moithau/chitietmoithau';

import ChiTietKeHoach from '~/pages/Kehoach/chitietkehoach';
import ThemKeHoach from '~/pages/Kehoach/themkehoach';
import SuaKeHoach from '~/pages/Kehoach/updatekehoach';
import TaoMoiHoSoMoiThau from '~/pages/Moithau/Taohoso';

import QlyNhaThau from '~/pages/NhaThau/QlyNhaThau';
import ChiTietNhaThau from '~/pages/NhaThau/ChiTietNhaThau/ChiTietNhaThau';
import QlyHopDong from '~/pages/HopDong/QlyHopDong';
import ChiTietHopDong from '~/pages/HopDong/ChiTietHopDong/ChiTietHopDong';

import Dsthietbi from '~/pages/Dsthietbi';
import Duyetkehoach from '~/pages/Duyetkhms';
import Duyetnhathau from '~/pages/Duyetkcnt';
import Duyetngansach from '~/pages/Duyetngansach';
import Thanhtoanhopdong from '~/pages/Thanhtoanhopdong';
import Dashboard from '~/pages/Dashboard/Dashboard';

import Locthietbi from '~/pages/Dsthietbi/Locthietbi';
import QLyYeuCau from '~/pages/YeuCau/QLyYeuCau';
import ChiTietYeuCau from '~/pages/YeuCau/ChiTietYeuCau/ChiTietYeuCau';
import Qlytaikhoan from '~/pages/Qlytaikhoan';
import Qlythietbi from '~/pages/Qlythietbi';
import GoiThauForm from '~/pages/Moithau/Taogoithau';
import CapNhatPhienThau from '~/pages/Moithau/Suaphiendauthau';

import TaoHopDong from '~/pages/HopDong/TaoHopDong/TaoHopDong';
import TaoNhaThau from '~/pages/NhaThau/TaoNhaThau/TaoNhaThau';
import SuaChitietNghiemThu from '~/pages/Nghiemthu/Suachitietnghiemthu';
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
    
    { path: config.routes.Chitietmoithau, component:ChiTietGoiThau},
    { path: config.routes.Taohosomoithau, component:TaoMoiHoSoMoiThau},
     { path: config.routes.Taogoithau, component: GoiThauForm },
  { path: config.routes.SuaGoiThau, component: GoiThauForm },
  { path: config.routes.ChiTietGoiThau, component: GoiThauForm },
     { path: config.routes.Suakehoach, component:SuaKeHoach},
    { path: config.routes.Suaphiendauthau, component:CapNhatPhienThau},
    { path: config.routes.Qlytaikhoan, component: Qlytaikhoan },
    { path: config.routes.Quanlythietbi, component: Qlythietbi },

    { path: config.routes.Phanquyen, component: Phanquyen },

    { path: config.routes.nhathau, component: QlyNhaThau },
    { path: config.routes.chitietnhathau, component: ChiTietNhaThau },
    { path: config.routes.taonhathau, component: TaoNhaThau },
    { path: config.routes.hopdong, component: QlyHopDong },
    { path: config.routes.chitiethopdong, component: ChiTietHopDong },
    { path: config.routes.taohopdong, component: TaoHopDong },
    { path: config.routes.yeucau, component: QLyYeuCau },
    { path: config.routes.chitietyeucau, component: ChiTietYeuCau },
    { path: config.routes.dashboard, component: Dashboard },

    { path: config.routes.Dsthietbi, component: Dsthietbi },
    { path: config.routes.Locthietbi, component: Locthietbi },
    { path: config.routes.Duyetkehoach, component: Duyetkehoach },
    { path: config.routes.Duyetnhathau, component: Duyetnhathau },
    { path: config.routes.Duyetngansach, component: Duyetngansach },
    { path: config.routes.Thanhtoanhopdong, component: Thanhtoanhopdong },
    { path: config.routes.Capnhanghiemthu, component: SuaChitietNghiemThu },

];

const privateRoutes = [];

export { publicRoutes, privateRoutes };
