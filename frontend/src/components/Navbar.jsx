const Navbar = ({
  currentUser,
  handleLogout,
}) => {
  return (
    <div className="navbar">
      <div className="user-chip">
        <span>{currentUser.username}</span>
        <small>{currentUser.friend_code}</small>
      </div>

      <button
        className="ghost-button"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
