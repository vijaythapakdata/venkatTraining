import * as React from 'react';
// import styles from './SampleForm.module.scss';
import type { ISampleFormProps } from './ISampleFormProps';
import { ISampleFormState } from './ISampleFormState';
import {Web} from '@pnp/sp/presets/all';
import "@pnp/sp/items";
import "@pnp/sp/lists";
import { Dialog } from '@microsoft/sp-dialog';
import { PrimaryButton, TextField } from '@fluentui/react';

export default class SampleForm extends React.Component<ISampleFormProps,ISampleFormState> {
  constructor(props:any){
    super(props);
    this.state={
      EmployeeName:"",
      Age:""
    }
  }
  //create Data
  public async createData(){
   try{
    let web=Web(this.props.siteurl);
    await web.lists.getByTitle(this.props.ListName).items.add({
      Title:this.state.EmployeeName,
      Age:parseInt(this.state.Age)
    });
    Dialog.alert("Data has been saved successfully");
    this.setState({
      EmployeeName:"",
      Age:""
    })
   }
   catch(err){
console.error("Error found while creating the data");
throw err;
   }
  }
  //even handling
  private hanleChange=(fieldValue:keyof ISampleFormState,value:string|boolean|number):void=>{
    this.setState({[fieldValue]:value}as  unknown as Pick<ISampleFormState,keyof ISampleFormState>);
  }
  public render(): React.ReactElement<ISampleFormProps> {
   

    return (
    <>
    <TextField
    value={this.state.EmployeeName}
    onChange={(_,event)=>this.hanleChange("EmployeeName",event||"")}
    label='Employee Name'
    />
    <TextField value={this.state.Age}
    onChange={(_,event)=>this.hanleChange("Age",event||0)}
    label='Age'
    />
    <br/>
    <PrimaryButton text=' Save' onClick={()=>this.createData()} iconProps={{iconName:'Save'}}/>
    </>
    );
  }
}
