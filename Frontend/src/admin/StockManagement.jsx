import React, { useState, useEffect } from "react";
import axios from "axios";
import "./StockManagement.css";

const ALL_SIZES = ["S", "M", "L", "XL", "XXL"];

const StockManagement = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [confirmModal, setConfirmModal] = useState({ show: false, productId: null, productName: "", size: null });
  const [addSizeModal, setAddSizeModal] = useState({ show: false, productId: null, productName: "", existingSizes: [] });
  const [newSize, setNewSize] = useState("");
  const [newSizeQty, setNewSizeQty] = useState(0);
  const [addSizeLoading, setAddSizeLoading] = useState(false);

  useEffect(() => { fetchProducts(); }, []);
  useEffect(() => { filterProducts(); }, [products, searchTerm]);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:4000/api/admin/products/stock', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
      setLoading(false);
      setHasChanges(false);
      setPendingUpdates({});
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchTerm) { setFilteredProducts(products); return; }
    const filtered = products.filter(product => {
      const search = searchTerm.toLowerCase();
      const totalStock = getTotalStock(product);
      const stockStatus = getStockStatus(product.stock, product.customStock).status;
      return (
        product.name.toLowerCase().includes(search) ||
        product.category.toLowerCase().includes(search) ||
        product.subCategory.toLowerCase().includes(search) ||
        totalStock.toString().includes(search) ||
        stockStatus.toLowerCase().includes(search)
      );
    });
    setFilteredProducts(filtered);
  };

  const handleStockChange = (productId, size, newQuantity, type = 'size') => {
    setProducts(prev => prev.map(product => {
      if (product._id === productId) {
        if (type === 'custom') return { ...product, customStock: Math.max(0, newQuantity) };
        return { ...product, stock: { ...product.stock, [size]: Math.max(0, newQuantity) } };
      }
      return product;
    }));
    setPendingUpdates(prev => ({
      ...prev,
      [`${productId}-${size}-${type}`]: { productId, size, quantity: Math.max(0, newQuantity), type }
    }));
    setHasChanges(true);
  };

  const askDeleteSize = (productId, productName, size) => {
    setConfirmModal({ show: true, productId, productName, size });
  };

  const confirmDeleteSize = async () => {
    const { productId, size, productName } = confirmModal;
    setConfirmModal({ show: false, productId: null, productName: "", size: null });
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:4000/api/products/${productId}/stock/${size}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(prev => prev.map(product => {
        if (product._id === productId) {
          if (size === 'custom') return { ...product, customStock: null };
          const updatedStock = { ...product.stock };
          delete updatedStock[size];
          return { ...product, stock: updatedStock };
        }
        return product;
      }));
      setPendingUpdates(prev => {
        const updated = { ...prev };
        delete updated[`${productId}-${size}-size`];
        delete updated[`${productId}-custom-custom`];
        return updated;
      });
      showToast(size === 'custom' ? `"${productName}" custom stock deleted` : `"${productName}" size ${size} deleted`, "success");
    } catch (error) {
      showToast("Delete failed: " + (error.response?.data?.message || error.message), "error");
    }
  };

  const cancelDelete = () => {
    setConfirmModal({ show: false, productId: null, productName: "", size: null });
  };

  const openAddSizeModal = (product) => {
    const existingSizes = Object.keys(product.stock || {});
    setAddSizeModal({ show: true, productId: product._id, productName: product.name, existingSizes });
    setNewSize("");
    setNewSizeQty(0);
  };

  const closeAddSizeModal = () => {
    setAddSizeModal({ show: false, productId: null, productName: "", existingSizes: [] });
    setNewSize("");
    setNewSizeQty(0);
  };

  const getAvailableSizes = (existingSizes) => ALL_SIZES.filter(s => !existingSizes.includes(s));

  const confirmAddSize = async () => {
    if (!newSize) return;
    const { productId, productName } = addSizeModal;
    setAddSizeLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `http://localhost:4000/api/products/${productId}/stock/${newSize}`,
        { quantity: newSizeQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(prev => prev.map(product => {
        if (product._id === productId) {
          return { ...product, stock: { ...product.stock, [newSize]: newSizeQty } };
        }
        return product;
      }));
      showToast(`"${productName}" mein size ${newSize} add ho gaya!`, "success");
      closeAddSizeModal();
    } catch (error) {
      showToast("Size add nahi hua: " + (error.response?.data?.message || error.message), "error");
    } finally {
      setAddSizeLoading(false);
    }
  };

  const updateAllChanges = async () => {
    if (!hasChanges || Object.keys(pendingUpdates).length === 0) {
      showToast("No changes to save", "error"); return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const updatePromises = Object.values(pendingUpdates).map(update =>
        axios.put(`http://localhost:4000/api/admin/products/${update.productId}/stock`, {
          size: update.size, quantity: update.quantity, type: update.type
        }, { headers: { Authorization: `Bearer ${token}` } })
      );
      await Promise.all(updatePromises);
      setPendingUpdates({});
      setHasChanges(false);
      setLoading(false);
      showToast("All changes have been saved!", "success");
    } catch (error) {
      setLoading(false);
      showToast("Changes were not saved — please try again", "error");
    }
  };

  const getStockStatus = (stock, customStock) => {
    const total = Object.values(stock).reduce((a, b) => a + b, 0) + (customStock ?? 0);
    if (total === 0) return { status: 'Out of Stock', class: 'out-of-stock' };
    if (total <= 5) return { status: 'Low Stock', class: 'low-stock' };
    return { status: 'In Stock', class: 'in-stock' };
  };

  const getTotalStock = (product) => {
    return Object.values(product.stock).reduce((a, b) => a + b, 0) + (product.customStock ?? 0);
  };

  const getStockCounts = () => {
    const total = products.length;
    const lowStock = products.filter(p => getTotalStock(p) <= 5 && getTotalStock(p) > 0).length;
    const outOfStock = products.filter(p => getTotalStock(p) === 0).length;
    return { total, inStock: total - lowStock - outOfStock, lowStock, outOfStock };
  };

  const stockCounts = getStockCounts();

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="stock-management">

      {toast.show && (
        <div className={`toast-notification toast-${toast.type}`}>{toast.message}</div>
      )}

      {/* Delete Confirm Modal */}
      {confirmModal.show && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">⚠️</div>
            <h3>{confirmModal.size === 'custom' ? 'Do you want to delete custom stock?' : 'Do you want to delete this size?'}</h3>
            <p>
              <strong>{confirmModal.productName}</strong>{" "}
              {confirmModal.size === 'custom'
                ? <>custom stock will be <span className="modal-size-highlight">permanently deleted</span>.</>
                : <>size <span className="modal-size-highlight">{confirmModal.size}</span> will be permanently deleted.</>
              }
            </p>
            <p className="modal-warning">This action cannot be undone!</p>
            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={cancelDelete}>Cancel</button>
              <button className="modal-delete-btn" onClick={confirmDeleteSize}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Size Modal */}
      {addSizeModal.show && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">➕</div>
            <h3>Naya Size Add Karein</h3>
            <p><strong>{addSizeModal.productName}</strong></p>

            {getAvailableSizes(addSizeModal.existingSizes).length === 0 ? (
              <p style={{ color: '#888', margin: '16px 0' }}>
                Is product mein sab sizes already add hain (S, M, L, XL, XXL).
              </p>
            ) : (
              <>
                <div className="add-size-row">
                  <label>Size:</label>
                  <select value={newSize} onChange={e => setNewSize(e.target.value)} className="add-size-select">
                    <option value="">-- Select Size --</option>
                    {getAvailableSizes(addSizeModal.existingSizes).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="add-size-row">
                  <label>Quantity:</label>
                  <div className="controls" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <button onClick={() => setNewSizeQty(q => Math.max(0, q - 1))} disabled={newSizeQty <= 0}>-</button>
                    <input
                      type="number"
                      min="0"
                      className="qty-input"
                      value={newSizeQty}
                      onChange={(e) => setNewSizeQty(Math.max(0, parseInt(e.target.value) || 0))}
                    />
                    <button onClick={() => setNewSizeQty(q => q + 1)}>+</button>
                  </div>
                </div>
              </>
            )}

            <div className="modal-actions">
              <button className="modal-cancel-btn" onClick={closeAddSizeModal}>Cancel</button>
              {getAvailableSizes(addSizeModal.existingSizes).length > 0 && (
                <button
                  className="modal-delete-btn"
                  style={{ background: '#22c55e', borderColor: '#22c55e' }}
                  onClick={confirmAddSize}
                  disabled={!newSize || addSizeLoading}
                >
                  {addSizeLoading ? "Adding..." : "Add Size"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="header">
        <h2>Stock Management</h2>
        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name, category, stock..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={updateAllChanges}
            className={`update-btn ${hasChanges ? 'active' : ''}`}
            disabled={!hasChanges}
          >
            Save Changes {hasChanges && `(${Object.keys(pendingUpdates).length})`}
          </button>
        </div>
      </div>

      <div className="stats-badges">
        <div className="badge total"><span className="count">{stockCounts.total}</span><span className="label">Total Products</span></div>
        <div className="badge in-stock"><span className="count">{stockCounts.inStock}</span><span className="label">In Stock</span></div>
        <div className="badge low-stock"><span className="count">{stockCounts.lowStock}</span><span className="label">Low Stock</span></div>
        <div className="badge out-of-stock"><span className="count">{stockCounts.outOfStock}</span><span className="label">Out of Stock</span></div>
      </div>

      {hasChanges && <div className="changes-alert">You have unsaved changes. Click "Save Changes" to update.</div>}

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Size Stock</th>
              <th>Custom</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              const stockStatus = getStockStatus(product.stock, product.customStock);
              const totalStock = getTotalStock(product);
              const availableSizes = getAvailableSizes(Object.keys(product.stock || {}));

              return (
                <tr key={product._id}>
                  <td className="product-info">
                    <div className="product-name">{product.name}</div>
                    <div className="product-meta">{product.category} • {product.subCategory}</div>
                    <div className="product-price">Rs {product.new_price}</div>
                  </td>

                  <td className="size-stock">
                    {Object.entries(product.stock).map(([size, qty]) => (
                      <div key={size} className="size-control">
                        <span className="size">{size}</span>
                        <div className="controls">
                          <button onClick={() => handleStockChange(product._id, size, qty - 1)} disabled={qty <= 0}>-</button>
                          {/* ✅ UPDATED: Span ki jagah input */}
                          <input
                            type="number"
                            min="0"
                            className={`qty-input ${qty === 0 ? 'zero' : qty <= 3 ? 'low' : ''}`}
                            value={qty}
                            onChange={(e) => handleStockChange(product._id, size, parseInt(e.target.value) || 0)}
                            onBlur={(e) => { if (!e.target.value || parseInt(e.target.value) < 0) handleStockChange(product._id, size, 0); }}
                          />
                          <button onClick={() => handleStockChange(product._id, size, qty + 1)}>+</button>
                        </div>
                        <button className="size-delete-btn" onClick={() => askDeleteSize(product._id, product.name, size)} title={`Delete ${size}`}>✕</button>
                      </div>
                    ))}
                    {availableSizes.length > 0 && (
                      <button className="add-size-btn" onClick={() => openAddSizeModal(product)} title="Naya size add karein">
                        + Add Size
                      </button>
                    )}
                  </td>

                  <td className="custom-stock">
                    {product.customStock != null ? (
                      <div className="size-control">
                        <div className="controls">
                          <button onClick={() => handleStockChange(product._id, 'custom', product.customStock - 1, 'custom')} disabled={product.customStock <= 0}>-</button>
                          {/* ✅ UPDATED: Span ki jagah input */}
                          <input
                            type="number"
                            min="0"
                            className="qty-input"
                            value={product.customStock}
                            onChange={(e) => handleStockChange(product._id, 'custom', parseInt(e.target.value) || 0, 'custom')}
                            onBlur={(e) => { if (!e.target.value || parseInt(e.target.value) < 0) handleStockChange(product._id, 'custom', 0, 'custom'); }}
                          />
                          <button onClick={() => handleStockChange(product._id, 'custom', product.customStock + 1, 'custom')}>+</button>
                        </div>
                        <button className="size-delete-btn" onClick={() => askDeleteSize(product._id, product.name, 'custom')} title="Delete custom stock">✕</button>
                      </div>
                    ) : (
                      <span style={{ color: '#aaa', fontSize: '12px' }}>—</span>
                    )}
                  </td>

                  <td className="total-stock">
                    <span className={`total ${totalStock === 0 ? 'zero' : totalStock <= 5 ? 'low' : ''}`}>{totalStock}</span>
                  </td>

                  <td className="status">
                    <span className={`status-badge ${stockStatus.class}`}>{stockStatus.status}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && <div className="no-results">No products found matching your search.</div>}
    </div>
  );
};

export default StockManagement;