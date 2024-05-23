import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCirclePlus,faTrash,faSearch,faPenToSquare,faPlusCircle,} from "@fortawesome/free-solid-svg-icons";
import { Alert, Dialog, Divider, FormControl, Select, MenuItem,Snackbar} from "@mui/material";
import axios from "axios";
import Animated from "../components/motion";

const ManageOffices = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeRow, setActiveRow] = useState(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showAddDepartmentModal, setShowAddDepartmentModal] = useState(false);
  const [departmentFormData, setDepartmentFormData] = useState({deptName: "", deptOfficeHead: ""});
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [snackbar, setSnackbar] = useState({open: false, message: "", severity: "info", });
  const showSnackbar = (message, severity) => {setSnackbar({open: true,message: message,severity: severity,});};
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [departmentOfficeHead, setDepartmentOfficeHead] = useState([]);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedDepartments = filteredDepartments.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const [allUsers, setAllUsers] = useState([]);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedDepartmentDetails, setSelectedDepartmentDetails] = useState({
    deptName: '',
    officeHead: '',
    secretary: '',
    staff: []
  });

  //fetch all users 
  useEffect(() => {
    const fetchData = async () => {
        try {
            const userResponse = await axios.get("http://localhost:8080/user/getAllUser");
            const deptResponse = await axios.get("http://localhost:8080/department/getAllDepts");

            const fetchedUsers = userResponse.data;
            const fetchedDepts = deptResponse.data;

            // Assign office heads to their departments
            const updatedDepts = fetchedDepts.map(dept => {
                const officeHead = fetchedUsers.find(user => (user.position === "Office Head" || user.position === "Department Head") && user.dept === dept.deptName);
                return {
                    ...dept,
                    deptOfficeHead: officeHead ? `${officeHead.fName} ${officeHead.mName ? officeHead.mName.charAt(0) + '.' : ''} ${officeHead.lName}` : ''
                };
            });

            setDepartments(updatedDepts);
            setFilteredDepartments(updatedDepts); 
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    fetchData();
}, []); 

  //fetch all users with "office head" position
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/user/getAllUser");
        setAllUsers(response.data);
        const officeHeads = response.data.filter(user => user.position === "Office Head" || user.position === "Department Head" || user.position === "Head")
          .map(user => ({
            id: user.id,
            name: `${user.fName} ${user.mName ? user.mName.charAt(0) + '.' : ''} ${user.lName}`
          }));
        setDepartmentOfficeHead(officeHeads);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers();
  }, []);
  

  //fetch all departments
  useEffect(() => {
    const fetchDepartments= async () => {
      try {
        const response = await axios.get("http://localhost:8080/department/getAllDepts");
        setDepartments(response.data);
        setFilteredDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    fetchDepartments();
  }, []);
  // delete department
  const toggleConfirmationDialog = (deptId = null) => {
    setDepartmentToDelete(deptId);
    setShowConfirmationDialog(!showConfirmationDialog);

  };

  const confirmDeleteDepartment = async () => {
    try {
      await axios.delete(`http://localhost:8080/department/deleteDept/${departmentToDelete}`);
      const updatedUsers = await axios.get("http://localhost:8080/department/getAllDepts");
      setDepartments(updatedUsers.data);
      setFilteredDepartments(updatedUsers.data);
      showSnackbar("Department added successfully", "success");
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
  
  const handleDeleteUser = (deptId) => {
    toggleConfirmationDialog(deptId);
  };

  //View Department Details
  const handleRowDoubleClick = (department) => {
    const usersInDepartment = allUsers.filter(user => user.dept === department.deptName);

    const secretary = usersInDepartment.find(user => user.position === 'Secretary' || user.position === 'secretary');
    const staffMembers = usersInDepartment.filter(user => user.role === 'EMPLOYEE' && user.userID !== secretary?.userID);

    setSelectedDepartmentDetails({
      deptName: department.deptName || 'N/A',
      officeHead: department.deptOfficeHead ||  'N/A',
      secretary: secretary ? `${secretary.fName} ${secretary.mName ? secretary.mName.charAt(0) + '.' : ''} ${secretary.lName}` : 'N/A',
      staff: staffMembers.map(staff => ({
        id: staff.userID,
        name: `${staff.fName} ${staff.mName ? staff.mName.charAt(0) + '.' : ''} ${staff.lName}`,
        status: staff.empStatus
      }))
    });

    setShowDetailsDialog(true);
  };

  //Add Department
  const handleDepartmentFormSubmit = async (e) => {
    e.preventDefault();
    const existingDept = departments.find(dept => dept.deptName.toLowerCase() === departmentFormData.deptName.toLowerCase());
    if (existingDept) {
      showSnackbar("Department already exists", "warning");
        return;  // Prevent the form submission
    }
    try {
      await axios.post("http://localhost:8080/department/addDept", departmentFormData);

      const updatedDepartments = await axios.get("http://localhost:8080/department/getAllDepts");
      setDepartments(updatedDepartments.data);
      setFilteredDepartments(updatedDepartments.data);
      showSnackbar("Department added successfully", "success");
      setShowAddDepartmentModal(false);
      setDepartmentFormData({
        deptName: "",
        deptOfficeHead: "",
      });
    } catch (error) {
      showSnackbar("Failed to add department due to an error", "error");
      console.error("Error adding department:", error);
    }
  };
  const totalDepartments = departments.length;


  const handleSearch = () => {
    const searchTermLowerCase = searchTerm.toLowerCase();
    const filtered = departments.filter(dept =>
        dept.deptName.toLowerCase().includes(searchTermLowerCase) ||
        (dept.deptOfficeHead && dept.deptOfficeHead.toLowerCase().includes(searchTermLowerCase))
    );
    setDepartments(filtered);
};
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
  //Update Department
  const handleUpdateDepartment = async (editedDepartment) => {
    try {
      await axios.put(`http://localhost:8080/department/updateDept?deptID=${editedDepartment.deptID}`, editedDepartment);
      const updatedUsers = await axios.get("http://localhost:8080/department/getAllDepts");
      setDepartments(updatedUsers.data);
      setFilteredDepartments(updatedUsers.data);
      setShowEditModal(false);
      showSnackbar("Department updated successfully", "success");
    } catch (error) {
      console.error("Error updating department:", error);
      showSnackbar("Failed to update department due to an error", "error");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white rounded-lg shadow-md w-2/4">
        <div
          className="p-2 font-bold text-lg text-white rounded-t-lg"
          style={{ backgroundColor: '#8C383E', border: 'none' }}
        >
          <FontAwesomeIcon
            icon={faPenToSquare}
            className="mr-2 ml-2"
            style={{ color: 'white', fontSize: '1.2rem', cursor: 'pointer' }}
          />
          Edit Department
        </div>
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
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

         {/* <div className="mt-4">
          <FormControl fullWidth className="mb-4">
          <label htmlFor="deptOfficeHead" className="mb-2 block text-sm font-medium text-gray-700">
              Department Office Head
            </label>
            <Select
            id="deptOfficeHead"
            name="deptOfficeHead"
            value={editedDepartment.deptOfficeHead}
            onChange={handleInputChange}
            className="h-12"
            displayEmpty
          >
            <MenuItem value="" disabled>
              <em className="text-gray-700">Select an Office Head</em>
            </MenuItem>
            {departmentOfficeHead.map((head) => (
              <MenuItem key={head.id} value={head.name}>
                {head.name}
              </MenuItem>
            ))}
          </Select>
          </FormControl> 
          </div>*/}
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
      <h1 className="text-3xl font-bold text-left ml-12 mt-8 mb-2">Department</h1>
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
                  {displayedDepartments.map((dept, index) => (
                    <tr
                      key={dept.deptID} onDoubleClick={() => handleRowDoubleClick(dept)}
                      className={`cursor-pointer ${activeRow === dept.deptID ? 'bg-gray-200' : ''} no-select`}
                      style={{
                        backgroundColor: activeRow === dept.deptID ? '#FFECA1' : 'transparent',
                        transition: 'background-color 0.1s ease', // Optional: Add transition for smoother effect
                      }}
                      onMouseEnter={() => setActiveRow(dept.deptID)}
                      onMouseLeave={() => setActiveRow(null)}
                    >
                  <td className="justify-center whitespace-nowrap px-4 py-2 text-gray-700">{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{dept.deptName}</td>
                              <td className="whitespace-nowrap px-4 py-2 text-gray-700">{dept.deptOfficeHead}</td>
                              <td className='whitespace-nowrap px-4 py-2 text-gray-700'>
                                      <div className='flex items-center'>
                                        <FontAwesomeIcon
                                          icon={faPenToSquare}
                                          className='mr-2'
                                          style={{ color: '#8C383E', fontSize: '1.3rem', cursor: 'pointer'  }}
                                          onClick={() => handleEditDepartment(dept)}
                                        />
                                        <FontAwesomeIcon
                                          icon={faTrash}
                                          className='mr-2'
                                          style={{ color: '#8C383E', fontSize: '1.3rem', cursor: 'pointer'  }}
                                          onClick={(e) => {
                                            e.stopPropagation(); // Prevent row click from triggering
                                            handleDeleteUser(dept.deptID);
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
      {/* DeleteDepartmentModal */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md w-auto h-auto">
            <EditDepartmentModal
              department={editingDepartment}
              onClose={() => setShowEditModal(false)}
              onUpdate={handleUpdateDepartment}
            />
          </div>
        </div>
      )}
      {/* AddDepartmentModal */}
      {showAddDepartmentModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-white rounded-lg shadow-md w-1/3">
      <div className="p-2 font-bold text-lg text-white rounded-t-lg" style={{ backgroundColor: '#8C383E', border: 'none' }}>
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
          <FormControl fullWidth className="mb-4">
          <label htmlFor="deptOfficeHead" className="mb-2 block text-sm font-medium text-gray-700">
              Department Office Head
            </label>
            <Select
            id="deptOfficeHead"
            name="deptOfficeHead"
            value={departmentFormData.deptOfficeHead}
            onChange={handleDepartmentFormChange}
            className="h-12"
            displayEmpty
          >
            <MenuItem value="" disabled>
              <em className="text-gray-700">Select an Office Head</em>
            </MenuItem>
            {departmentOfficeHead.map((head) => (
              <MenuItem key={head.id} value={head.name}>
                {head.name}
              </MenuItem>
            ))}
          </Select>
          </FormControl>
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              className="text-white px-3 py-1 w-auto rounded mr-2"
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

  {/* Department Details Dialog */}
  {showDetailsDialog && (
  <Dialog
    open={showDetailsDialog}
    onClose={() => setShowDetailsDialog(false)}
    aria-labelledby="department-details-dialog-title"
    sx={{
      '& .MuiDialog-paper': {
        width: '66.666667%', 
        maxWidth: 's' 
      }
    }}
    PaperProps={{
      style: {
        borderRadius: 14, 
      },
    }}
  >
      <div className="p-4 h-12" style={{ backgroundColor: '#8C383E', border: 'none' }}>
      </div>
      <div className="ml-2 mr-2 p-2"> 
        <h3 className="text-lg font-semibold mt-2 mb-4">{selectedDepartmentDetails.deptName}</h3>
        <Divider/>
      </div>
      <div className="-mt-2 p-4">
        <p><strong>Office Head:</strong> {selectedDepartmentDetails.officeHead}</p>
        <p><strong>Secretary:</strong> {selectedDepartmentDetails.secretary}</p>
        <div className="mt-4">
          <strong>Office Staff:</strong>
          <ul>
            {selectedDepartmentDetails.staff.map((staffMember) => (
              <li key={staffMember.id} className="flex items-center" style={{ gap: '10px' }}>
                <span className="ml-28 flex-1">{staffMember.name}</span>
                <span className="ml-14 flex-1 text-left" style={{ color: staffMember.status === 'Regular' ? 'green' : 'red' }}>
                {staffMember.status}
              </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
  </Dialog>
)}
      {/* Snackbar */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({...snackbar, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
        <Alert variant= "filled"  elevation={6} severity={snackbar.severity} sx={{ width: '100%' }} style={{ fontFamily: "Poppins" }}>
            {snackbar.message}
        </Alert>
    </Snackbar>
      </div>
    </Animated>
  );
};
export default ManageOffices;
