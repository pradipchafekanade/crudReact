import React, { useEffect, useState } from 'react';
import FormModule from './FormModule';
import axios from 'axios';

function ExportModel() {
const [posts,setPosts]=useState([])
const [editingPost, setEditingPost] = useState(null);
const [isEditing, setIsEditing] = useState(false);

const loaddata=()=>{
  axios.get('http://localhost:3000/posts').then((res)=>{
    console.log(res.data);
    setPosts(res.data)
  }).catch((err)=>{
    console.log(err);
  })
}

const handledelete=(id)=>{
  axios.delete('http://localhost:3000/posts/'+id).then((re)=>{
    console.log(re.data);
    loaddata()
  }).catch((err)=>{
    console.log(err);
  })
}

const handleedit = (item) => {
  console.log("edit", item);
  setEditingPost(item);
  setIsEditing(true);
};

useEffect(()=>{
  loaddata()
},[])

  return (
    <div>
      <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
        ADD
      </button>

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

    {/* <FormModule/> */}
    <FormModule editingPost={editingPost} isEditing={isEditing} setIsEditing={setIsEditing} loaddata={loaddata} />


    </div>
  );
}

export default ExportModel;
