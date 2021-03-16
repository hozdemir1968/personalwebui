import React, {useState, useEffect} from 'react'
import { Jumbotron } from 'react-bootstrap';
import axios from 'axios';

import Employee from './Employee';

export default function EmployeeList() {

    const [employeeList, setEmployeeList]= useState([])
    const [recordForEdit, setRecordForEdit]= useState(null)

    useEffect(() => {
        refreshEmployeeList();
    }, [])

    const employeeAPI = (url='https://localhost:5001/api/Employee/') => {
        return {
            fetchAll: () => axios.get(url),
            create: newRecord => axios.post(url, newRecord),
            update: (id, updatedRecord) => axios.put(url+id,updatedRecord),
            delete: id => axios.delete(url+id)
        }
    }
    
    function refreshEmployeeList() {
        employeeAPI().fetchAll()
        .then(response=> {
            setEmployeeList(response.data)
        })
        .catch(error => alert(error, 'error'))
    }

    const addOrEdit = (formData, onSuccess) => {
        if (formData.get('employeeId')==="0")
            employeeAPI().create(formData)
            .then(response => {
                onSuccess();
                refreshEmployeeList();
            })
            .catch(error => alert(error, 'error'))
        else
            employeeAPI().update(formData.get('employeeId'),formData)
            .then(response => {
                onSuccess();
                refreshEmployeeList();
            })
            .catch(error => alert(error, 'error'))
    }

    const showRecordDetails = data => {
        setRecordForEdit(data)
    }

    const onDelete = (e,id) => {
        e.stopPropagation(); 
        if (window.confirm('Are You Sure!'))
            employeeAPI().delete(id)
                .then(response => refreshEmployeeList())
                .catch(error => alert(error, 'error'))
    }

    const imageCard = data => (
        <div className="card" onClick={()=>{showRecordDetails(data)}}>
            <img src={data.imageSrc} className="card-img-top rounded-circle" alt="Blank!!" />
            <div className="card-body">
                <h5>{data.employeeName}</h5>
                <span>{data.occupation}</span>
                <br />
                <button className="btn btn-light delete-button"
                    onClick={e => onDelete(e,parseInt(data.employeeId))} >
                    <i className="far fa-trash-alt"></i>
                </button>
            </div>
        </div>
    )

    return (
        <div className="row">
            <div className="col-md-12">
                <Jumbotron fluid>
                    <div className="container text-center">
                        <h1 className="displaye-4">EMPLOYEE APP</h1>
                    </div>
                </Jumbotron>
            </div>
            <div className="col-md-4">
                <Employee
                    addOrEdit={addOrEdit}
                    recordForEdit={recordForEdit} />
            </div>
            <div className="col-md-8">
                <table>
                    <tbody>
                        {
                            [...Array(Math.ceil(employeeList.length/3))].map((e,i)=>
                            <tr key={i}>
                                <td>{imageCard(employeeList[3*i])}</td>
                                <td>{employeeList[3*i+1] ? imageCard(employeeList[3*i+1]): null}</td>
                                <td>{employeeList[3*i+2] ? imageCard(employeeList[3*i+2]): null}</td>
                            </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
