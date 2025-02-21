import { useState, useContext, createContext } from "react";

// Create SearchContext
const SearchContext = createContext();

// SearchProvider Component
const SearchProvider = ({ children }) => {
  const [search, setSearch] = useState({
    keyword: "",
    result: [],
  });

  return (
    <SearchContext.Provider value={[search, setSearch]}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom Hook to Access SearchContext
const useSearch = () => {
  return useContext(SearchContext);
};

export { useSearch, SearchProvider };
