import * as React from 'react';
import styles from './FormikForm.module.scss';
import type { IFormikFormProps } from './IFormikFormProps';
import { SPService } from '../../../FormikService/fromikservice';
import { IFormikState } from './IFormikState';
import {sp} from "@pnp/sp/presets/all";
import { Formik,FormikProps } from 'formik';
import * as yup from 'yup';
import { Dialog } from '@microsoft/sp-dialog';
import { PeoplePicker,PrincipalType } from '@pnp/spfx-controls-react/lib/PeoplePicker';
import { DatePicker, Dropdown, Label, PrimaryButton, Stack, TextField } from '@fluentui/react';
const stackTokens={childrenGap:30};

export default class FormikForm extends React.Component<IFormikFormProps,IFormikState> {
  private _service:SPService;
  constructor(props:any){
    super(props);
    this.state={
      projectName:"",
      startDate:null,
      endDate:null
    }
    sp.setup({
      spfxContext:this.props.context as any
    });
    this._service=new SPService(this.props.siteurl);
  }
  //form validation
  private getFieldProps=(formik:FormikProps<any>,field:string)=>{
    return {...formik.getFieldProps(field),errorMessage:formik.errors[field] as string};
  }

  //create task
  public async createRecord(record:any){
    let item=await this._service.createTasks("MyTasks",{
      Title:record.name,
      TaskDetails:record.details,
      startDate:new Date(record.startDate),
      EndDate:new Date(record.endDate),
      ProjectName:record.projectName
    })
    .then((data)=>{
      console.log(item);
      console.log("No error occured while creating the items");
      Dialog.alert("Item has been successfully created");
      return data;
    })
    .catch((err)=>{
      console.error("Error occurred");
      throw err;
    })
  }
  public render(): React.ReactElement<IFormikFormProps> {
   
const validate=yup.object().shape({
  name:yup.string().required("Task name can not be empty"),
  details:yup.string().min(15,"minimum 15 words are required").required("Task details is required"),
  startDate:yup.date().required("Start Date is required"),
  endDate:yup.date().required("End Date is required"),
  projectName:yup.string().required("Project name is required")
})
    return (
     <>
     <Formik
     initialValues={{
      name:"",
      details:"",
      projectName:"",
      startDate:null,
      endDate:null
     }}
     validationSchema={validate}
     onSubmit={(values,helpers)=>{
      this.createRecord(values).then(_=>{
        helpers.resetForm()
      })
     }}
     >
      {(formik:any)=>(
        <div className={styles.formikForm}>
          <Stack tokens={stackTokens}>
<Label className={styles.lblForm}>Current User</Label>
<PeoplePicker context={this.props.context as any}
ensureUser={true}
personSelectionLimit={1}
defaultSelectedUsers={[this.props.context.pageContext.user.displayName as any]}
principalTypes={[PrincipalType.User]}
webAbsoluteUrl={this.props.siteurl}
disabled={true}

/>
<Label className={styles.lblForm}>Task Name</Label>
<TextField
{...this.getFieldProps(formik,'name')}
/>
<Label className={styles.lblForm}>Project Name</Label>
<Dropdown
options={[
  {key:'Task 1',text:'Task 1'},
  {key:'Task 2', text:'Task 2'},
  {key:'Task 3',text:'Task 3'}
]}
{...this.getFieldProps(formik,'projectName')}
onChange={(event,Option)=>{formik.setFieldValue('projectName',Option?.key.toString())}}

/>
<Label className={styles.lblForm}>Start Date</Label>
<DatePicker 
id='startDate'
value={formik.values.startDate}
textField={{...this.getFieldProps(formik,'startDate')}}
onSelectDate={(date)=>formik.setFieldValue('startDate',date)}
/>
<Label className={styles.lblForm}>End Date</Label>
<DatePicker 
id='endDate'
value={formik.values.startDate}
textField={{...this.getFieldProps(formik,'endDate')}}
onSelectDate={(date)=>formik.setFieldValue('endDate',date)}
/>
<Label className={styles.lblForm}>Project Details</Label>
<TextField
rows={6}
{...this.getFieldProps(formik,'details')}
multiline
/>
          </Stack>
          <PrimaryButton
          className={styles.btnsForm}
          text='Save' iconProps={{iconName:'save'}}
          onClick={formik.handleSubmit as any}
          
          />
            <PrimaryButton
          className={styles.btnsForm}
          text='Cancel' iconProps={{iconName:'cancel'}}
          onClick={formik.handleReset as any}
          
          />
        </div>
      )}
      </Formik>
     </>
    );
  }
}
