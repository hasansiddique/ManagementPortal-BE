import path from 'path';
import employeeModel from './employee.model';
import UserModel from '../user/user.model';
import asyncHandler from '../../../middleware/async';
import config from "../../../config";

// @desc      create employee
// @route     POST /v1/employee/create
// @access    Private
export const addEmp = asyncHandler(async (ctx) => {
  ctx.assert(ctx.request.body, 400, 'Please enter the  required fields')
  const { name, email } = ctx.request.body;
  // if user add file then execute below condition otherwise go next
  if (ctx.request.file) {
    const file = ctx.request.file;
    // Make sure the image is a photo
    ctx.assert(file.mimetype.startsWith('image'), 400, 'Please upload an image file');
    // Check fileSize
    ctx.assert(file.size <= config.uploadConfig.MAX_FILE_UPLOAD , 400, 'Please upload an image less than 2MB');
    // Add file to request body
    ctx.request.body.photo = file.filename;
  }
  const employee = await UserModel.findOne({ email });
  ctx.assert(!employee, 400, 'user with same credentials already exists');
  // make employee password on the fly
  const password = email.concat('.', 'warlords', 123);
  // creates employee account
   const empAccount = await UserModel.create({ username: name, email, password });
  // add employee to request body so that it relates to its specific account
   ctx.request.body.user = empAccount.id;
  // save employee data
  await employeeModel.create(ctx.request.body);
   ctx.status = 201;
   ctx.body = { success: true, status: 'Employee Successfully Created' };
});

// @desc      get all employee
// @route     Get /v1/employee/
// @access    Public
export const getAllEmp = asyncHandler(async (ctx) => {
  const employee = await employeeModel.find();
  ctx.status = 200;
  ctx.body = { success: true, length: employee.length, employee };
});

// @desc      get single employee
// @route     Get /v1/employee/:id
// @access    Private
export const singEmp = asyncHandler(async (ctx) => {
  const employee = await employeeModel.findById(ctx.params.id);
  ctx.assert(employee, 404, 'Employee not found with this id');
  ctx.status = 200;
  ctx.body = { success: true, employee };
});

// @desc      update single employee
// @route     PUT /v1/employee/:id
// @access    Private
export const uptEmp = asyncHandler(async (ctx) => {
  const { email } = ctx.request.body;
  const employee = await employeeModel.findById(ctx.params.id);
  ctx.assert(employee, 404, 'Employee not found with this id');
  // if user add file then execute below condition otherwise go next
  if (ctx.request.file) {
    const file = ctx.request.file;
    // Make sure the image is a photo
    ctx.assert(file.mimetype.startsWith('image'), 400, 'Please upload an image file');
    // Check fileSize
    ctx.assert(file.size <= config.uploadConfig.MAX_FILE_UPLOAD , 400, 'Please upload an image less than 2MB');
    // Add file to request body
    ctx.request.body.photo = file.filename;
  }
  const empData = await employeeModel.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
    new: true, runValidators: true });
  await UserModel.findByIdAndUpdate(empData.user, { email }, { new: true, runValidators: true } );
  ctx.status = 200;
  ctx.body = { success: true, status: 'Employee Successfully Updated' };
});

// @desc      Delete single employee
// @route     DELETE /v1/employee/:id
// @access    Private
export const delEmp = asyncHandler(async (ctx) => {
  const employee = await employeeModel.findById(ctx.params.id);
  ctx.assert(employee, 404, 'Employee not found with this id');
  employee.remove();
  ctx.status = 200;
  ctx.body = { success: true, status: 'Employee Successfully Deleted' };
});

// @desc      get single employee profile
// @route     Get /v1/employee/:id/record
// @access    Private
export const empRecord = asyncHandler(async (ctx) => {
  const record = await employeeModel.findOne({ user: ctx.user.id });
  ctx.assert(record, 404, 'Employee Record did not found with this id');
  ctx.status = 200;
  ctx.body = { success: true, record };
});


