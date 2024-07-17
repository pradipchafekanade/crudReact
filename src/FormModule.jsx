import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

function FormModule({ editingPost, isEditing, setIsEditing, loaddata }) {
  const [formData, setFormData] = useState({
    name: '',
    lastname: ''
  });
  const [errors, setErrors] = useState({});
  const modalRef = useRef(null);
  // Reset form data when editingPost or isEditing changes
  useEffect(() => {
    if (isEditing && editingPost) {
      setFormData({
        name: editingPost.name,
        lastname: editingPost.lastname
      });
    } else {
      setFormData({
        name: '',
        lastname: ''
      });
    }
  }, [editingPost, isEditing]);

  const handlechange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateform = () => {
    let newErrors = {};
    if (formData.name.trim() === '') {
      newErrors.name = 'Name is required';
    }
    if (formData.lastname.trim() === '') {
      newErrors.lastname = 'Lastname is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlesubmit = () => {
    if (validateform()) {
      if (isEditing && editingPost) {
        axios.put(`http://localhost:3000/posts/${editingPost.id}`, formData)
          .then((res) => {
            console.log(res);
            setFormData({
              name: '',
              lastname: ''
            });
            loaddata();
            // Close modal after successful submission
            if (modalRef.current) {
                const modal = bootstrap.Modal.getInstance(modalRef.current);
                modal.hide()
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        axios.post('http://localhost:3000/posts', formData)
          .then((res) => {
            console.log(res);
            setFormData({
              name: '',
              lastname: ''
            });
            loaddata();
            if (modalRef.current) {
                const modal = bootstrap.Modal.getInstance(modalRef.current);
                modal.hide()
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
    // Do not close the modal here, let Bootstrap handle modal closing with data-bs-dismiss
  };

  return (
    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalRef}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <input type="text" className={`form-control mb-4 ${errors.name && 'is-invalid'}`} name='name' value={formData.name} onChange={handlechange} />
            {errors.name && <div className='invalid-feedback'>{errors.name}</div>}
            <input type="text" className={`form-control ${errors.lastname && 'is-invalid'}`} name='lastname' value={formData.lastname} onChange={handlechange} />
            {errors.lastname && <div className='invalid-feedback'>{errors.lastname}</div>}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" onClick={handlesubmit}>Save changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormModule;
