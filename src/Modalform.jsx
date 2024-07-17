import React, { useEffect, useState } from 'react'
import axios from 'axios';

function Modalform() {
    const [formData,setFormData]=useState({
        name:'',
        lastname:''
    })
    const [posts,setPosts] =useState([])
    const [editid,setEditid]=useState(null)
    const [error,setError]=useState({})
    // const validateform =()=>{
    //     if(formData.name.trim()=='' || formData.lastname.trim()==''){
    //         alert('please fill all fields')
    //         return false
    //     }
    //     return true
    // }

    const validateform =()=>{
        const newErrors ={}
        if (formData.name.length<3) {
            newErrors.name='Username must be at least 3 characters'
        }
        else if(formData.lastname.length<4){
            newErrors.lastname='lastname must be at least 3 character'
        }
        setError(newErrors)
    console.log("keys",Object.keys(newErrors));
       return Object.keys(newErrors).length===0;
    }

    const handlechange=(e)=>{
        console.log(e.target.value);
    //   const {name,value}=e.target
    //   setFormData({
    //     ...formData,
    //     [name]:value
    //   })
    setFormData({
        ...formData,
        [e.target.name]:e.target.value
    })
    }

    const handlesubmit=()=>{
        console.log(formData)

        if (validateform()) {

        if (editid !== null) {
            console.log("editid",editid);
            axios.put('http://localhost:3000/posts/' + editid, formData).then((res) => {
              setFormData({
                name: '',
                lastname: ''
              })
              setEditid(null)
              loaddata()
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
        else{
            console.log('not run api');
        }
    }

    const loaddata=()=>{
        axios.get("http://localhost:3000/posts").then((res)=>{
            setPosts(res.data)
        })
    }
    const handleedit=(item)=>{
            setFormData({
                name:item.name,
                lastname:item.lastname
            })
            setEditid(item.id)
    }

    const handledelete =(id)=>{
        axios.delete('http://localhost:3000/posts/'+id).then((res)=>{
            loaddata()
        }).catch((err)=>{
            console.log(err);
        })
    }

    useEffect(()=>{
        loaddata()
    },[])

    return (
        <div className='container mt-5'>
            <div className='justify-content-end mb-5'>
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal ">
                    ADD
                </button>
            </div>

            {/* <!-- Modal --> */}
            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body ">
                            <input type="text" className={`form-control mb-4 ${error.name && 'is-invalid'}`} name='name' value={formData.name} onChange={handlechange} />
                            {error.name && <div className='invalid-feedback'>{error.name}</div> }
                            <input type="text" className={`form-control ${error.lastname && 'is-invalid'}`} name='lastname' value={formData.lastname} onChange={handlechange} />
                            {error.lastname && <div>{error.lastname}</div> }
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handlesubmit}>Save changes</button>
                        </div>
                    </div>
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
            {posts.map((item,i)=>{
                return(
                    <tr key={i}>
                    <td>{i+1}</td>
                    <td>{item.name}</td>
                    <td>{item.lastname}</td>
                       <td>
                         <button className='btn btn-success me-2' onClick={()=>{handleedit(item)}} data-bs-toggle="modal" data-bs-target="#exampleModal " >Edit</button>
                         <button className='btn btn-danger' onClick={()=>{handledelete(item.id)}} >Delete</button>
                       </td>
                     </tr>
                )
            })}

        </tbody>
      </table>

        </div>
    )
}

export default Modalform