
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EmployeeListPage = ({ onLogout, employeeName }) => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5); // Set default page size to 5
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');
  const [status, setStatus] = useState('active');
  const [employeeCount, setEmployeeCount] = useState(0);
  const navigate = useNavigate();

  // Fetching employees from the backend
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/employees/paged?search=${search}&page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&sortOrder=${sortOrder}&status=${status}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const employeesWithParsedCourses = data.content.map(employee => ({
          ...employee,
          course: Array.isArray(employee.course) ? employee.course : JSON.parse(employee.course || '[]')
        }));
        setEmployees(employeesWithParsedCourses);
        setEmployeeCount(data.totalElements); 
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      }
    };
  
    fetchEmployees();
  }, [search, currentPage, pageSize, sortBy, sortOrder, status]);
  
 
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/employees/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setEmployees(employees.filter(e => e.id !== id));
      setEmployeeCount(employeeCount - 1);
    } catch (error) {
      console.error('Failed to delete employee:', error);
    }
  };

 
  const handleEdit = (employee) => {
    navigate('/create-employee', {
      state: { 
        employee, 
        mode: 'edit'
      }
    });
  };

  const handleCreate = () => {
    navigate('/create-employee', {
      state: { 
        mode: 'Add'
      }
    });
  };

  const handleSort = (field) => {
    setSortBy(field);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Toggle sorting order
  };


  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

 
  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setCurrentPage(0); 
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value, 6));
    setCurrentPage(0); 
  };


  const filteredEmployees = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <span className='heading'>Employee List</span>
      <div className='table-container'>
        <div className='search-container'>
          <button className='create-button' onClick={handleCreate}>Create Employee</button>
          <select className='pagesize' onChange={handleStatusChange} value={status}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <select className='pagesize' onChange={handlePageSizeChange} value={pageSize}>
            <option value={5}>5</option>
            <option value={6}>6</option> 
            <option value={10}>10</option>
          </select>

          <div className='employee-count'>
            <span>Total Count: {employeeCount}</span>
          </div>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <table>
          <thead className='table-heading'>
            <tr>
              <th onClick={() => handleSort('id')}>ID</th>
              <th>Image</th>
              <th onClick={() => handleSort('name')}>Name</th>
              <th onClick={() => handleSort('email')}>Email</th>
              <th onClick={() => handleSort('phone')}>Phone</th>
              <th onClick={() => handleSort('designation')}>Designation</th>
              <th onClick={() => handleSort('gender')}>Gender</th>
              <th onClick={() => handleSort('courses')}>Courses</th>
              <th onClick={() => handleSort('createdate')}>Create Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map(employee => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>
                  {employee.image ? (
                    <img
                      src={`data:image/jpeg;base64,${employee.image}`}
                      alt={employee.name}
                      style={{ width: '100px', height: '100px' }}
                    />
                  ) : (
                    'No Image'
                  )}
                </td>
                <td>{employee.name}</td>
                <td className='email'>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.designation}</td>
                <td>{employee.gender}</td>
                <td>
                  {Array.isArray(employee.course) ? employee.course.join(', ') : employee.course}
                </td>
                <td>{employee.createdate}</td>
                <td>
                  <button className='edit-button' onClick={() => handleEdit(employee)}>Edit</button>
                  <button className='delete-button' onClick={() => handleDelete(employee.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='pagination'>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>Previous</button>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={(currentPage + 1) * pageSize >= employeeCount}>Next</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeListPage;

