import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SaleAPI from '../../API/SaleAPI';
import Product from '../../API/Product';

Home_Category.propTypes = {
    GET_id_modal: PropTypes.func
};

Home_Category.defaultProps = {
    GET_id_modal: null
}

function Home_Category(props) {
    // Cấu hình slider trượt ngang - giống với Home_Product
    var settings = {
        dots: false,
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    // Lấy func từ component cha chuyển xuống
    const { GET_id_modal } = props;

    const [saleProducts, setSaleProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSaleProducts = async () => {
            try {
                setLoading(true);
                // Lấy danh sách các sản phẩm đang sale
                const saleResponse = await SaleAPI.getList();
                
                // Tạo mảng chứa thông tin đầy đủ của sản phẩm sale
                const productsWithDetails = [];
                
                // Lặp qua từng sản phẩm sale để lấy thông tin chi tiết
                for (const sale of saleResponse) {
                    if (sale && sale.id_product && sale.id_product._id) {
                        // Thêm thông tin sale vào sản phẩm
                        productsWithDetails.push({
                            ...sale.id_product,
                            promotion: sale.promotion,
                            saleId: sale._id,
                            salePrice: parseInt(sale.id_product.price_product) - 
                                      (parseInt(sale.id_product.price_product) * parseInt(sale.promotion) / 100)
                        });
                    }
                }
                
                setSaleProducts(productsWithDetails);
            } catch (error) {
                console.error("Lỗi khi lấy sản phẩm sale:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSaleProducts();
    }, []);

    // Hàm tối ưu URL Cloudinary
    const optimizeCloudinaryImage = (url, width = 300) => {
        if (url && url.includes('cloudinary.com')) {
            // Thêm transformation vào URL Cloudinary
            return url.replace('/upload/', `/upload/w_${width},c_scale/`);
        }
        return url;
    };

    return (
        <>
            {/* Phần danh mục sản phẩm */}
            <section className="category-area pt-60 pb-2">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="li-section-title">
                                <h2>
                                    <span className="helvetica-font category-title">Danh mục sản phẩm</span>
                                </h2>
                            </div>
                            <div className="category-grid">
                                <div className="row">
                                    <div className="col-md-4 mb-4">
                                        <Link to="/shop/male" className="category-card" style={{height:200, display:"block"}}>
                                            <div className="category-item" style={{
                                                backgroundImage:'url("https://theme.hstatic.net/200000690725/1001078549/14/home_category_1_img.jpg?v=743")' ,
                                                backgroundSize  : 'cover',
                                                backgroundPosition: 'center',
                                                borderRadius: '8px',
                                                padding: '60px 20px',
                                                textAlign: 'center',
                                                color: 'white',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                                transition: 'all 0.3s ease',
                                                position:"relative",
                                                width:'100%',
                                                height:"100%",
                                                overflow:"hidden"

                                            }}>
                                                <h3 style={{position:"absolute", top:0, left:0 ,zIndex:5, backgroundColor:"rgba(1, 1, 1, 0.4)", width:"100%", height:"100%",display:"flex", justifyContent:'center', alignItems:'center'}} className="helvetica-font">Nam</h3>
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="col-md-4 mb-4">
                                        <Link to="/shop/female" className="category-card" style={{height:200, display:"block"}}>
                                                                                <div className="category-item" style={{
                                                backgroundImage:'url("https://res.cloudinary.com/dwmsfixy5/image/upload/v1748127256/unnamed_pj2cqe.png")' ,
                                                backgroundSize  : 'cover',
                                                backgroundPosition: 'center',
                                                borderRadius: '8px',
                                                padding: '60px 20px',
                                                textAlign: 'center',
                                                color: 'white',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                                transition: 'all 0.3s ease',
                                                position:"relative",
                                                width:'100%',
                                                height:"100%",
                                                overflow:"hidden"

                                            }}>
                                                <h3 style={{position:"absolute", top:0, left:0 ,zIndex:5, backgroundColor:"rgba(1, 1, 1, 0.4)", width:"100%", height:"100%",display:"flex", justifyContent:'center', alignItems:'center'}} className="helvetica-font">Nữ</h3>
                                            </div>
                                        </Link>
                                        
                                    </div>
                                    <div className="col-md-4 mb-4">
                                        <Link to="/shop/unisex" className="category-card" style={{height:200, display:"block"}}>
                                        <div className="category-item" style={{
                                                backgroundImage:'url("https://res.cloudinary.com/dwmsfixy5/image/upload/v1748126928/Gemini_Generated_Image_ai6lq2ai6lq2ai6l_1_vp9k9b.png")' ,
                                                backgroundSize  : 'cover',
                                                backgroundPosition: 'center',
                                                borderRadius: '8px',
                                                padding: '60px 20px',
                                                textAlign: 'center',
                                                color: 'white',
                                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                                transition: 'all 0.3s ease',
                                                position:"relative",
                                                width:'100%',
                                                height:"100%",
                                                overflow:"hidden"

                                            }}>
                                                <h3 style={{position:"absolute", top:0, left:0 ,zIndex:5, backgroundColor:"rgba(1, 1, 1, 0.4)", width:"100%", height:"100%",display:"flex", justifyContent:'center', alignItems:'center'}} className="helvetica-font">Unisex</h3>
                                            </div>
                                            </Link>


                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Phần sản phẩm giảm giá */}
            <section className="product-area li-laptop-product pt-20 pb-45">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="li-section-title">
                                <h2>
                                    <span className="helvetica-font sale-title">Sản Phẩm Giảm Giá</span>
                                </h2>
                            </div>
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-warning" role="status">
                                        <span className="sr-only">Đang tải...</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <Slider {...settings}>
                                        {saleProducts.map(product => (
                                            <div className="col-lg-12 col_product" style={{ zIndex: '999', height: '30rem', position: 'relative' }} key={product._id}>
                                                <div className="single-product-wrap">
                                                    <div className="product-image" style={{position:"relative"}}>
                                                        <Link to={`/detail/${product._id}`}>
                                                            <img 
                                                                src={optimizeCloudinaryImage(product.image)} 
                                                                alt={product.name_product} 
                                                                style={{width:"100%", objectFit:"contain",height:'100%'}}
                                                            />
                                                        </Link>
                                                        <span style={{position:"absolute", top:5,right:5, padding:"3px 12px",fontSize:18, backgroundColor:"rgb(253, 49, 49)",color:"#fff", borderRadius:20}} className="sticker">-{product.promotion}%</span>
                                                    </div>
                                                    <div className="product_desc">
                                                        <div className="product_desc_info">
                                                            <div className="product-review">
                                                                <h5 className="manufacturer helvetica-font" style={{marginTop:10}}>
                                                                    <Link to={`/detail/${product._id}`}>{product.name_product}</Link>
                                                                </h5>
                                                                <div className="rating-box">
                                                                    <ul style={{display:"flex", alignItems:"center", gap:2}} className="rating">
                                                                        <li style={{display:"inline"}} ><i className="fa fa-star-o"></i></li>
                                                                        <li style={{display:"inline"}}><i className="fa fa-star-o"></i></li>
                                                                        <li style={{display:"inline"}}><i className="fa fa-star-o"></i></li>
                                                                        <li style={{display:"inline"}} className="no-star"><i className="fa fa-star-o"></i></li>
                                                                        <li style={{display:"inline"}} className="no-star"><i className="fa fa-star-o"></i></li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                            <div className="price-box helvetica-font">
                                                                <del className="new-price" style={{ color: '#525252' ,fontWeight:"bold"}}>
                                                                    {new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(product.price_product) + ' VNĐ'}
                                                                </del>
                                                                <br />
                                                                <span className="new-price" style={{ color: '#e80f0f',fontWeight:"bold", fontSize:16 }}>
                                                                    {new Intl.NumberFormat('vi-VN', { style: 'decimal', decimal: 'VND' }).format(product.salePrice) + ' VNĐ'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="add_actions">
                                                            <ul className="add-actions-link">
                                                                <li>
                                                                    <a 
                                                                        href="#" 
                                                                        title="Xem nhanh" 
                                                                        className="links-details helvetica-font" 
                                                                        style={{border:"1px solid #ccc", padding:4,borderRadius:4, backgroundColor:"#666", color:"#fff"}}
                                                                        data-toggle="modal" 
                                                                        data-target={`#${product._id}`} 
                                                                        onClick={() => GET_id_modal(product._id, product.salePrice)}
                                                                    >
                                                                        <i className="fa fa-eye"></i>
                                                                    </a>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </Slider>
                                    <div className="view-all-btn-wrapper" style={{width:"100%", display:"flex", justifyContent:"center" ,marginTop:60}}>
                                        <Link to="/shop" style={{padding:"10px 45px", border:"1px solid #666",color:"#000"}} className="view-all-btn">
                                            Xem tất cả sản phẩm khuyến mãi
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home_Category;
