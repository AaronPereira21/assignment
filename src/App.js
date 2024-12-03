import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [formType, setFormType] = useState('');
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [submittedData, setSubmittedData] = useState([]);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleFormTypeChange = (e) => {
    setFormType(e.target.value);
  };

  useEffect(() => {
    if (formType) {
      // Simulate API response based on form type
      const fetchFormFields = async () => {
        try {
          let response;
          if (formType === 'User Information') {
            response = {
              fields: [
                { name: 'firstName', type: 'text', label: 'First Name', required: true },
                { name: 'lastName', type: 'text', label: 'Last Name', required: true },
                { name: 'age', type: 'number', label: 'Age', required: false },
              ],
            };
          } else if (formType === 'Address Information') {
            response = {
              fields: [
                { name: 'street', type: 'text', label: 'Street', required: true },
                { name: 'city', type: 'text', label: 'City', required: true },
                { name: 'state', type: 'dropdown', label: 'State', options: ['Maharashtra', 'Karnataka', 'Telangana','Tamil Nadu'], required: true },
                { name: 'pinCode', type: 'text', label: 'Pin Code', required: false },
              ],
            };
          } else if (formType === 'Payment Information') {
            response = {
              fields: [
                { name: 'cardNumber', type: 'text', label: 'Card Number', required: true },
                { name: 'expiryDate', type: 'date', label: 'Expiry Date', required: true },
                { name: 'cvv', type: 'password', label: 'CVV', required: true },
                { name: 'cardholderName', type: 'text', label: 'Cardholder Name', required: true },
              ],
            };
          }

          setFormFields(response.fields);
          setFormData({});
          setProgress(0);
          setErrorMessage('');
          setSuccessMessage('');
        } catch (error) {
          setErrorMessage('Failed to load form fields. Please try again.');
        }
      };

      fetchFormFields();
    }
  }, [formType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      calculateProgress(newFormData);
      return newFormData;
    });
  };

  const calculateProgress = (data) => {
    const totalFields = formFields.length;
    const filledFields = formFields.filter((field) => field.required && data[field.name]).length;
    setProgress((filledFields / totalFields) * 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    const missingFields = formFields.filter((field) => field.required && !formData[field.name]);
    if (missingFields.length > 0) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setSubmittedData((prev) => [...prev, formData]);
    setSuccessMessage('Form submitted successfully!');
    setFormData({});
    setProgress(0);
  };

  const handleDelete = (index) => {
    setSubmittedData((prev) => prev.filter((_, i) => i !== index));
    setSuccessMessage('Entry deleted successfully.');
  };

  const handleEdit = (index) => {
    setFormData(submittedData[index]);
    setSubmittedData((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>Dynamic Form Application</h1>
      </header>

      <div className="form-container">
        <select onChange={handleFormTypeChange} value={formType}>
          <option value="">Select Form Type</option>
          <option value="User Information">User Information</option>
          <option value="Address Information">Address Information</option>
          <option value="Payment Information">Payment Information</option>
        </select>

        {formType && (
          <form onSubmit={handleSubmit}>
            {formFields.map((field) => (
              <div key={field.name} className="form-group">
                <label>{field.label}</label>
                {field.type === 'dropdown' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleInputChange}
                    required={field.required}
                  />
                )}
                {field.required && !formData[field.name] && (
                  <span className="error">This field is required</span>
                )}
              </div>
            ))}

            <button type="submit">Submit</button>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
          </form>
        )}

        <div className="progress-container">
          <progress value={progress} max={100}></progress>
        </div>
      </div>

      {submittedData.length > 0 && (
        <div className="submitted-data">
          <h2>Submitted Data</h2>
          <table>
            <thead>
              <tr>
                <th>Form Data</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {submittedData.map((data, index) => (
                <tr key={index}>
                  <td>
                    {Object.entries(data)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ')}
                  </td>
                  <td>
                    <button onClick={() => handleEdit(index)}>Edit</button>
                    <button onClick={() => handleDelete(index)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <footer className="footer">
        <p>Dynamic Form Application - 2024</p>
      </footer>
    </div>
  );
}

export default App;
