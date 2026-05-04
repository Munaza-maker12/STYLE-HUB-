// Create a new file: src/utils/tokenDebug.js
// This will help you debug token issues

export const debugToken = () => {
  console.log("🔍 TOKEN DEBUG INFO:");
  
  const accessToken = localStorage.getItem("accessToken");
  const token = localStorage.getItem("token");
  const userToken = localStorage.getItem("userToken");
  const user = localStorage.getItem("user");
  
  console.log("accessToken:", accessToken ? "✅ EXISTS" : "❌ MISSING");
  console.log("token:", token ? "✅ EXISTS" : "❌ MISSING");
  console.log("userToken:", userToken ? "✅ EXISTS" : "❌ MISSING");
  console.log("user:", user ? "✅ EXISTS" : "❌ MISSING");
  
  // Log the actual token (first 50 chars only for security)
  if (accessToken) {
    console.log("accessToken value (first 50 chars):", accessToken.substring(0, 50) + "...");
  }
  
  // Try to decode the JWT (just the payload, not verify)
  if (accessToken) {
    try {
      const parts = accessToken.split('.');
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        console.log("Token payload:", payload);
        
        // Check if expired
        if (payload.exp) {
          const expiryDate = new Date(payload.exp * 1000);
          const now = new Date();
          console.log("Token expires:", expiryDate.toLocaleString());
          console.log("Is expired?", now > expiryDate ? "❌ YES" : "✅ NO");
        }
      }
    } catch (e) {
      console.error("Error decoding token:", e);
    }
  }
};

// Clean up all old tokens
export const cleanupOldTokens = () => {
  const accessToken = localStorage.getItem("accessToken");
  
  if (accessToken) {
    // Keep accessToken, remove others
    localStorage.removeItem("token");
    localStorage.removeItem("userToken");
    console.log("✅ Cleaned up old token keys");
  } else {
    // If no accessToken, try to migrate from old keys
    const token = localStorage.getItem("token");
    const userToken = localStorage.getItem("userToken");
    
    const tokenToUse = token || userToken;
    
    if (tokenToUse) {
      localStorage.setItem("accessToken", tokenToUse);
      localStorage.removeItem("token");
      localStorage.removeItem("userToken");
      console.log("✅ Migrated old token to accessToken");
    }
  }
};

// Call this in your App.jsx or main component on mount
export const initTokenSystem = () => {
  console.log("🚀 Initializing token system...");
  cleanupOldTokens();
  debugToken();
};