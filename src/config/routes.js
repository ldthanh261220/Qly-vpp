
const routes = {
    home: '/',
    profile: '/@:nickname',
    sendrequest: '/sendrequest',

    Kehoach: '/kehoach',
    Chitietkehoach: '/kehoach/:maKeHoach',
    Themkehoach: '/themkehoach',
    Suakehoach: '/suakehoach/:id',
    Nghiemthu: '/nghiemthu',
    Capnhanghiemthu: '/capnhatnghiemthu/:id',
    
    Chitietnghiemthu: '/nghiemthu/:id',
    Moithau:'/moithau',
    Solandauthau:'/moithau/:idphieu',
    Chitietmoithau:'/phieuthau/:id',
    Taohosomoithau:'/taohosomoithau',
    Taogoithau: '/taogoithau',
    Suaphiendauthau: '/suaphiendauthau/:id',
    SuaGoiThau: '/suagoithau/:maGoiThau',
    ChiTietGoiThau: '/chitietgoithau/:maGoiThau',

    Qlytaikhoan: '/qlytaikhoan',
    Dsthietbi: '/dsthietbi',
    Locthietbi: '/Locthietbi',
    Phanquyen: '/phanquyen',
    Quanlythietbi: '/Quanlythietbi',

    nhathau: '/nhathau',
    chitietnhathau: '/nhathau/:id',
    taonhathau: '/taonhathau',
    hopdong: '/hopdong',
    taohopdong: '/taohopdong',
    chitiethopdong: 'hopdong/:id',
    dashboard: '/dashboard',
    yeucau: '/yeucau',
    chitietyeucau: '/yeucau/:id',

    // Thịnh
    Duyetkehoach: '/Duyetkehoachmuasam',
    Duyetnhathau: '/Duyetnhathau',
    Duyetngansach: '/Duyetngansach',
    Thanhtoanhopdong: '/Thanhtoanhopdong',

};

export default routes;
