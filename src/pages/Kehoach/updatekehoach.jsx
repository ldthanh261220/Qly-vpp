import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './themkehoach.scss';

const SuaKeHoach = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [keHoach, setKeHoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dsYeuCau, setDsYeuCau] = useState([]);
  const [dschonYeuCau, setChonYeuCau] = useState([]);


   useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND + `dsyeucau`)
      .then((res) => {
        setDsYeuCau(res.data);
      })
      .catch(() => {
        alert("Không thể tải danh sách yêu cầu từ server");
      });
  }, []);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND}getkehoach?maKeHoach=${id}`)
      .then(res => {
        setChonYeuCau(res.data.yeucau)
        setKeHoach(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        alert("Không thể tải thông tin kế hoạch");
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKeHoach(prev => ({
      ...prev,
      [name]: name === 'chiPhiKeHoach' ? parseFloat(value || 0) : value
    }));
  };
const handleSelectYeuCau = (e) => {
     
    const maYeuCau = Number(e.target.value);
    const selected = dsYeuCau.find((yc) => yc.maYeuCau === maYeuCau);
    if (selected && !dschonYeuCau.find((yc) => yc.maYeuCau === maYeuCau)) {
  
      const updatedList = [...dschonYeuCau, selected];
      setChonYeuCau(updatedList);
      const allThietBi = updatedList.flatMap((yc) => yc.thietbi || []);
      const allMucDich = updatedList.map((yc) => yc.lyDoDeXuat).join(' | ');
      const loaiyc = updatedList[0]?.loaiYeuCau || '';
      
        if (keHoach.loaiyc === '') {
    const ds = dsYeuCau.filter((item) => item.loaiYeuCau === loaiyc);
    setDsYeuCau(ds);
  }

      setKeHoach((prev) => ({
        ...prev,
        maYeuCau: updatedList.map((yc) => yc.maYeuCau),
        loaiyc:loaiyc,
        mucDich: allMucDich,
        chuDautu: selected.chuDauTu || 'Trường đại học Sư phạm Kỹ thuật',
        danhSachThietBi: allThietBi,
      }));

    
    }
  };

  const handleRemoveYeuCau = (maYeuCau) => {

    const updatedList = dschonYeuCau.filter((yc) => yc.maYeuCau !== maYeuCau);
    setChonYeuCau(updatedList);

    
    const allMucDich = updatedList.map((yc) => yc.lyDoDeXuat).join(' | ');
    const loaiyc = updatedList[0]?.loaiYeuCau || '';

    setKeHoach((prev) => ({
      ...prev,
      maYeuCau: updatedList.map((yc) => yc.maYeuCau),
      loaiyc,
      mucDich: allMucDich,
     
    }));

    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const confirm = window.confirm('Bạn có chắc chắn muốn cập nhật kế hoạch này?');
    if (!confirm) return;

    try {
      const ds = dschonYeuCau.map((item) => item.maYeuCau).join(',');

    const keHoachGui = {
      ...keHoach,
      TongHopYeuCau: ds,
      maKeHoach:id
    };
   
    console.log(keHoachGui)
      await axios.put(`${process.env.REACT_APP_BACKEND}/kehoach/update`, keHoachGui);
      alert('Cập nhật thành công');
      navigate('/kehoach');
    } catch (err) {
      console.error(err);
      alert('Lỗi khi cập nhật kế hoạch');
    }
  };

  if (loading) return <div>Đang tải dữ liệu kế hoạch...</div>;
  if (!keHoach) return <div>Không tìm thấy dữ liệu kế hoạch</div>;

  return (
    <div className="form-container">
      <button className="btn-back" onClick={() => navigate(-1)}>← Quay lại</button>
      <h2>Sửa thông tin kế hoạch</h2>
      <form onSubmit={handleSubmit}>
        <table className="form-table">
          <tbody>
             <tr>
              <td><label>Chọn yêu cầu đã duyệt:</label></td>
              <td>
                <select onChange={handleSelectYeuCau}>
                  <option value="">-- Chọn yêu cầu --</option>
                  {dsYeuCau.map((yc) => (
                    <option key={yc.maYeuCau} value={yc.maYeuCau}>
                      {yc.maYeuCau} - {yc.moTaChiTiet}
                    </option>
                  ))}
                </select>
              </td>
            </tr>

            {dschonYeuCau.length > 0 && (
              <tr>
                <td colSpan="2">
                  <div className="selected-list">
                    <strong>Yêu cầu đã chọn:</strong>
                    <ul>
                      {dschonYeuCau.map((yc) => (
                        <li key={yc.maYeuCau}>
                          {yc.maYeuCau} - {yc.lyDoDeXuat}
                          <button type="button" onClick={() => handleRemoveYeuCau(yc.maYeuCau)} style={{ marginLeft: '10px', color: 'red' }}>❌</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </td>
              </tr>
            )}
            <tr>
              <td><label>Tên kế hoạch:</label></td>
              <td><input name="tenKeHoach" value={keHoach.tenKeHoach || ''} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td><label>Loại:</label></td>
              <td>
                <select name="loaiyeucau" value={keHoach.loaiyeucau} onChange={handleChange}>
                  <option value="">-- Chọn loại --</option>
                  <option value="mua sắm">Mua sắm</option>
                  <option value="sửa chữa">Sửa chữa</option>
                </select>
              </td>
            </tr>
            <tr>
              <td><label>Thời gian bắt đầu:</label></td>
              <td><input type="date" name="thoiGianBatDau" value={keHoach.thoiGianBatDau?.slice(0, 10) || ''} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td><label>Thời gian kết thúc:</label></td>
              <td><input type="date" name="thoiGianKetThuc" value={keHoach.thoiGianKetThuc?.slice(0, 10) || ''} onChange={handleChange} /></td>
            </tr>
            <tr>
              <td><label>Chủ đầu tư:</label></td>
              <td><input name="chuBuTu" value={keHoach.chuBuTu || ''} onChange={handleChange} /></td>
            </tr>

            <tr>
              <td><label>Chi phí:</label></td>
              <td><input type="number" name="chiPhiKeHoach" value={keHoach.chiPhiKeHoach || 0} onChange={handleChange} /></td>
            </tr>
          </tbody>
        </table>
        <hr />

        {keHoach.loaiyc === 'mua sắm' ? (
          <table className="plan-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Số lượng</th>
                <th>Mô tả chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {dsYeuCau.map((tb, index) => (
                <tr key={index}>
                  <td>{tb.tenVatDung}</td>
                  <td>{Number(tb.soLuong).toLocaleString()}</td>
                  <td>{tb.moTaChiTiet}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="plan-table">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Số lượng</th>
                <th>Tình trạng thiết bị</th>
                <th>Hình ảnh sửa chữa</th>
              </tr>
            </thead>
            <tbody>
              {dschonYeuCau.map((tb, index) => (
                <tr key={index}>
                  <td>{tb.tenVatDung}</td>
                  <td>{Number(tb.soLuong).toLocaleString()}</td>
                  <td>{tb.tinhTrangThietBi}</td>
                  <td>
                    {tb.hinhAnhSuaChua ? (
                      <img src={tb.hinhAnhSuaChua} alt="Ảnh sửa chữa" style={{ width: "100px" }} />
                    ) : (
                      "Không có ảnh"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="button_wrapper">
          <button type="submit" className="btn-submit">Lưu thay đổi</button>
        </div>
      </form>
    </div>
  );
};

export default SuaKeHoach;
