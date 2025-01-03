import React, { useEffect, useRef, useState } from 'react';
import styles from '../../assets/ShareModal.module.css';
import axios from 'axios'; // Add axios import
import useAuth from '../../hooks/useAuth';

export default function ShareModal({ onClose }) {
  const token = useAuth();
  const modalRef = useRef(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Edit');
  const [inputValue, setInputValue] = useState(''); // State for input value

  useEffect(() => {
    // Function to handle click outside the modal
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close modal if click is outside
      }
    };

    // Attach event listener for click outside
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleSelectOption = (option) => {
    setSelectedOption(option);
    setDropdownOpen(false); // Close dropdown after selection
  };

  const handleSubmit = async () => {
    try {
      console.log("Inviting with email:", inputValue);
  
      if (!inputValue) {
        throw new Error("Email is required");
      }
  
      const { data: result } = await axios.post(
        'https://formbot-server-4-1ckc.onrender.com/user/return',
        { email: inputValue },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const userId = result.data.id;
      console.log("Fetched user ID:", userId);
  
      const response = await axios.put(
        'https://formbot-server-4-1ckc.onrender.com/folder/update',
        { invitedUser: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Folder update response:", response.data);
  
      // Show success alert after the invite is sent
      alert("Invite sent successfully!");
  
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Failed to submit invite. Check console for details.");
    }
  };
  
  
  
  return (
    <div className={styles.mainDiv}>
      <div className={styles.innerDiv} ref={modalRef}>
        <div className={styles.buttonDiv}>
          <button className={styles.closeBtn} onClick={onClose}>X</button>
        </div>
        <div className={styles.container}>
          <div>
            <h1>Invite by Email</h1>
          </div>
          <div className={styles.dropdown}>
            <div className={styles.dropGrp}>
              <button
                className={styles.dropdownBtn}
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                {selectedOption}
              </button>
              <button className={styles.dropdownBtn} onClick={() => setDropdownOpen(!isDropdownOpen)}>
                &#11206;
              </button>
            </div>
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <button
                  className={styles.dropdownBtn1}
                  onClick={() => handleSelectOption('Edit')}
                >
                  Edit
                </button>
                <button
                  className={styles.dropdownBtn}
                  onClick={() => handleSelectOption('View')}
                >
                  View
                </button>
              </div>
            )}
          </div>
        </div>
        <div className={styles.inputBox}>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="Enter email id"
          />
          <button onClick={handleSubmit}>Send Invite</button>
        </div>
        <div className={styles.link}>
          <h1>Invite by Link</h1>
          <button>Copy Link</button>
        </div>
      </div>
    </div>
  );
} 