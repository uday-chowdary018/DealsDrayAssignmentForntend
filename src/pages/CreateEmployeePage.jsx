
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CreateEmployeePage = ({ onSubmit }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { employee = {}, mode = 'create' } = location.state || {};
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('HR');
  const [gender, setGender] = useState('Male');
  const [courses, setCourses] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (mode === 'edit' && employee) {
      setName(employee.name || '');
      setEmail(employee.email || '');
      setPhone(employee.phone || '');
      setDesignation(employee.designation || 'HR');
      setGender(employee.gender || 'Male');
      setCourses(employee.courses || []);
      setImage(null); 
    }
  }, [employee, mode]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size exceeds 10MB');
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      alert('Only JPEG and PNG images are allowed');
      return;
    }
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (!name || !email || !phone) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    if (isNaN(phone)) {
      alert('Please enter a valid phone number.');
      return;
    }
    if (!image && mode === 'create') {
      alert('Please upload an image.');
      return;
    }
   
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('designation', designation);
    formData.append('gender', gender);
    formData.append('courses', JSON.stringify(courses)); // Converting array to JSON string
    if (image) formData.append('image', image); 

    try {
      
      const url = employee && employee.id
        ? `http://localhost:8080/api/employees/${employee.id}`
        : 'http://localhost:8080/api/employees';

      const response = await fetch(url, {
        method: mode === 'edit' ? 'PUT' : 'POST',
        body: formData,
      });

      // if (!response.ok) {
      //   throw new Error('Failed to submit form');
      // }

      if (!response.ok) {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'An error occurred'}`);
        return;
      }
      alert('Employee saved successfully!');
      if (onSubmit) onSubmit(); 
      
      // Redirect to EmployeeListPage
      navigate('/employee-list');
    } catch (error) {
      console.error(error);
      alert('An error occurred while saving the employee.');
    }
  };

  return (
    <div>
       <span className='heading'>{mode === 'edit' ? 'Edit Employee' : 'Create Employee'}</span>
      <main className='createEmp-container'>
       
        <form className="from-container" onSubmit={handleSubmit}>
       <div><label>Name:</label> <input
            type="text"
            placeholder= "Enter Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          </div>  
          <div><label>Email:</label> <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />   </div> 
          <div><label>Mobile No:</label>  <input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />   </div> 
         <div><label>Designation:</label>  <select
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          >
            <option value="HR">HR</option>
            <option value="Manager">Manager</option>
            <option value="Sales">Sales</option>
          </select>
          </div>
          <div className='radio-checkbox'>
        <label>Gender:</label>
        
            <label>
              <input
                type="radio"
                value="Male"
                checked={gender === 'Male'}
                onChange={() => setGender('Male')}
              /> Male
            </label>
            <label>
              <input
                type="radio"
                value="Female"
                checked={gender === 'Female'}
                onChange={() => setGender('Female')}
              /> Female
            </label>
            </div>
          
          <div className='radio-checkbox'>
            <label>Courses:</label>
            <label>
              <input
                type="checkbox"
                value="MCA"
                checked={courses.includes('MCA')}
                onChange={(e) => setCourses(prev => 
                  e.target.checked ? [...prev, 'MCA'] : prev.filter(c => c !== 'MCA')
                )}
              /> MCA
            </label>
            <label>
              <input
                type="checkbox"
                value="BCA"
                checked={courses.includes('BCA')}
                onChange={(e) => setCourses(prev => 
                  e.target.checked ? [...prev, 'BCA'] : prev.filter(c => c !== 'BCA')
                )}
              /> BCA
            </label>
            <label>
              <input
                type="checkbox"
                value="BSC"
                checked={courses.includes('BSC')}
                onChange={(e) => setCourses(prev => 
                  e.target.checked ? [...prev, 'BSC'] : prev.filter(c => c !== 'BSC')
                )}
              /> BSC
            </label>
          </div>
          <label>
          <input
            type="file"
            onChange={handleFileChange}
            required={mode === 'create'} 
          />
          </label>
          <button className="submit" type="submit">
            {mode === 'edit' ? 'Update' : 'Submit'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default CreateEmployeePage;
