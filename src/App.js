import React, { useState, useEffect } from "react";
import './App.css';

const App = () => {
  const [formType, setFormType] = useState("");
  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState({});
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [submittedData, setSubmittedData] = useState(null); // To store submitted data

  // Hardcoded API responses for different form types
  const apiResponses = {
    "User Information": {
      fields: [
        { name: "firstName", type: "text", label: "First Name", required: true },
        { name: "lastName", type: "text", label: "Last Name", required: true },
        { name: "age", type: "number", label: "Age", required: false }
      ]
    },
    "Address Information": {
      fields: [
        { name: "street", type: "text", label: "Street", required: true },
        { name: "city", type: "text", label: "City", required: true },
        { name: "state", type: "dropdown", label: "State", options: ["Maharashtra", "Karnataka", "Tamil Nadu","Delhi","Haryana","Kerala","Telangana"], required: true },
        { name: "PinCode", type: "text", label: "Pin Code", required: false }
      ]
    },
    "Payment Information": {
      fields: [
        { name: "cardNumber", type: "text", label: "Card Number", required: true },
        { name: "expiryDate", type: "date", label: "Expiry Date", required: true },
        { name: "cvv", type: "password", label: "CVV", required: true },
        { name: "cardholderName", type: "text", label: "Cardholder Name", required: true }
      ]
    }
  };

  useEffect(() => {
    if (formType) {
      setFormFields(apiResponses[formType].fields);
    }
  }, [formType]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    let formValid = true;
    let formError = "";

    // Validate required fields
    formFields.forEach((field) => {
      if (field.required && !formData[field.name]) {
        formValid = false;
        formError = `Please fill out the ${field.label}`;
      }
    });

    if (formValid) {
      setSubmittedData(formData); // Store the submitted data
      setProgress(100);
      setFormData({});
    } else {
      setError(formError);
    }
  };

  // Handle form type change
  const handleFormTypeChange = (e) => {
    setFormType(e.target.value);
    setFormData({});
    setError("");
    setProgress(0);
    setSubmittedData(null); // Reset submitted data when form type is changed
  };

  // Calculate progress
  useEffect(() => {
    const filledFields = Object.values(formData).filter((value) => value !== "");
    setProgress((filledFields.length / formFields.length) * 100);
  }, [formData, formFields]);

  return (
    <div>
      <nav>
        <h1>Assignment Form</h1>
      </nav>

      <main>
        <h2>Fill Out the Form</h2>

        <div className="form-selector">
          <label htmlFor="formType">Select Form Type:</label>
          <select id="formType" value={formType} onChange={handleFormTypeChange}>
            <option value="">Select...</option>
            <option value="User Information">User Information</option>
            <option value="Address Information">Address Information</option>
            <option value="Payment Information">Payment Information</option>
          </select>
        </div>

        {formType && (
          <form onSubmit={handleSubmit}>
            {formFields.map((field) => (
              <div className="form-field" key={field.name}>
                <label>{field.label}</label>
                {field.type === "dropdown" ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ""}
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
                    value={formData[field.name] || ""}
                    onChange={handleInputChange}
                  />
                )}
                {error && error.includes(field.label) && <div className="error">{error}</div>}
              </div>
            ))}

            <button type="submit">Submit</button>
          </form>
        )}

        {formType && (
          <div className="progress-bar">
            <progress value={progress} max="100"></progress>
            <p>{Math.round(progress)}% Completed</p>
          </div>
        )}

        {submittedData && (
          <div className="submitted-data">
            <h3>Submitted Information</h3>
            <pre>{JSON.stringify(submittedData, null, 2)}</pre>
          </div>
        )}
      </main>

      <footer>
        <p>&copy; 2024 Dynamic Form. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
