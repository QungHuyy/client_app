import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import bg1 from '../CSS/Image/1.jpg'
import bg2 from '../CSS/Image/2.jpg'
import bg3 from '../CSS/Image/3.jpg'
import bg5 from '../CSS/Image/5.jpg'
import bg6 from '../CSS/Image/6.jpg'
import bg7 from '../CSS/Image/7.jpg'
import Home_Category from './Component/Home_Category';
import Home_Product from './Component/Home_Product';
import Product from '../API/Product';
import { changeCount } from '../Redux/Action/ActionCount';
import { useDispatch, useSelector } from 'react-redux';
import CartsLocal from '../Share/CartsLocal';
import SaleAPI from '../API/SaleAPI';

Home.propTypes = {

};

function Home(props) {

    // state dùng để thay đổi và hiển thị modal
    const [id_modal, set_id_modal] = useState('')

    const [product_detail, set_product_detail] = useState([])

    const dispatch = useDispatch()

    const [priceSale, setPriceSale] = useState(0)

    const GET_id_modal = (value, price) => {

        set_id_modal(value)

        setPriceSale(price)

    }

    const [sale, setSale] = useState([])

    useEffect(() => {

        if (id_modal !== '') {

            const fetchData = async () => {

                const response = await Product.Get_Detail_Product(id_modal)

                set_product_detail(response)

            }

            fetchData()

        }

    }, [id_modal])


    // Get count từ redux khi user chưa đăng nhập
    const count_change = useSelector(state => state.Count.isLoad)

    // Hàm này dùng để thêm vào giỏ hàng
    const handler_addcart = (e) => {

        e.preventDefault()

        const data = {
            id_cart: Math.random().toString(),
            id_product: id_modal,
            name_product: product_detail.name_product,
            price_product: product_detail.price_product,
            count: 1,
            image: product_detail.image,
            size: 'S',
        }

        CartsLocal.addProduct(data)

        const action_count_change = changeCount(count_change)
        dispatch(action_count_change)

    }


    return (
        <div className="container">
            <div className="slider-with-banner">
                <div className="row">
                    <div className="col-lg-12 col-md-12">
                        <div id="mainBannerCarousel" className="carousel slide" data-ride="carousel">
                            <ol className="carousel-indicators">
                                <li data-target="#mainBannerCarousel" data-slide-to="0" className="active"></li>
                                <li data-target="#mainBannerCarousel" data-slide-to="1"></li>
                                <li data-target="#mainBannerCarousel" data-slide-to="2"></li>
                            </ol>
                            <div className="carousel-inner">
                                <div className="carousel-item active">
                                    <div className="single-slide align-center-left animation-style-01"
                                        style={{ 
                                            backgroundImage: `url(https://static.vecteezy.com/system/resources/previews/044/637/679/non_2x/summer-sale-poster-or-banner-template-featuring-a-tropical-beach-scene-with-sun-and-party-elements-product-display-tropical-summer-scene-perfect-for-promoting-your-summer-products-on-blue-background-vector.jpg)`,
                                            height: '400px',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}>
                                        <div className="slider-progress"></div>
                                        
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <div className="single-slide align-center-left animation-style-02"
                                        style={{ 
                                            backgroundImage: `url(https://img.freepik.com/premium-vector/fashion-sale-banner-template-with-colorful-background_23-2148622444.jpg)`,
                                            height: '400px',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}>
                                        <div className="slider-progress"></div>
                                        <div className="slider-content">
                                            <h2 className="helvetica-font">New Arrivals</h2>
                                            <h3 className="helvetica-font">Exclusive <span>Collection</span></h3>
                                            <a href="/shop" className="slider-btn">Discover Now</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="carousel-item">
                                    <div className="single-slide align-center-left animation-style-01"
                                        style={{ 
                                            backgroundImage: `url(https://img.freepik.com/free-vector/gradient-sale-background_23-2149050986.jpg)`,
                                            height: '400px',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center'
                                        }}>
                                        <div className="slider-progress"></div>
                                        <div className="slider-content">
                                            <h2 className="helvetica-font">Special Offer</h2>
                                            <h3 className="helvetica-font">Get up to <span>30% Off</span></h3>
                                            <a href="/shop" className="slider-btn">Shop Collection</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <a className="carousel-control-prev" href="#mainBannerCarousel" role="button" data-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="sr-only">Previous</span>
                            </a>
                            <a className="carousel-control-next" href="#mainBannerCarousel" role="button" data-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="sr-only">Next</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>


            <Home_Category GET_id_modal={GET_id_modal} />

            {/* <div className="li-static-banner">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-4 text-center">
                            <div className="single-banner">
                                <a href="#">
                                    <img src="https://image.freepik.com/free-vector/fashion-banner-design-with-shirt-bag-camera-case_83728-1865.jpg" alt="Li's Static Banner" />
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 text-center pt-xs-30">
                            <div className="single-banner">
                                <a href="#">
                                    <img src="https://image.freepik.com/free-vector/fashion-sale-banner-collection_23-2148161688.jpg" alt="Li's Static Banner" />
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 text-center pt-xs-30">
                            <div className="single-banner">
                                <a href="#">
                                    <img src="https://image.freepik.com/free-vector/fashion-sale-banners_52683-11557.jpg" alt="Li's Static Banner" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

            {/* Thêm section Unisex */}
            <Home_Product gender={`Unisex`} category={'all'} GET_id_modal={GET_id_modal} />

            <Home_Product gender={`Male`} category={'60615da34c9cac0448b4b9a2'} GET_id_modal={GET_id_modal} />

            <Home_Product gender={`Female`} category={'60615da34c9cac0448b4b9a8'} GET_id_modal={GET_id_modal} />


            <div className="modal fade modal-wrapper" id={id_modal} >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <div className="modal-inner-area row">
                                <div className="col-lg-5 col-md-6 col-sm-6">
                                    <div className="product-details-left">
                                        <div className="product-details-images slider-navigation-1">
                                            <div className="lg-image">
                                                <img src={product_detail.image} alt="product image" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-7 col-md-6 col-sm-6">
                                    <div className="product-details-view-content pt-60">
                                        <div className="product-info">
                                            <h2>{product_detail.name_product}</h2>
                                            <div className="rating-box pt-20">
                                                <ul className="rating rating-with-review-item">
                                                    <li><i className="fa fa-star-o"></i></li>
                                                    <li><i className="fa fa-star-o"></i></li>
                                                    <li><i className="fa fa-star-o"></i></li>
                                                    <li className="no-star"><i className="fa fa-star-o"></i></li>
                                                    <li className="no-star"><i className="fa fa-star-o"></i></li>
                                                </ul>
                                            </div>
                                            <div className="price-box pt-20">
                                            {
                                                priceSale ? (<del className="new-price new-price-2" style={{ color: '#525252'}}>{new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(product_detail.price_product)+ ' VNĐ'}</del>) :
                                                <span className="new-price new-price-2">{new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(product_detail.price_product)+ ' VNĐ'}</span>
                                            }
                                            <br />
                                            {
                                               priceSale && <span className="new-price new-price-2">{new Intl.NumberFormat('vi-VN',{style: 'decimal',decimal: 'VND'}).format(priceSale) + ' VNĐ'}</span>
                                            }
                                            </div>
                                            <div className="product-desc">
                                                <p>
                                                    <span>
                                                        {product_detail.describe}
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="single-add-to-cart">
                                                <form onSubmit={handler_addcart} className="cart-quantity">
                                                    <button className="add-to-cart" type="submit">Add to cart</button>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;
