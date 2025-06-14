
const routes = {
    home: '/',
    profile: '/@:nickname',
    sendrequest: '/sendrequest',

    Kehoach: '/kehoach',
    Chitietkehoach: '/kehoach/:maKeHoach',
    Themkehoach: '/themkehoach',
    Suakehoach: '/suakehoach/:id',
    Nghiemthu: '/nghiemthu',
    Chitietnghiemthu: '/nghiemthu/:id',
    Moithau:'/moithau',
    Solandauthau:'/moithau/:idphieu',
    Chitietmoithau:'/phieuthau/:id',
    Taohosomoithau:'/taohosomoithau',

    Qlytaikhoan: '/qlytaikhoan',
    Dsthietbi: '/dsthietbi',
    Locthietbi: '/Locthietbi',
    Phanquyen: '/phanquyen',
    Quanlythietbi: '/Quanlythietbi',

    nhathau: '/nhathau',
    chitietnhathau: '/nhathau/:id',
    hopdong: '/hopdong',
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
