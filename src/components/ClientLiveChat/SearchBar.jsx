const SearchBar = ({ onSearchChange }) => {
    return (
      <input
        type="text"
        placeholder="Find Client"
        className="w-full p-2 border rounded-md mt-2"
        onChange={(e) => onSearchChange(e.target.value)}
      />
    );
  };
  
  export default SearchBar;
  