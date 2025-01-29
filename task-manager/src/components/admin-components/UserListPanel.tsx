import { useEffect, useRef, useState } from "react";
import { getUserListQuery } from "../../api/queries/UserQuery";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from "react-icons/md";
import Button from "../Button";
import AfterMountUseEffect from "../../hooks/AfterMountUseEffect";
import { deleteUserMutation } from "../../api/mutations/UserMutation";
import { toast } from "sonner";
import { ImSpinner8 } from "react-icons/im";
import Input from "../Input";

function PageSelection({
  totalItems,
  itemsPerPage,
  pagePerSelection,
  setCurrentPage,
  currentPage,
}: {
  itemsPerPage: number;
  totalItems: number;
  pagePerSelection: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages
  const [currentSelection, setCurrentSelection] = useState(
    Math.ceil(currentPage / itemsPerPage)
  ); // Track current section

  const selectionStart = currentSelection * pagePerSelection + 1; // First page in the current section
  const selectionEnd = Math.min(
    (currentSelection + 1) * pagePerSelection,
    totalPages
  ); // Last page in the current section

  const pagesInCurrentSelection = Array.from(
    { length: selectionEnd - selectionStart + 1 },
    (_, index) => selectionStart + index
  );

  const handleNextSection = () => {
    if (currentSelection < Math.ceil(totalPages / pagePerSelection) - 1) {
      setCurrentSelection((prev) => prev + 1);
      setCurrentPage(selectionStart + pagePerSelection - 1); // Adjust to 0-based index for the parent
    }
  };

  const handlePrevSection = () => {
    if (currentSelection > 0) {
      setCurrentSelection((prev) => prev - 1);
      setCurrentPage(selectionStart - pagePerSelection - 1); // Adjust to 0-based index for the parent
    }
  };

  const handlePrevPage = () => {
    if (currentPage + 1 > 1) {
      if (currentPage + 1 === selectionStart) {
        // If the current page is the first in the section, move to the previous section
        handlePrevSection();
      } else {
        setCurrentPage((prev) => prev - 1); // Update parent state
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage + 1 < totalPages) {
      if (currentPage + 1 === selectionEnd) {
        // If the current page is the last in the section, move to the next section
        handleNextSection();
      } else {
        setCurrentPage((prev) => prev + 1); // Update parent state
      }
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center border border-gray-400">
        {/* Navigate to previous section */}
        <Button
          className="h-full bg-gray-100"
          disabled={currentSelection === 0}
          onClick={handlePrevSection}
        >
          <MdKeyboardDoubleArrowLeft className="size-5" />
        </Button>

        {/* Navigate to the previous page */}
        <Button
          className="h-full bg-gray-100"
          disabled={currentPage + 1 === 1}
          onClick={handlePrevPage}
        >
          <MdKeyboardArrowLeft className="size-5" />
        </Button>

        {/* Render page numbers for the current section */}
        <div className="flex gap-2 mx-2">
          {pagesInCurrentSelection.map((page) => (
            <Button
              key={`page-${page}`}
              onClick={() => {
                setCurrentPage(page - 1); // Adjust to 0-based index for the parent
              }}
              className={`px-2 font-semibold bg-gray-100 hover:underline ${
                page === currentPage + 1 ? "bg-blue-200" : ""
              }`}
            >
              {page}
            </Button>
          ))}
        </div>

        {/* Navigate to the next page */}
        <Button
          className="h-full bg-gray-100"
          disabled={currentPage + 1 === totalPages}
          onClick={handleNextPage}
        >
          <MdKeyboardArrowRight className="size-5" />
        </Button>

        {/* Navigate to next section */}
        <Button
          className="h-full bg-gray-100"
          disabled={
            currentSelection >= Math.ceil(totalPages / pagePerSelection) - 1
          }
          onClick={handleNextSection}
        >
          <MdKeyboardDoubleArrowRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}

function SearchSimilar({
  setSimilar,
  itemsPerPage,
  setItemsPerPage,
}: {
  itemsPerPage: number;
  setSimilar: React.Dispatch<React.SetStateAction<string>>;
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  const similar = useRef("");

  return (
    <div className="flex gap-2 mb-4 min-w-[500px]">
      <Input
        id="search-string"
        placeholder="Search..."
        onChange={(e) => {
          if (e.target.value === "") {
            setSimilar("");
          }
          similar.current = e.target.value;
        }}
      />
      <Button
        className="px-2 font-semibold bg-blue-500 rounded-md text-zinc-50"
        onClick={() => {
          setSimilar(similar.current);
        }}
      >
        Search
      </Button>
      <select
        className="border outline-none border-zinc-900"
        value={itemsPerPage}
        onChange={(e) => {
          setItemsPerPage(Number(e.target.value));
        }}
      >
        <option value={5}>5</option>
        <option value={10}>10</option>
        <option value={15}>15</option>
        <option value={20}>20</option>
      </select>
    </div>
  );
}

export default function UserListPanel() {
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const [similar, setSimilar] = useState("");

  const getUserList = getUserListQuery(
    itemsPerPage,
    currentPage,
    sortBy,
    similar
  );
  const deleteUser = deleteUserMutation();

  AfterMountUseEffect(() => {
    getUserList.refetch();
  }, [currentPage, itemsPerPage, sortBy, similar]);

  useEffect(() => {
    if (deleteUser.data) {
      toast.success("USER DELETED");
      getUserList.refetch();
    }
  }, [deleteUser.data]);

  return (
    <div className="p-4">
      <div className="overflow-x-auto">
        <SearchSimilar
          setSimilar={setSimilar}
          setItemsPerPage={setItemsPerPage}
          itemsPerPage={itemsPerPage}
        />
        <table className="min-w-full mb-2 text-sm text-left text-gray-500 border border-collapse border-gray-300">
          <thead className="text-xs font-bold uppercase bg-gray-100 text-zinc-900">
            <tr>
              <th scope="col" className="px-4 py-2 border-b border-gray-300">
                #
              </th>
              <th
                onClick={() => {
                  setSortBy("email");
                }}
                scope="col"
                className="px-4 py-2 border-b border-gray-300 cursor-pointer"
              >
                Email
              </th>
              <th scope="col" className="px-4 py-2 border-b border-gray-300">
                Total Task
              </th>
              <th
                onClick={() => {
                  setSortBy("firstname");
                }}
                scope="col"
                className="px-4 py-2 border-b border-gray-300 cursor-pointer"
              >
                First name
              </th>
              <th
                onClick={() => {
                  setSortBy("lastname");
                }}
                scope="col"
                className="px-4 py-2 border-b border-gray-300 cursor-pointer"
              >
                Last name
              </th>
              <th
                onClick={() => {
                  setSortBy("isEmailVerified");
                }}
                scope="col"
                className="px-4 py-2 border-b border-gray-300 cursor-pointer"
              >
                Verified
              </th>
              <th scope="col" className="px-4 py-2 border-b border-gray-300">
                Role
              </th>
              <th scope="col" className="px-4 py-2 border-b border-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {getUserList.data?.userInformationList.map((user, index) => (
              <tr className="bg-gray-50 hover:bg-gray-100" key={user._id}>
                <td className="px-4 py-2">
                  {index + 1 + currentPage * itemsPerPage}
                </td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">{user.totalTask}</td>
                <td className="px-4 py-2">{user.firstname}</td>
                <td className="px-4 py-2">{user.lastname}</td>
                <td className="px-4 py-2">
                  {user.isEmailVerified ? "True" : "False"}
                </td>
                <td className="px-4 py-2">{user.role}</td>
                <td className="px-4 py-2">
                  <button
                    disabled={deleteUser.isPending}
                    onClick={() => {
                      deleteUser.mutate(user._id);
                    }}
                    className="px-3 py-1 text-white bg-red-600 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {getUserList.data?.userInformationList.length === 0 && (
          <p className="my-4 text-center">No data found.</p>
        )}
        {getUserList.isLoading && (
          <div className="flex justify-center my-4">
            <ImSpinner8 className="animate-spin size-5" />
          </div>
        )}
        <PageSelection
          itemsPerPage={itemsPerPage}
          totalItems={getUserList.data?.totalUser || 0}
          setCurrentPage={setCurrentPage}
          pagePerSelection={2}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
