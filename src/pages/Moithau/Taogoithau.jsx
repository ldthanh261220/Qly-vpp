import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import "./Taogoithau.scss";

const GoiThauForm = () => {
  // 1. State đã thêm trường trangThai
  const [goiThau, setGoiThau] = useState({
    tenGoiThau: "",
    moTaChiTiet: "",
    maLinhVuc: "",
    trangThai: "",      // mặc định
  });

  const [danhSachLinhVuc, setDanhSachLinhVuc] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { maGoiThau } = useParams();
  const location = useLocation();

  // 2. Xác định mode từ URL
  let mode = "create";
  if (location.pathname.includes("/suagoithau")) mode = "edit";
  else if (location.pathname.includes("/chitietgoithau")) mode = "view";

  // 3. Lấy danh sách lĩnh vực
  useEffect(() => {
    axios
      .get("http://localhost:5005/v1/api/getDsLinhVuc")
      .then(res => {
        if (res.data.errCode === 0) {
          setDanhSachLinhVuc(
            res.data.danhsachlinhvuc.filter(lv => lv.trangThai === "Hoạt động")
          );
        }
      })
      .catch(err => console.error("Lỗi lấy lĩnh vực:", err));
  }, []);

  // 4. Nếu edit/view, lấy chi tiết và map luôn cả trangThai
  useEffect(() => {
    if (mode !== "create" && maGoiThau) {
      setIsLoading(true);
      axios
        .get(`http://localhost:5005/v1/api/chitietgoithau?maGoiThau=${maGoiThau}`)
        .then(res => {
          const data = Array.isArray(res.data) ? res.data[0] : res.data;
          console.log(data)
          setGoiThau({
            tenGoiThau: data.tenGoiThau || "",
            moTaChiTiet: data.moTaChiTiet || "",
            maLinhVuc: data.maLinhVuc || "",
            trangThai: data.trangThai,
          });
        })
        .catch(err => console.error("Lỗi lấy chi tiết:", err))
        .finally(() => setIsLoading(false));
    }
  }, [mode, maGoiThau]);

  // 5. Cập nhật state chung
  const handleChange = e => {
    const { name, value } = e.target;
    setGoiThau(prev => ({ ...prev, [name]: value }));
  };

  // 6. Submit: thêm trường trangThai khi PUT
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (mode === "create") {
        console.log(goiThau)
        await axios.post("http://localhost:5005/v1/api/taogoithau", goiThau);
        alert("✔️ Tạo gói thầu thành công!");
      } else if (mode === "edit") {
        await axios.put(
          `http://localhost:5005/v1/api/suagoithau?maGoiThau=${maGoiThau}`,goiThau);
        alert("✔️ Cập nhật gói thầu thành công!");
      }
      navigate("/moithau");
    } catch (err) {
      console.error("Lỗi gửi dữ liệu:", err);
      alert("❌ Đã xảy ra lỗi.");
    }
  };

  if (isLoading) return <p>Đang tải dữ liệu...</p>;

  return (
    <div className="tao-goi-thau-container">
      <h2>
        {mode === "create"
          ? "Tạo Gói Thầu"
          : mode === "edit"
          ? "Sửa Gói Thầu"
          : "Chi Tiết Gói Thầu"}
      </h2>

      <form onSubmit={handleSubmit} className="goi-thau-form">
        {/* Tên gói thầu */}
        <div className="form-group">
          <label>Tên gói thầu</label>
          <input
            type="text"
            name="tenGoiThau"
            value={goiThau.tenGoiThau}
            onChange={handleChange}
            disabled={mode === "view"}
            required
          />
        </div>

        {/* Mô tả */}
        <div className="form-group">
          <label>Mô tả chi tiết</label>
          <textarea
            name="moTaChiTiet"
            value={goiThau.moTaChiTiet}
            onChange={handleChange}
            disabled={mode === "view"}
            required
          />
        </div>

        {/* Lĩnh vực */}
        <div className="form-group">
          <label>Lĩnh vực</label>
          <select
            name="maLinhVuc"
            value={goiThau.maLinhVuc}
            onChange={handleChange}
            disabled={mode === "view"}
            required
          >
            <option value="">-- Chọn lĩnh vực --</option>
            {danhSachLinhVuc.map(lv => (
              <option key={lv.maLinhVuc} value={lv.maLinhVuc}>
                {lv.tenLinhVuc}
              </option>
            ))}
          </select>
        </div>

        {/* Chỉ hiển thị khi sửa */}
        { (mode === "edit" || mode === "view") && (
          <div className="form-group">
            <label>Trạng thái</label>
            <select 
              name="trangThai"
              value={goiThau.trangThai}
              onChange={handleChange}
              required
              disabled={mode === "view"}
            >
              <option value="Hoạt động">Hoạt động</option>
              <option value="Tạm ngưng">Tạm ngưng</option>
              <option value="Đã kết thúc">Đã kết thúc</option>
            </select>
          </div>
        )}

        {/* Nút submit */}
        {mode !== "view" && (
          <button type="submit">
            {mode === "create" ? "Tạo gói thầu" : "Cập nhật gói thầu"}
          </button>
        )}
      </form>
    </div>
  );
};

export default GoiThauForm;
