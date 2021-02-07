const express = require('express')
const Joi = require('joi')
const Employee =  require('../mongoDb/connect')
const EmployeeList = require('../localData/employeeList')

const router = express.Router()

router.route('/api/employees').get( async (req,res)=>{
    try{
        const result  = await Employee.find()
        res.send(result)
    }catch{
        res.send(EmployeeList)
    }
    
})

router.route('/api/employees/:id').get( async (req,res)=>{
    try{
        const result  = await Employee.find({Matricule: req.params.id})
        res.send(result)
    }catch{
        const result = EmployeeList.map((item)=>{
            if(item.Matricule == req.params.id){
                return item
            }else{
                return null
            }
        })
        res.send(result)
    }
    
})


// set schema to validate input data
const schema = Joi.object({
    Matricule : Joi.string().max(5).required(),
    Name: Joi.string().min(2).required(),
    gender: Joi.string().required(),
    Age: Joi.number().required(),
    Category: Joi.string().uppercase().max(1).required()

})

// Create new employee
router.route('/api/newEmployee').post( async (req,res)=>{
    let check = schema.validate(req.body)
    if (!check.error){
        var newEmp = {
            Matricule: req.body.Matricule,
            Name: req.body.Name,
            gender: req.body.gender,
            Age: req.body.Age,
            Category: req.body.Category,
            StartDate: new Date
    
        }
        try {
            const employee = new Employee(newEmp)
            const newEmployee = await employee.save()
            res.send(newEmployee)
        } catch(error){
            console.error(error)
            EmployeeList.push(newEmp)
            res.send(EmployeeList)
        }
    
    }    
})

// update employee's information
router.route('/api/employee/:id').put( async (req,res)=>{
    let check = schema.validate(req.body)
    if (!check.error){
        var newEmp = {
            Matricule: req.body.Matricule,
            Name: req.body.Name,
            gender: req.body.gender,
            Age: req.body.Age,
            Category: req.body.Category,
            StartDate: new Date
    
        }
        try {
            const employee = await Employee.find({Matricule: req.params.id})
            if (employee.length == 1) {
                employee[0].Matricule = req.body.Matricule
                employee[0].Name = req.body.Name
                employee[0].gender = req.body.gender
                employee[0].Age = req.body.Age
                employee[0].Category = req.body.Category
                employee[0].save()
                res.send(employee[0])
            }else{
                res.send('nothing to update to database')
                    
            }
            
            
        } catch (error){
            console.error(error)
            const index = EmployeeList.map((item,index)=>{
                if (item.Matricule == req.params.id){
                    return index
                }
            })
            if (index[0]!=null){
                EmployeeList.splice(index[0],1,newEmp)
                res.send(EmployeeList)
            }else{
                res.send('nothing to update')
            }        
        }
    
    }    
})

// delete one employee
router.route('/api/employee/:id').delete( async (req,res)=>{
        try {
            const remove = await Employee.deleteOne({Matricule: req.params.id})
            res.send(remove)
            
        } catch (error){
            console.error(error)
            const index = EmployeeList.map((item,index)=>{
                if (item.Matricule == req.params.id){
                    return index
                }
            })
            if (index[0]!=null){
                EmployeeList.splice(index[0],1)
                res.send(EmployeeList)
            }else{
                res.send('nothing to update')
            } 

        }

})



module.exports = router