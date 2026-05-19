const Navbar = ({
  currentUser,
  handleLogout,
}) => {
  return (
    <div className="navbar">
      <div>
        👤 {currentUser.username}
      </div>

      <div>
        🎮 {currentUser.friend_code}
      </div>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Navbar;