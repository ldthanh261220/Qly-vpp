import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SendRequest.module.scss';

const cx = classNames.bind(styles);

function SendRequest() {
    const [requestType, setRequestType] = useState('');
    const [status, setStatus] = useState('damaged');
    const [fileName, setFileName] = useState('Hinhban.png');

    const handleRequestTypeChange = (e) => {
        setRequestType(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted');
    };

    return (
        <>
            <div className={cx('container')}>
                <h1 className={cx('form-title')}>Gửi yêu cầu mua sắm hoặc sửa chữa</h1>

                <form id="requestForm" className={cx('request-form')} onSubmit={handleSubmit}>
                    {/* Department Information Section */}
                    <div className={cx('section-header')}>
                        <h2>Thông tin khoa/phòng ban</h2>
                    </div>

                    <div className={cx('form-row')}>
                        <div className={cx('form-group')}>
                            <label htmlFor="department">Tên khoa/phòng ban:</label>
                            <input type="text" id="department" name="department" />
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="phone">Số điện thoại liên hệ:</label>
                            <input type="tel" id="phone" name="phone" />
                        </div>
                    </div>

                    <div className={cx('form-row')}>
                        <div className={cx('form-group')}>
                            <label htmlFor="requester">Người gửi yêu cầu:</label>
                            <input type="text" id="requester" name="requester" />
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="email">Email liên hệ:</label>
                            <input type="email" id="email" name="email" />
                        </div>
                    </div>

                    {/* Request Type Section */}
                    <div className={cx('section-header')}>
                        <h2>Loại yêu cầu</h2>
                    </div>

                    <div className={cx('form-row2', 'radio-options')}>
                        <div className={cx('radio-option')}>
                            <input
                                type="radio"
                                id="purchase"
                                name="requestType"
                                value="purchase"
                                checked={requestType === 'purchase'}
                                onChange={handleRequestTypeChange}
                            />
                            <label htmlFor="purchase">Mua sắm</label>
                        </div>

                        <div className={cx('radio-option')}>
                            <input
                                type="radio"
                                id="repair"
                                name="requestType"
                                value="repair"
                                checked={requestType === 'repair'}
                                onChange={handleRequestTypeChange}
                            />
                            <label htmlFor="repair">Sửa chữa</label>
                        </div>
                    </div>

                    {/* Equipment Information Section (Only for Repair) */}
                    <div className={cx('section-header')}>
                        <h2>Thông tin thiết bị (Chỉ nhập nếu chọn "Sửa chữa")</h2>
                    </div>

                    <div className={cx('form-row')}>
                        <div className={cx('form-group')}>
                            <label htmlFor="equipment">Tên thiết bị:</label>
                            <input type="text" id="equipment" name="equipment" />
                        </div>

                        <div className={cx('form-group', 'status-group')}>
                            <label>Tình trạng hiện tại</label>
                            <div className={cx('radio-options', 'status-options')}>
                                <div className={cx('radio-option')}>
                                    <input
                                        type="radio"
                                        id="working"
                                        name="status"
                                        value="working"
                                        checked={status === 'working'}
                                        onChange={handleStatusChange}
                                    />
                                    <label htmlFor="working">Hoạt động</label>
                                </div>

                                <div className={cx('radio-option')}>
                                    <input
                                        type="radio"
                                        id="damaged"
                                        name="status"
                                        value="damaged"
                                        checked={status === 'damaged'}
                                        onChange={handleStatusChange}
                                    />
                                    <label htmlFor="damaged">Hư hỏng</label>
                                </div>

                                <div className={cx('radio-option')}>
                                    <input
                                        type="radio"
                                        id="unusable"
                                        name="status"
                                        value="unusable"
                                        checked={status === 'unusable'}
                                        onChange={handleStatusChange}
                                    />
                                    <label htmlFor="unusable">Không sử dụng được</label>
                                </div>

                                <div className={cx('radio-option')}>
                                    <input
                                        type="radio"
                                        id="other"
                                        name="status"
                                        value="other"
                                        checked={status === 'other'}
                                        onChange={handleStatusChange}
                                    />
                                    <label htmlFor="other">Khác: (Nhập chi tiết)</label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={cx('form-row')}>
                        <div className={cx('form-group', 'attachment-group')}>
                            <label>Hình ảnh/Tài liệu đính kèm</label>
                            <div className={cx('file-upload')}>
                                <input
                                    type="file"
                                    id="attachment"
                                    name="attachment"
                                    className={cx('file-input')}
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="attachment" className={cx('file-label')}>
                                    <svg
                                        width="17"
                                        height="30"
                                        viewBox="0 0 17 30"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M8.5 1v28M1 8.5L8.5 1l7.5 7.5"
                                            stroke="#000"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </label>
                            </div>
                            {fileName && (
                                <div className={cx('file-preview')}>
                                    <svg
                                        width="34"
                                        height="29"
                                        viewBox="0 0 34 29"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M1 5l8-4h24v24l-8 4H1V5z" stroke="#000" strokeWidth="1.5" />
                                        <path
                                            d="M25 5v24M9 9h12M9 13h8M9 17h12M9 21h6"
                                            stroke="#000"
                                            strokeWidth="1.5"
                                        />
                                    </svg>
                                    <span className={cx('file-name')}>{fileName}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Request Information Section */}
                    <div className={cx('section-header')}>
                        <h2>Thông tin yêu cầu</h2>
                    </div>
                    <div className={cx('form-row2')}>
                        <div className={cx('form-group', 'ver2')}>
                            <label htmlFor="description">Mô tả chi tiết yêu cầu:</label>
                            <input type="text" id="description" name="description" />
                        </div>

                        <div className={cx('purchase-info')}>
                            <label>Tên vật dụng & số lượng (Chỉ nhập nếu chọn "Mua sắm")</label>

                            <div className={cx('form-row', 'ver3')}>
                                <div className={cx('form-group')}>
                                    <label htmlFor="itemName">Tên vật dụng:</label>
                                    <input type="text" id="itemName" name="itemName" />
                                </div>

                                <div className={cx('form-group')}>
                                    <label htmlFor="quantity">Số lượng:</label>
                                    <input type="number" id="quantity" name="quantity" />
                                </div>
                            </div>
                        </div>

                        <div className={cx('form-group', 'ver2')}>
                            <label htmlFor="reason">Lý do đề xuất:</label>
                            <textarea id="reason" name="reason" rows="5"></textarea>
                        </div>
                    </div>
                </form>
            </div>
            <button type="submit" className={cx('btn-submit')}>
                Gửi yêu cầu
            </button>
        </>
    );
}

export default SendRequest;
