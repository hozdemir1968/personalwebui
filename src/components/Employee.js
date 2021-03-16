import React from 'react'
import {useState, useEffect} from 'react';

const defaultImageSrc= '/img/placeholder.png'

const initialFieldValues= {
    employeeId: 0,
    emploeeName: '',
    occupation: '',
    imageName: '',
    imageSrc: defaultImageSrc,
    imageFile: null
}

export default function Employee(props) {

    const {addOrEdit, recordForEdit} =props
    const [values, setValues]= useState(initialFieldValues)
    const [errors, setErrors]= useState({})

    useEffect(()=> {
        if (recordForEdit != null)
            setValues(recordForEdit);
    }, [recordForEdit])

    const handleInputChange =e => {
        const {name, value} = e.target;
        setValues({
            ...values,
            [name]:value
        })
    }

    const showPreview = e=> {
        if (e.target.files && e.target.files[0]) {
            let imageFile= e.target.files[0];
            const reader= new FileReader();
            reader.onload= x=> {
                setValues({
                    ...values,
                    imageFile,
                    imageSrc: x.target.result
                })
            }
            reader.readAsDataURL(imageFile)
        } else {
          setValues({
            ...values,
            imageFile: null,
            imageSrc: defaultImageSrc
          })
        }
    }

    const validate = () => {
        let temp= {}
        temp.employeeName= values.employeeName=== ""? false: true;
        temp.imageSrc= values.imageSrc=== defaultImageSrc? false: true;
        setErrors(temp)
        return Object.values(temp).every(x=> x===true)
    }

    const resetForm = () => {
        setValues(initialFieldValues)
        document.getElementById('image-uploader').value= null;
        setErrors({})
    }

    const handleFormSubmit = e => {
        e.preventDefault()
        if (validate()) {
            const formData= new FormData()
            formData.append('employeeId', values.employeeId)            
            formData.append('employeeName', values.employeeName)            
            formData.append('occupation', values.occupation)            
            formData.append('imageName', values.imageName)            
            formData.append('imageFile', values.imageFile)
            addOrEdit(formData, resetForm)
        }
    }

    const applyErrorClass = field => ((field in errors && errors[field]===false)? ' invalid-field': '')

    return (
        <>
            <div className="container text-center">
                <p>An Employee</p>
            </div>
            <form autoComplete="off" noValidate onSubmit={handleFormSubmit}>
                <div className="card">
                    <img src={values.imageSrc} className="card-img-top" alt="Blank!" />
                    <div className="card-body">
                        <div className="form-group">
                            <input type="file" accept="image/*" className={"form-control-file"+applyErrorClass()}
                                onChange={showPreview} id="image-uploader" />
                        </div>
                        <div className="form-group">
                            <input className={"form-control"+applyErrorClass('employeeName')}
                                name="employeeName"
                                placeholder="Employee Name"
                                value={values.employeeName}
                                onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <input className="form-control"
                                name="occupation"
                                placeholder="Occupation"
                                value={values.occupation}
                                onChange={handleInputChange} />
                        </div>
                        <div className="form-group text-center">
                            <button type="submit" className="btn btn-light">Submit</button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}
