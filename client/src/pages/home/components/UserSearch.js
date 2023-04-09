import React from "react";

function UserSearch({searchKey, setSearchKey}) {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search user / chat"
        className="rounded-2xl w-full border-gray-300 pl-10 text-gray-500 bg-white h-14"
        value={searchKey}
        onChange={(e) => setSearchKey(e.target.value)}
      />
      <i className="ri-search-2-line absolute top-4 left-4 text-gray-500"></i>
    </div>
  );
}

export default UserSearch;
