import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./SingleProduct.css";

const SingleProduct = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `https://ecomm-qy13.onrender.com/api/products/${id}`
        );

        const data = await response.json();

        console.log("Single Product:", data);

        if (!response.ok) {
          throw new Error(
            data.message || "Product not found"
          );
        }

        setProduct(data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="single-product-loading">
        <h2>Loading product...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="single-product-error">
        <h2>Product Load Failed</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="single-product-error">
        <h2>Product not found</h2>
      </div>
    );
  }

  const price = Number(product.price || 0);
  const discountPrice = Number(
    product.discountPrice || 0
  );

  return (
    <section className="single-product-page">

      <div className="single-product-container">

        <div className="single-product-box">

          {/* Product Image */}

          <div className="single-product-image">

            <img
              src={product.images?.[0]}
              alt={product.name}
            />

          </div>

          {/* Product Information */}

          <div className="single-product-info">

            <h1>{product.name}</h1>

            <p className="single-product-category">
              {product.category}
            </p>

            <div className="single-product-price">

              <strong>
                ₹ {discountPrice > 0
                  ? discountPrice
                  : price}
              </strong>

              {discountPrice > 0 &&
                discountPrice < price && (
                  <del>₹ {price}</del>
                )}

            </div>

            <p className="single-product-description">
              {product.description}
            </p>

            <p>
              <strong>SKU:</strong> {product.sku}
            </p>

            <p>
              <strong>Stock:</strong> {product.stock}
            </p>

            {product.sizes?.length > 0 && (
              <p>
                <strong>Sizes:</strong>{" "}
                {product.sizes.join(", ")}
              </p>
            )}

            {product.colors?.length > 0 && (
              <p>
                <strong>Colors:</strong>{" "}
                {product.colors.join(", ")}
              </p>
            )}

          </div>

        </div>

      </div>

    </section>
  );
};

export default SingleProduct;