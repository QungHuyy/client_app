import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeCount } from "../Redux/Action/ActionCount";
import OrderAPI from "../API/OrderAPI";
import NoteAPI from "../API/NoteAPI";
import Detail_OrderAPI from "../API/Detail_OrderAPI";
import CouponAPI from "../API/CouponAPI";
import Paypal from "./Paypal";
import MoMo from "./MoMo";
import CartsLocal from "../Share/CartsLocal";
import Product from "../API/Product";

function Checkout(props) {
  const dispatch = useDispatch();
  const [list_carts, set_list_carts] = useState([]);
  const count_change = useSelector(state => state.Count.isLoad);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [productInventory, setProductInventory] = useState({});
  const [showError, setShowError] = useState(false);
  const [information, setInformation] = useState({
    fullname: "",
    phone: "",
    address: "",
    email: "",
  });
  const [redirect, setRedirect] = useState(false);
  const [loadOrder, setLoadOrder] = useState(false);
  const [orderID, setOrderID] = useState("");

  const { register, handleSubmit, errors } = useForm();

  useEffect(() => {
    set_list_carts(JSON.parse(localStorage.getItem('carts')) || []);
    calculateTotal(JSON.parse(localStorage.getItem('carts')) || []);
    
    // Lấy thông tin tồn kho của tất cả sản phẩm trong giỏ hàng
    const fetchProductInventory = async () => {
      const carts = JSON.parse(localStorage.getItem('carts')) || [];
      const inventory = {};
      
      for (const item of carts) {
        const product = await Product.Get_Detail_Product(item.id_product);
        
        inventory[item.id_product] = product.inventory || { S: product.number || 0, M: 0, L: 0 };
      }
      
      setProductInventory(inventory);
    };
    
    fetchProductInventory();
  }, [count_change]);

  useEffect(() => {
    validateInformation();
  }, [information]);

  const calculateTotal = (carts) => {
    let sum = 0;
    carts.forEach((item) => {
      sum += parseInt(item.count) * parseInt(item.price_product);
    });

    if (localStorage.getItem("coupon")) {
      const coupon = JSON.parse(localStorage.getItem("coupon"));
      const discountAmount = (sum * coupon.promotion) / 100;
      setDiscount(discountAmount);
      setTotalPrice(sum - discountAmount);
    } else {
      setTotalPrice(sum);
    }
  };

  const validateInformation = () => {
    const { fullname, phone, email } = information;
    if (!fullname || !phone || !email) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInformation({ ...information, [name]: value });
  };

  // Kiểm tra tồn kho trước khi đặt hàng
  const validateInventory = () => {
    let isValid = true;
    let errorMessage = '';
    
    for (const item of list_carts) {
      const availableQuantity = productInventory[item.id_product] ? 
        (productInventory[item.id_product][item.size] || 0) : 0;
        
      if (parseInt(item.count) > availableQuantity) {
        isValid = false;
        errorMessage += `Sản phẩm "${item.name_product}" size ${item.size} chỉ còn ${availableQuantity} trong kho.\n`;
      }
    }
    
    if (!isValid) {
      alert(errorMessage + 'Vui lòng cập nhật giỏ hàng của bạn.');
    }
    
    return isValid;
  };

  const handleCheckout = async () => {
    if (showError) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    
    if (!validateInventory()) {
      return;
    }
    
    setLoadOrder(true);

    if (localStorage.getItem("id_coupon")) {
      await CouponAPI.updateCoupon(localStorage.getItem("id_coupon"));
    }

    const deliveryData = {
      fullname: information.fullname,
      phone: information.phone,
    };

    const deliveryResponse = await NoteAPI.post_note(deliveryData);

    const orderData = {
      id_user: sessionStorage.getItem("id_user"),
      address: information.address,
      total: totalPrice,
      status: "1",
      pay: false,
      id_payment: "6086709cdc52ab1ae999e882",
      id_note: deliveryResponse._id,
      feeship: 0,
      id_coupon: localStorage.getItem("id_coupon") || "",
      create_time: `${new Date().getDate()}/${parseInt(new Date().getMonth()) + 1}/${new Date().getFullYear()}`,
    };

    const orderResponse = await OrderAPI.post_order(orderData);

    const storedCarts = JSON.parse(localStorage.getItem("carts")) || [];

    for (const item of storedCarts) {
      const detailData = {
        id_order: orderResponse._id,
        id_product: item.id_product,
        name_product: item.name_product,
        price_product: item.price_product,
        count: item.count,
        size: item.size,
         inventory: {
           [item.size]:item.count
        },
      };
      await Detail_OrderAPI.post_detail_order(detailData);
    }

    localStorage.removeItem("information");
    localStorage.removeItem("total_price");
    localStorage.removeItem("price");
    localStorage.removeItem("id_coupon");
    localStorage.removeItem("coupon");
    localStorage.setItem("carts", JSON.stringify([]));

    setRedirect(true);
    dispatch(changeCount(count_change));
  };

  const handleMomo = () => {
    setOrderID(Math.random().toString());
    console.log("MoMo Payment Success");
  };

  return (
    <div>
      {loadOrder && (
        <div className="wrapper_loader">
          <div className="loader"></div>
        </div>
      )}

      <div className="breadcrumb-area">
        <div className="container">
          <div className="breadcrumb-content">
            <ul>
              <li><a href="/">Home</a></li>
              <li className="active">Checkout</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <div className="row">
          <div className="col-lg-6 col-12 pb-5">
            <form onSubmit={handleSubmit(handleCheckout)}>
              <div className="checkbox-form">
                <h3>Billing Details</h3>
                <div className="row">
                  {["fullname", "phone", "address", "email"].map((field, index) => (
                    <div className="col-md-12" key={index}>
                      <div className="checkout-form-list">
                        <label>
                          {field.charAt(0).toUpperCase() + field.slice(1)} <span className="required">*</span>
                        </label>
                        <input
                          placeholder={`Enter ${field}`}
                          type="text"
                          name={field}
                          ref={register({ required: true })}
                          value={information[field]}
                          onChange={handleInputChange}
                        />
                        {errors[field] && <span style={{ color: "red" }}>* {field} is required</span>}
                      </div>
                    </div>
                  ))}

                  <div className="col-md-12">
                    <div className="order-button-payment">
                      {redirect && <Redirect to="/success" />}
                      <input value="Place Order" type="submit" />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="col-lg-6 col-12">
            <div className="your-order">
              <h3>Your Order</h3>
              <div className="your-order-table table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="cart-product-name">Product</th>
                      <th className="cart-product-total">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list_carts.map((item, idx) => (
                      <tr className="cart_item" key={idx}>
                        <td className="cart-product-name">
                          {item.name_product} <strong className="product-quantity"> × {item.count}</strong>
                        </td>
                        <td className="cart-product-total">
                          <span className="amount">
                            {new Intl.NumberFormat('vi-VN').format(item.price_product * item.count) + " VNĐ"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="cart-subtotal">
                      <th>Discount</th>
                      <td>
                        <span className="amount">
                          {new Intl.NumberFormat('vi-VN').format(discount) + " VNĐ"}
                        </span>
                      </td>
                    </tr>
                    <tr className="order-total">
                      <th>Order Total</th>
                      <td>
                        <strong>
                          <span className="amount">
                            {new Intl.NumberFormat('vi-VN').format(totalPrice) + " VNĐ"}
                          </span>
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="payment-method">
                <div className="payment-accordion">
                  <div id="accordion">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="panel-title">
                          <a data-toggle="collapse" data-target="#collapseThree">
                            PayPal
                          </a>
                        </h5>
                      </div>
                      <div id="collapseThree" className="collapse">
                        <div className="card-body">
                          {showError ? (
                            "Please check information!"
                          ) : (
                            <Paypal information={information} total={totalPrice} />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="card">
                      <div className="card-header">
                        <h5 className="panel-title">
                          <a data-toggle="collapse" data-target="#collapseMomo">
                            MoMo
                          </a>
                        </h5>
                      </div>
                      <div id="collapseMomo" className="collapse">
                        <div className="card-body">
                          {showError ? (
                            "Please check information!"
                          ) : (
                            <div>
                              <img
                                src="https://developers.momo.vn/images/logo.png"
                                width="50"
                                onClick={handleMomo}
                                style={{ cursor: "pointer" }}
                                alt="MoMo"
                              />
                              <MoMo orderID={orderID} total={totalPrice} />
                            </div>
                          )}
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
    </div>
  );
}

export default Checkout;
