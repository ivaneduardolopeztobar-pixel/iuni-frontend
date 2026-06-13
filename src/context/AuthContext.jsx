import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    const profileId = localStorage.getItem("profileId");
    const photoPath = localStorage.getItem("photoPath");
    if (token) setUser({ token, userType, profileId, photoPath });
    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("userType", data.userType);
    localStorage.setItem("profileId", data.profileId || "");
    localStorage.setItem("photoPath", data.photoPath || "");
    setUser(data);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  const updatePhoto = (photoPath) => {
    localStorage.setItem("photoPath", photoPath);
    setUser(prev => ({ ...prev, photoPath }));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, updatePhoto }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
