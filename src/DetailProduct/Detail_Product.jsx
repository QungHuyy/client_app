import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import Product from '../API/Product';
import { useDispatch, useSelector } from 'react-redux';
import { addCart } from '../Redux/Action/ActionCart';
import { changeCount } from '../Redux/Action/ActionCount';
import { Link } from 'react-router-dom';
import CartsLocal from '../Share/CartsLocal';
import SaleAPI from '../API/SaleAPI';
import CommentAPI from '../API/CommentAPI';
import { Modal } from 'react-bootstrap';

function Detail_Product(props) {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [product, set_product] = useState({});
    const [sale, set_sale] = useState(null);
    const count_change = useSelector(state => state.Count.isLoad);
    const [count, set_count] = useState(1);
    const [show_success, set_show_success] = useState(false);
    const [size, set_size] = useState('S');
    const [availableQuantity, setAvailableQuantity] = useState(0);
    const [inventoryS, setInventoryS] = useState('0');
    const [inventoryM, setInventoryM] = useState('0');
    const [inventoryL, setInventoryL] = useState('0');
    
    // Thêm state cho phần review
    const [canReview, setCanReview] = useState(false);
    const [reviewMessage, setReviewMessage] = useState('');
    const [list_comment, set_list_comment] = useState([]);
    const [modal, set_modal] = useState(false);
    const [star, set_star] = useState(5);
    const [comment, set_comment] = useState('');
    const [validation_comment, set_validation_comment] = useState(false);

    // Hàm tính giá sau khi giảm giá
    const calculateDiscountedPrice = (originalPrice, promotionPercentage) => {
        if (!originalPrice || !promotionPercentage) return originalPrice;
        return parseInt(originalPrice) - ((parseInt(originalPrice) * parseInt(promotionPercentage)) / 100);
    };

    // Hàm này dùng để thêm vào giỏ hàng
    const handler_addcart = (e) => {
        e.preventDefault();
        
        // Kiểm tra nếu Product hết hàng theo size đã chọn
        if (availableQuantity <= 0) {
            alert(`Size ${size} đã hết hàng!`);
            return;
        }
        
        // Kiểm tra nếu số lượng đặt lớn hơn số lượng tồn kho của size đã chọn
        if (count > availableQuantity) {
            alert(`Chỉ còn ${availableQuantity} sản phẩm size ${size} trong kho!`);
            set_count(availableQuantity);
            return;
        }

        const data = {
            id_cart: Math.random().toString(),
            id_product: id,
            name_product: product.name_product,
            price_product: sale ? calculateDiscountedPrice(product.price_product, sale.promotion) : product.price_product,
            count: count,
            image: product.image,
             size: size,
            // inventory: {
            //     [size]: count
            // }
        };

        CartsLocal.addProduct(data);
        const action_count_change = changeCount(count_change);
        dispatch(action_count_change);
        set_show_success(true);

        setTimeout(() => {
            set_show_success(false);
        }, 1000);
    };

    // Hàm này dùng để giảm số lượng
    const downCount = () => {
        if (count === 1) {
            return;
        }
        set_count(count - 1);
    };

    // Hàm này dùng để tăng số lượng
    const upCount = () => {
        // Chỉ cho phép tăng số lượng nếu còn hàng
        if (count < availableQuantity) {
            set_count(count + 1);
        } else {
            alert(`Chỉ còn ${availableQuantity} sản phẩm size ${size} trong kho!`);
        }
    };

    // Hàm này dùng để cập nhật số lượng có sẵn khi size thay đổi
    const updateAvailableQuantity = (selectedSize) => {
        if (product && product.inventory) {
            setAvailableQuantity(product.inventory[selectedSize] || 0);
        } else if (product && product.number) {
            // Tương thích ngược với sản phẩm cũ
            setAvailableQuantity(product.number);
        } else {
            setAvailableQuantity(0);
        }
    };

    // Hàm xử lý khi người dùng thay đổi size
    const handleSizeChange = (e) => {
        const selectedSize = e.target.value;
        set_size(selectedSize);
        updateAvailableQuantity(selectedSize);
        
        // Reset số lượng về 1 khi đổi size
        set_count(1);
    };

    // Hàm xử lý gửi comment
    const handler_Comment = async () => {
        if (!comment) {
            set_validation_comment(true);
            return;
        }

        const data = {
            id_product: id,
            id_user: sessionStorage.getItem('id_user'),
            content: comment,
            star: star
        };

        await CommentAPI.post_comment(data,id);
        set_modal(false);
        
        // Cập nhật lại danh sách comment
        const fetchComments = async () => {
            const response = await CommentAPI.get_comment(id);
            set_list_comment(response);
        };
        
        fetchComments();
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await Product.Get_Detail_Product(id);
            set_product(response);
            
            // Cập nhật số lượng có sẵn cho size mặc định (S)
            if (response.inventory) {
                setAvailableQuantity(response.inventory.S || 0);
            } else if (response.number) {
                // Tương thích ngược với sản phẩm cũ
                setAvailableQuantity(response.number);
            }

            // Kiểm tra khuyến mãi
            try {
                const response_sale = await SaleAPI.checkSale(id);
                console.log("Thông tin khuyến mãi:", response_sale);
                
                // Kiểm tra cấu trúc dữ liệu trả về
                if (response_sale && response_sale.msg === "Thanh Cong" && response_sale.sale) {
                    // Kiểm tra xem khuyến mãi có đang active không
                    const saleData = response_sale.sale;
                    const currentDate = new Date();
                    const startDate = new Date(saleData.start);
                    const endDate = new Date(saleData.end);
                    console.log("Ngày hiện tại:", currentDate);
                    console.log("Ngày bắt đầu:", startDate);
                    console.log("Ngày kết thúc:", endDate);
                    if (saleData.status && currentDate >= startDate && currentDate <= endDate) {
                        set_sale(saleData);
                        console.log("Áp dụng khuyến mãi:", saleData.promotion + "%");
                    } else {
                        console.log("Khuyến mãi không còn hiệu lực hoặc chưa bắt đầu");
                        set_sale(null);
                    }
                } else {
                    console.log("Không có khuyến mãi cho sản phẩm này");
                    set_sale(null);
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra khuyến mãi:", error);
                set_sale(null);
            }
            
            // Lấy danh sách comment
            const response_comment = await CommentAPI.get_comment(id);
            set_list_comment(response_comment);
            
            // Kiểm tra xem người dùng có thể review không
            if (sessionStorage.getItem('id_user')) {
                try {
                    const reviewCheck = await CommentAPI.check_can_review(id, sessionStorage.getItem('id_user'));
                    setCanReview(reviewCheck.canReview);
                    setReviewMessage(reviewCheck.message);
                } catch (error) {
                    console.error("Error checking review permission:", error);
                    setCanReview(false);
                    setReviewMessage("Không thể kiểm tra quyền đánh giá");
                }
            } else {
                setCanReview(false);
                setReviewMessage("Vui lòng đăng nhập để đánh giá sản phẩm");
            }
        };

        fetchData();
    }, [id]);

    return (
        <div>
            {show_success && (
                <div className="modal_success">
                    <div className="group_model_success pt-3">
                        <div className="text-center p-2">
                            <i className="fa fa-bell fix_icon_bell" style={{ fontSize: '40px', color: '#fff' }}></i>
                        </div>
                        <h4 className="text-center p-3" style={{ color: '#fff' }}>Add to cart successfully</h4>
                    </div>
                </div>
            )}

            <div className="breadcrumb-area">
                <div className="container">
                    <div className="breadcrumb-content">
                        <ul>
                            <li><a href="/">Home</a></li>
                            <li className="active">Detail</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="content-wraper">
                <div className="container">
                    <div className="row single-product-area">
                        <div className="col-lg-5 col-md-6">
                            <div className="product-details-left">
                                <div className="product-details-images slider-navigation-1">
                                    <div style={{backgroundImage:'url("https://t3.ftcdn.net/jpg/02/31/80/90/360_F_231809050_gePfxLmiCMgf7b5yQtXtJx8kabb5SYHz.jpg")'}} className="lg-image">
                                        <img src={product.image} style={{objectFit:'contain', aspectRatio:"1/1"}} alt="product image" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-7 col-md-6">
                            <div className="product-details-view-content pt-60">
                                <div className="product-info">
                                    <h2>{product.name_product}</h2>
                                    <div className="price-box pt-20">
                                        {sale ? (
                                            <del className="new-price new-price-2" style={{ color: '#525252' }}>
                                                {new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(product.price_product) + ' VNĐ'}
                                            </del>
                                        ) : (
                                            <span className="new-price new-price-2">
                                                {new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(product.price_product) + ' VNĐ'}
                                            </span>
                                        )}
                                        <br />
                                        {sale && (
                                            <span className="new-price new-price-2">
                                                {new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' })
                                                    .format(calculateDiscountedPrice(product.price_product, sale.promotion)) + ' VNĐ'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="product-desc">
                                        <p>
                                            <span>{product.describe || ""}</span>
                                        </p>
                                    </div>
                                    <div className="product-variants">
                                        <div className="produt-variants-size">
                                            <label>Size</label>
                                            <select className="nice-select" onChange={handleSizeChange} value={size}>
                                                <option value="S">S</option>
                                                <option value="M">M</option>
                                                <option value="L">L</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="single-add-to-cart">
                                        <form action="#" className="cart-quantity">
                                            <div className="quantity">
                                                <label>Quantity</label>
                                                <div className="cart-plus-minus">
                                                    <input className="cart-plus-minus-box" value={count} type="text" onChange={(e) => set_count(e.target.value)} />
                                                    <div className="dec qtybutton" onClick={downCount}><i className="fa fa-angle-down"></i></div>
                                                    <div className="inc qtybutton" onClick={upCount}><i className="fa fa-angle-up"></i></div>
                                                </div>
                                            </div>
                                            {availableQuantity > 0 ? (
                                                <>
                                                    <span className="in-stock">Còn hàng: {availableQuantity} (Size {size})</span>
                                                    <a href="#" className="add-to-cart" type="submit" onClick={handler_addcart}>Add to cart</a>
                                                </>
                                            ) : (
                                                <span className="out-stock">Hết hàng (Size {size})</span>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="product-area pt-35">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="li-product-tab">
                                <ul className="nav li-product-menu">
                                    <li><a className="active" data-toggle="tab" href="#description"><span>Description</span></a></li>
                                    <li><a data-toggle="tab" href="#reviews"><span>Reviews</span></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="tab-content">
                        <div id="description" className="tab-pane active show" role="tabpanel">
                            <div className="product-description">
                                {product.describe ? (
                                    <span>{product.describe}</span>
                                ) : (
                                    <span>Chưa có thông tin mô tả cho Product này.</span>
                                )}
                            </div>
                        </div>
                        <div id="reviews" className="tab-pane" role="tabpanel">
                            <div className="product-reviews">
                                <div className="product-details-comment-block">
                                    <div style={{ overflow: 'auto', height: '10rem' }}>
                                        {
                                            list_comment && list_comment.map(value => (

                                                <div className="comment-author-infos pt-25" key={value._id}>
                                                    <span>{value.id_user.fullname} <div style={{ fontWeight: '400' }}>{value.content}</div></span>
                                                    <ul className="rating">
                                                        <li><i className={value.star > 0 ? 'fa fa-star' : 'fa fa-star-o'}></i></li>
                                                        <li><i className={value.star > 1 ? 'fa fa-star' : 'fa fa-star-o'}></i></li>
                                                        <li><i className={value.star > 2 ? 'fa fa-star' : 'fa fa-star-o'}></i></li>
                                                        <li><i className={value.star > 3 ? 'fa fa-star' : 'fa fa-star-o'}></i></li>
                                                        <li><i className={value.star > 4 ? 'fa fa-star' : 'fa fa-star-o'}></i></li>
                                                    </ul>
                                                </div>

                                            ))
                                        }
                                    </div>

                                    <div className="review-btn" style={{ marginTop: '2rem' }}>
                                        {sessionStorage.getItem('id_user') ? (
                                            canReview ? (
                                                <a className="review-links" style={{ cursor: 'pointer', color: '#fff' }} onClick={() => set_modal(true)}>
                                                    Write Your Review!
                                                </a>
                                            ) : (
                                                <a className="review-links" style={{ cursor: 'not-allowed', color: '#ccc' }} title={reviewMessage}>
                                                    {reviewMessage || "Bạn không thể Rating Product này"}
                                                </a>
                                            )
                                        ) : (
                                            <a className="review-links" style={{ cursor: 'pointer', color: '#fff' }} onClick={() => set_modal(true)}>
                                                Write Your Review!
                                            </a>
                                        )}
                                    </div>
                                    <Modal onHide={() => set_modal(false)} show={modal} className="modal fade modal-wrapper">
                                        <div className="modal-dialog modal-dialog-centered" role="document">
                                            <div className="modal-content">
                                                <div className="modal-body">
                                                    <h3 className="review-page-title">Write Your Review</h3>
                                                    {!sessionStorage.getItem('id_user') && (
                                                        <div className="alert alert-warning">
                                                            Vui lòng đăng nhập để Rating Product
                                                        </div>
                                                    )}
                                                    {sessionStorage.getItem('id_user') && !canReview && (
                                                        <div className="alert alert-warning">
                                                            {reviewMessage || "Bạn không thể Rating Product này"}
                                                        </div>
                                                    )}
                                                    <div className="modal-inner-area row">
                                                        <div className="col-lg-6">
                                                            <div className="li-review-product">
                                                                <img src={product.image} alt="Li's Product" style={{ width: '20rem' }} />
                                                                <div className="li-review-product-desc">
                                                                    <p className="li-product-name">{product.name_product}</p>
                                                                    <p>
                                                                        <span>{product.describe || ""}</span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <div className="li-review-content">
                                                                <div className="feedback-area">
                                                                    <div className="feedback">
                                                                        <h3 className="feedback-title">Our Feedback</h3>
                                                                        <form action="#">
                                                                            <p className="your-opinion">
                                                                                <label>Your Rating</label>
                                                                                <span>
                                                                                    <select className="star-rating" onChange={(e) => set_star(e.target.value)}>
                                                                                        <option value="1">1</option>
                                                                                        <option value="2">2</option>
                                                                                        <option value="3">3</option>
                                                                                        <option value="4">4</option>
                                                                                        <option value="5">5</option>
                                                                                    </select>
                                                                                </span>
                                                                            </p>
                                                                            <p className="feedback-form">
                                                                                <label htmlFor="feedback">Your Review</label>
                                                                                <textarea 
                                                                                    id="feedback" 
                                                                                    name="comment" 
                                                                                    cols="45" 
                                                                                    rows="8" 
                                                                                    aria-required="true" 
                                                                                    onChange={(e) => set_comment(e.target.value)}
                                                                                    disabled={!canReview}
                                                                                ></textarea>
                                                                                {validation_comment && <span style={{ color: 'red' }}>* This is required!</span>}
                                                                            </p>
                                                                            <div className="feedback-input">
                                                                                <div className="feedback-btn pb-15">
                                                                                    <a className="close" onClick={() => set_modal(false)}>Close</a>
                                                                                    <a 
                                                                                        style={{ 
                                                                                            cursor: canReview ? 'pointer' : 'not-allowed',
                                                                                            opacity: canReview ? 1 : 0.5
                                                                                        }} 
                                                                                        onClick={handler_Comment}
                                                                                    >
                                                                                        Submit
                                                                                    </a>
                                                                                </div>
                                                                            </div>
                                                                        </form>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Detail_Product;
