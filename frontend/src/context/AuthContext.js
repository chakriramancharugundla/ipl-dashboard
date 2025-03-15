import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Add loading state

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false); // ✅ Finish loading
    };

    loadUser();
  }, []);

  // ✅ Login function (store user in state & localStorage)
  const login = (userData) => {
    console.log("authprovider login function");
    
    setUser(userData);
      // Store token separately in localStorage
    localStorage.setItem("token", userData.token);

    localStorage.setItem("user", JSON.stringify(userData));
    console.log("authprovider login function   2");
  };

  // ✅ Logout function (clear state & localStorage)
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children} {/* Prevent rendering until loaded */}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
