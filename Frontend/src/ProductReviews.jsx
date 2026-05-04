import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import "./ProductReviews.css";

const ProductReviews = ({ productId }) => {
  const user = useSelector((state) => state.user.userInfo);
  const [reviews, setReviews] = useState([]);
  const [product, setProduct] = useState(null);
  const [canReview, setCanReview] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ NEW: Guest verification
  const [showGuestVerification, setShowGuestVerification] = useState(false);
  const [guestVerification, setGuestVerification] = useState({
    orderId: "",
    email: "",
  });

  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: "",
    comment: "",
    images: [],
    guestName: "",
    guestEmail: "",
  });

  useEffect(() => {
    fetchReviews();
    fetchProduct();
    if (user) {
      checkCanReview();
    }
  }, [productId, sortBy, page, user]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/products/${productId}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/reviews/product/${productId}?sort=${sortBy}&page=${page}`
      );
      setReviews(res.data.reviews);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  const checkCanReview = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/reviews/can-review/${productId}/${user._id}`
      );
      setCanReview(res.data.canReview);
      if (res.data.orderId) setOrderId(res.data.orderId);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ NEW: Verify guest eligibility
  const verifyGuestOrder = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/reviews/can-review-guest",
        {
          orderId: guestVerification.orderId,
          email: guestVerification.email,
          productId,
        }
      );

      if (res.data.canReview) {
        setCanReview(true);
        setOrderId(res.data.orderId);
        setReviewForm({
          ...reviewForm,
          guestEmail: guestVerification.email,
        });
        setShowGuestVerification(false);
        setShowReviewForm(true);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productId", productId);

    if (user) {
      formData.append("userId", user._id);
      formData.append("orderId", orderId);
    } else {
      formData.append("orderId", orderId);
      formData.append("guestEmail", reviewForm.guestEmail);
      formData.append("guestName", reviewForm.guestName);
    }

    formData.append("rating", reviewForm.rating);
    formData.append("title", reviewForm.title);
    formData.append("comment", reviewForm.comment);

    reviewForm.images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      await axios.post("http://localhost:4000/api/reviews", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Review submitted successfully!");
      setShowReviewForm(false);
      setCanReview(false);
      fetchReviews();
      fetchProduct();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} className="star filled" />);
    }
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" className="star filled" />);
    }
    while (stars.length < 5) {
      stars.push(<FaRegStar key={stars.length} className="star empty" />);
    }
    return stars;
  };

  const renderRatingBar = (star, count) => {
    const percentage = product.totalReviews > 0 
      ? (count / product.totalReviews) * 100 
      : 0;

    return (
      <div className="rating-bar" key={star}>
        <span>{star} ⭐</span>
        <div className="bar">
          <div className="fill" style={{ width: `${percentage}%` }}></div>
        </div>
        <span>{count}</span>
      </div>
    );
  };

  return (
    <div className="product-reviews">
      {/* Rating Summary */}
      {product && (
        <div className="rating-summary">
          <div className="overall-rating">
            <h2>{product.averageRating || 0}</h2>
            <div className="stars">{renderStars(product.averageRating || 0)}</div>
            <p>{product.totalReviews} reviews</p>
          </div>

          <div className="rating-distribution">
            {[5, 4, 3, 2, 1].map((star) =>
              renderRatingBar(star, product.ratingDistribution?.[star] || 0)
            )}
          </div>
        </div>
      )}

      {/* ✅ Write Review Buttons */}
      {user && canReview && (
        <button
          className="write-review-btn"
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          Write a Review
        </button>
      )}

      {!user && !canReview && (
        <button
          className="write-review-btn guest"
          onClick={() => setShowGuestVerification(true)}
        >
          📦 Purchased this product? Write a Review
        </button>
      )}

      {/* ✅ Guest Verification Modal */}
      {showGuestVerification && (
        <div className="guest-verification-modal">
          <div className="modal-content">
            <h3>Verify Your Purchase</h3>
            <p>Enter your order details to leave a review</p>

            <div className="form-group">
              <label>Order ID:</label>
              <input
                type="text"
                placeholder="ORD-1234567890"
                value={guestVerification.orderId}
                onChange={(e) =>
                  setGuestVerification({
                    ...guestVerification,
                    orderId: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label>Email (used during checkout):</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={guestVerification.email}
                onChange={(e) =>
                  setGuestVerification({
                    ...guestVerification,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="modal-actions">
              <button onClick={verifyGuestOrder} className="verify-btn">
                Verify & Continue
              </button>
              <button
                onClick={() => setShowGuestVerification(false)}
                className="cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <form className="review-form" onSubmit={handleSubmitReview}>
          <h3>Write Your Review</h3>

          {/* ✅ Guest name field (if not logged in) */}
          {!user && (
            <div className="form-group">
              <input
                type="text"
                placeholder="Your Name *"
                value={reviewForm.guestName}
                onChange={(e) =>
                  setReviewForm({ ...reviewForm, guestName: e.target.value })
                }
                required
                maxLength={50}
              />
            </div>
          )}

          <div className="form-group">
            <label>Rating:</label>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={star <= reviewForm.rating ? "star filled" : "star empty"}
                  onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                />
              ))}
            </div>
          </div>

          <div className="form-group">
            <input
              type="text"
              placeholder="Review Title"
              value={reviewForm.title}
              onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
              required
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <textarea
              placeholder="Write your review..."
              value={reviewForm.comment}
              onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
              required
              maxLength={500}
              rows={5}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Add Photos (optional, max 3):</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const files = Array.from(e.target.files).slice(0, 3);
                setReviewForm({ ...reviewForm, images: files });
              }}
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Submit Review
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setShowReviewForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Sort Options */}
      <div className="reviews-header">
        <h3>Customer Reviews ({reviews.length})</h3>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="-createdAt">Most Recent</option>
          <option value="-helpful">Most Helpful</option>
          <option value="-rating">Highest Rating</option>
          <option value="rating">Lowest Rating</option>
        </select>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-card">
              <div className="review-header">
                <div className="user-info">
                  <img
                    src={review.userId?.avatar || "/default-avatar.png"}
                    alt={review.userId?.name || review.guestName}
                  />
                  <div>
                    <h4>{review.userId?.name || review.guestName || "Anonymous"}</h4>
                    {review.verified && <span className="verified">✓ Verified Purchase</span>}
                  </div>
                </div>
                <div className="review-meta">
                  <div className="stars">{renderStars(review.rating)}</div>
                  <span className="date">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <h4 className="review-title">{review.title}</h4>
              <p className="review-comment">{review.comment}</p>

              {review.images && review.images.length > 0 && (
                <div className="review-images">
                  {review.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`Review ${idx + 1}`} />
                  ))}
                </div>
              )}

              <button
                className="helpful-btn"
                onClick={async () => {
                  await axios.post(`http://localhost:4000/api/reviews/${review._id}/helpful`);
                  fetchReviews();
                }}
              >
                👍 Helpful ({review.helpful})
              </button>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;