import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faTrash,
  faSearch,
  faPenToSquare,
  faPlusCircle,
} from "@fortawesome/free-solid-svg-icons";
import { Divider, FormControl as Form } from "@mui/material";
import axios from "axios";
import Animated from "../components/motion";

const ManageOffices = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRow, setActiveRow] = useState(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [departmentFormData, setDepartmentFormData] = useState({
    deptName: "",
    deptOfficeHead: "",
  });
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

    // Define a hardcoded list of names for the dropdown temporarily
    const [officeHeadOptions] = useState([
      "Janzen Joseph G. Sevilla",
      "Alein B. Navares",
      "Larmie S. Feliscuzo",
      "Rafaeliza P. Diano",
      "Nicarter V. Teves",
      "Erlyn Ivy O. Rago",
      "Arnie Ernesta M. Tacdoro",
      "Roberto P. Base, Jr."
    ]);
    

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/department/getAllDepts");
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);


  const handleDeleteUser = (deptId) => {
    toggleConfirmationDialog(deptId);
  };


  const toggleConfirmationDialog = (deptId = null) => {
    setUserToDelete(deptId);
    setShowConfirmationDialog(!showConfirmationDialog);
  };

  const confirmDeleteDepartment = async () => {
    try {
      await axios.delete(`http://localhost:8080/department/deleteDept/${userToDelete}`);
      const updatedUsers = await axios.get("http://localhost:8080/department/getAllDepts");
      setUsers(updatedUsers.data);
      setFilteredUsers(updatedUsers.data);
      toggleConfirmationDialog(); 

    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };


  const handleAddDepartment = () => {
    setShowAddDepartmentModal(true);
  };

  const handleDepartmentFormChange = (e) => {
    const { name, value } = e.target;
    setDepartmentFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDepartmentFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/department/addDept", departmentFormData);

      const updatedDepartments = await axios.get("http://localhost:8080/department/getAllDepts");
      setUsers(updatedDepartments.data);
      setFilteredUsers(updatedDepartments.data);
      setShowAddDepartmentModal(false);
      setDepartmentFormData({
        deptName: "",
        deptOfficeHead: "",
      });
    } catch (error) {
      console.error("Error adding department:", error);
    }
  };
  const totalDepartments = users.length;


  const handleSearch = () => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.deptName.toLowerCase().includes(searchTermLowerCase) ||
        user.deptOfficeHead.toLowerCase().includes(searchTermLowerCase)
    );
    setFilteredUsers(filtered);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedUsers = filteredUsers.slice(startIndex, endIndex);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleEditDepartment = (user) => {
    setEditingDepartment(user);
    setShowEditModal(true);
  };

  const handleUpdateDepartment = async (editedDepartment) => {
    try {
      await axios.put(`http://localhost:8080/department/updateDept?deptID=${editedDepartment.deptID}`, editedDepartment);
      const updatedUsers = await axios.get("http://localhost:8080/department/getAllDepts");
      setUsers(updatedUsers.data);
      setFilteredUsers(updatedUsers.data);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating department:", error);
    }
  };

// EditDepartmentModal component
const EditDepartmentModal = ({ department, onClose, onUpdate }) => {
  const [editedDepartment, setEditedDepartment] = useState(department);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDepartment((prevDepartment) => ({
      ...prevDepartment,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedDepartment);
  };




  return (
    <Animated>
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50" >
      <div className="bg-white rounded-lg shadow-md w-2/4">
        <div
          className="p-2 font-bold text-lg text-white rounded-t-lg"
          style={{ backgroundColor: '#8C383E', border: 'none', }}
        >
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="mr-2 ml-2"
            style={{ color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
          />
          Edit Department
        </div>
        <div className="p-4" >
          <form onSubmit={handleSubmit}>
            <div className="mb-4"style={{width: "50%"}} >
              <label htmlFor="deptName" className="block text-sm font-medium text-gray-700">
                Department Name
              </label>
              <input
                type="text"
                id="deptName"
                name="deptName"
                value={editedDepartment.deptName}
                onChange={handleInputChange}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                required
              />
            </div>
            <Divider/>
            <div className="mb-4 mt-5">
            <label htmlFor="deptOfficeHead" className="block text-base font-medium text-gray-700">
            Department Office Head: 
            <span className="font-medium text-black ml-4"> {editedDepartment.deptOfficeHead} </span>
          </label>
          </div>

            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                className="text-white px-3 py-1 w-auto rounded mr-2"
                style={{ backgroundColor: '#8C383E', border: 'none' }}
              >
                Save
              </button>
              <button
                type="button"
                className="bg-gray-300 text-gray-700 px-3 w-auto py-1 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </Animated>
  );
};


  return (
    <Animated>
    <div>
      <h1 className="text-2xl font-bold text-left ml-12 mt-6 mb-2">Department</h1>
      <label className="ml-12 text-sm text-gray-700">All Departments ({totalDepartments})</label>
        <div className="ml-8 mt-2">
          <div className="mr-10 mb-4 flex items-center justify-between">
            <div className="ml-4 flex items-center justify-start">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded px-2 py-1 mr-2"
              />
              <button
                className="text-white px-3 py-1 rounded"
                onClick={handleSearch}
                style={{ backgroundColor: '#8C383E' }}
              >
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>

            <div className="flex items-center">
            <button 
            className="flex items-center text-white px-3 py-2 rounded" 
            style={{ backgroundColor: '#8C383E', border: 'none' }} 
            onClick={ handleAddDepartment}
            
          >
            <FontAwesomeIcon
              icon={faCirclePlus}
              className="mr-2"
              style={{ cursor: 'pointer', color: 'white', fontSize: '1.3rem' }}
              
            />
            <span className="text-sm">Add Department</span>
          </button>
            </div>
          </div>

          <div className="mr-10 ml-4 rounded-lg border border-gray-200" style={{ position: 'relative', height:'423px' }}>
            <div className="overflow-x-auto rounded-t-lg">
              <table className="w-full divide-y-2 divide-gray-200 bg-white text-sm">
                <thead className="text-left" style={{ backgroundColor: '#8C383E' }} >
                  <tr>
                      <th></th>
                      <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-50">Department</th>
                      <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-50">Office Head</th>
                      <th className="whitespace-nowrap px-4 py-3 text-sm text-gray-50">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {displayedUsers.map((user, index) => (
                    <tr
                      key={user.userID}
                      className={`cursor-pointer ${activeRow === user.deptID ? 'bg-gray-200' : ''}`}
                      style={{
                        backgroundColor: activeRow === user.deptID ? '#FFECA1' : 'transparent',
                        transition: 'background-color 0.1s ease', // Optional: Add transition for smoother effect
                      }}
                      onMouseEnter={() => setActiveRow(user.deptID)}
                      onMouseLeave={() => setActiveRow(null)}
                      
                    >
                  <td className="justify-center whitespace-nowrap px-4 py-2 text-gray-700">{index + 1 + (currentPage - 1) * itemsPerPage}</td>

                                        <td className="whitespace-nowrap px-4 py-2 text-gray-700">{user.deptName}</td>
                              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{user.deptOfficeHead}</td>
                              <td className='whitespace-nowrap px-4 py-2 text-gray-700'>
                                      <div className='flex items-center'>
                                        <FontAwesomeIcon
                                          icon={faPenToSquare}
                                          className='mr-2'
                                          style={{ color: '#8C383E', fontSize: '1.3rem', cursor: 'pointer'  }}
                                          onClick={() => handleEditDepartment(user)}
                                        />
                                        <FontAwesomeIcon
                                          icon={faTrash}
                                          className='mr-2'
                                          style={{ color: '#8C383E', fontSize: '1.3rem', cursor: 'pointer'  }}
                                          onClick={(e) => {
                                            e.stopPropagation(); // Prevent row click from triggering
                                            handleDeleteUser(user.deptID);
                                          }}
                                        />
                                      </div>
                              </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="rounded-b-lg mt-2 border-gray-200 px-4 py-2"  style={{ position: 'absolute',display: 'flex', alignItems:'center'}}>
              <ol className="flex justify-end gap-1 text-xs font-medium">
                <li>
                  <a
                    href="#"
                    className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                    onClick={handlePrevPage}
                  >
                    <span className="sr-only">Prev Page</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>

                {Array.from({ length: totalPages }, (_, index) => (
                  <li key={index + 1}>
                    <a
                      href="#"
                      className={`block h-8 w-8 rounded border ${
                        currentPage === index + 1
                          ? "border-pink-900 bg-pink-900 text-white"
                          : "border-gray-100 bg-white text-gray-900"
                      } text-center leading-8`}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </a>
                  </li>
                ))}

                <li>
                  <a
                    href="#"
                    className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 bg-white text-gray-900 rtl:rotate-180"
                    onClick={handleNextPage}
                  >
                    <span className="sr-only">Next Page</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </li>
              </ol>
            </div>
        </div>

      {showConfirmationDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-md w-auto h-44">
            
            <div className="p-2 font-bold text-lg text-white rounded-t-lg" 
            style={{ backgroundColor: '#8C383E', border: 'none' }}>
            <FontAwesomeIcon
          icon={faTrash}
          className="mr-2 ml-2"
          style={{ color: 'white', fontSize: '1rem'}}
        />Delete Department</div>

            <div className="p-4">
            <p className="mt-2 mb-5">Are you sure you want to delete this department?</p>
            <Divider/>
            <div className="mt-4 mb-4 flex justify-end">
              <button
                className="text-white px-3 py-1 w-14 rounded mr-2"
                style={{ backgroundColor: '#8C383E', border: 'none' }}
                onClick={confirmDeleteDepartment}
              >
                Yes
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-3 w-14 py-1 rounded"
                onClick={() => toggleConfirmationDialog()}
              >
                No
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* EditDepartmentModal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center w-[80%] h-[80%]">
          <div className="bg-white rounded-lg shadow-md w-[auto] h-auto" >
            {/* Render the EditDepartmentModal component here */}
            <EditDepartmentModal
              department={editingDepartment}
              onClose={() => setShowEditModal(false)}
              onUpdate={handleUpdateDepartment}
            />
          </div>
        </div>
      )}

        {showAddDepartmentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white rounded-lg shadow-md w-1/3" >
              <div className="p-2 font-bold text-lg text-white rounded-t-lg" style={{ backgroundColor: '#8C383E', border: 'none' }} >
                  <FontAwesomeIcon
              icon={faPlusCircle}
              className="mr-2 ml-2"
              style={{ color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
            />
                Add Department
              </div>
              <div className="p-4">
                <form onSubmit={handleDepartmentFormSubmit}>
                  <div className="mb-4">
                    <label htmlFor="deptName" className="block text-sm font-medium text-gray-700">
                      Department Name
                    </label>
                    <input
                      type="text"
                      id="deptName"
                      name="deptName"
                      value={departmentFormData.deptName}
                      onChange={handleDepartmentFormChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="deptOfficeHead" className="block text-sm font-medium text-gray-700">
                      Department Office Head
                    </label>
                    <select
                      id="deptOfficeHead"
                      name="deptOfficeHead"
                      value={departmentFormData.deptOfficeHead}
                      onChange={handleDepartmentFormChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                      required
                    >
                      <option value="">Select Office Head</option>
                      {officeHeadOptions.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-2 flex justify-end">
                    <button
                      type="submit"
                      className=" text-white px-3 py-1 w-auto rounded mr-2"
                      style={{ backgroundColor: '#8C383E', border: 'none' }} 
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      className="bg-gray-300 text-gray-700 px-3 w-auto py-1 rounded"
                      onClick={() => setShowAddDepartmentModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

    </div>
    </Animated>    

    
  );
};



export default ManageOffices;
