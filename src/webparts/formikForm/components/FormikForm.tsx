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
const stackTokens={childrenGape:30};

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
   

    return (
     <>
     </>
    );
  }
}
