import React from "react";

const NavBar = () => {
  return (
    <div className="flex items-center text-xl mt-6 mb-4">
      <img
        className="w-6"
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtLasGzx5BX_sw3nQwhIribbIBmFnr-XjXE0wdKybeRg&s"
        alt="logo"
      />
      <h3 className="text-white">PaperTrader</h3>
    </div>
  );
};

export default NavBar;
