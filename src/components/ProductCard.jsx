// Thêm hàm tối ưu URL Cloudinary
const optimizeCloudinaryImage = (url, width = 300) => {
  if (url && url.includes('cloudinary.com')) {
    // Thêm transformation vào URL Cloudinary
    return url.replace('/upload/', `/upload/w_${width},c_scale/`);
  }
  return url;
};

// Trong component render
<img 
  src={optimizeCloudinaryImage(product.image)} 
  alt={product.name_product} 
  className="product-image"
/>