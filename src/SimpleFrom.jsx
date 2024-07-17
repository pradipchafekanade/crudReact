import React, { useEffect, useState } from 'react'
import axios from 'axios';

function SimpleFrom() {
  // const [name ,setName]=useState('')
  // const [lastname ,setLastname]=useState('')
  const [formData, setFormData] = useState({
    name: '',
    lastname: ''
  });
  const [errors, setErrors] = useState({});
  const [posts, setPosts] = useState([])
  const [editId, setEditId] = useState(null);


  // const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     if (name === 'name') {
  //         setName(value);
  //     } else if (name === 'lastname') {
  //         setLastname(value);
  //     }
  // };

  // const handleChange=(e)=>{
  //     setFormData({...formData, [e.target.name]:e.target.value});
  // }

  const validateform = () => {
    const newErrors = {}
    if (formData.name.length < 3) {
      newErrors.name = 'Username must be at least 3 characters';
    }
    else if (formData.lastname.length < 3) {
      newErrors.lastname = 'lastname must be at least 3 characters';

    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0;

  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const submitData = () => {
    if (validateform()) {
      if (editId !== null) {
        console.log("editId",editId);
        axios.put('http://localhost:3000/posts/' + editId, formData).then((res) => {
          setFormData({
            name: '',
            lastname: ''
          })
          setEditId(null)
          console.log(res.data);
        })
      }
      else {
        axios.post('http://localhost:3000/posts', formData).then((res) => {
          setFormData({
            name: '',
            lastname: ''
          })
          loaddata()
          console.log(res);
        }).catch((err) => {
          console.log(err);
        })
      }

    }
  }

  function loaddata() {
    axios.get('http://localhost:3000/posts').then((res) => {
      setPosts(res.data)
    })
  }

  const deletedata = (value) => {
    console.log("value", value);
    axios.delete('http://localhost:3000/posts/' + value).then((res) => {
      loaddata()
      console.log(res);
    })
  }

  const editdata = (item) => {
    console.log("editdata", item);
    setFormData({
      name: item.name,
      lastname: item.lastname
    })
    setEditId(item.id)
  }

  useEffect(() => {
    loaddata()
  }, [])

  return (
    <div className='container mt-5'>
      <div>

        <div className='form-group  mb-5' >
          <label className="form-label">First Name</label>
          <input type="text" id='name' name='name' value={formData.name} className={`form-control me-3 ${errors.name && 'is-invalid'}`} onChange={handleChange} />
          {errors.name && <h6 className='invalid-feedback'>{errors.name}</h6>}

          <label className="form-label">Last Name</label>
          <input type="text" className={`form-control me-3 ${errors.lastname && 'is-invalid'}`} name='lastname' value={formData.lastname} onChange={handleChange} />
          {errors.lastname && <h6 className='invalid-feedback'>{errors.lastname}</h6>}
          <button className='btn btn-primary' type="submit" onClick={submitData}>ADD</button>
        </div>
      </div>

      <table class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">sr No</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {posts.map((item, i) => {
            return (
              <tr key={i}>
                <th>{i + 1}</th>
                <td>{item.name}</td>
                <td>{item.lastname}</td>
                <td>
                  <button className='btn btn-success me-2' onClick={() => editdata(item)}>Edit</button>
                  <button className='btn btn-danger' onClick={() => { deletedata(item.id) }}>Delete</button>
                </td>
              </tr>
            )
          })}


        </tbody>
      </table>

    </div>
  )
}

export default SimpleFrom