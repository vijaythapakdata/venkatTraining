import * as React from 'react';
// import styles from './SampleForm.module.scss';
import type { ISampleFormProps } from './ISampleFormProps';
import { ISampleFormState } from './ISampleFormState';
import {Web} from '@pnp/sp/presets/all';
import "@pnp/sp/items";
import "@pnp/sp/lists";
import { Dialog } from '@microsoft/sp-dialog';
import { PrimaryButton, TextField } from '@fluentui/react';
import {PeoplePicker,PrincipalType} from "@pnp/spfx-controls-react/lib/PeoplePicker";

export default class SampleForm extends React.Component<ISampleFormProps,ISampleFormState> {
  constructor(props:any){
    super(props);
    this.state={
      EmployeeName:"",
      Age:"",
      Manager:[],
      ManagerId:[]
    }
  }
  //create Data
  public async createData(){
   try{
    let web=Web(this.props.siteurl);
    await web.lists.getByTitle(this.props.ListName).items.add({
      Title:this.state.EmployeeName,
      Age:parseInt(this.state.Age),
      ManagerId:{results:this.state.ManagerId}
    });
    Dialog.alert("Data has been saved successfully");
    this.setState({
      EmployeeName:"",
      Age:"",
     Manager:"",
     ManagerId:0
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
    <PeoplePicker 
    context={this.props.context as any}
    ensureUser={true}
    // defaultSelectedUsers={[this.state.Manager?this.state.Manager:""]}
    defaultSelectedUsers={this.state.Manager}
    principalTypes={[PrincipalType.User]}
    onChange={this._getPeoplePickerValues}
    titleText='Manager'
    personSelectionLimit={4}
    webAbsoluteUrl={this.props.siteurl}
    />
    <br/>
    <PrimaryButton text=' Save' onClick={()=>this.createData()} iconProps={{iconName:'Save'}}/>
    </>
    );
  }
  //Get PeoplePicker
public _getPeoplepicker=(items:any[]):void=>{
    if(items.length>0){
      this.setState({
        Manager:items[0].text,
        ManagerId:items[0].id
      });
    }
    else{
      this.setState({
        Manager:"",
        ManagerId:0
      })
    }
  }
  private _getPeoplePickerValues=(items:any):void=>{
    const managers=items.map((item:any)=>item.text)
    const managerId=items.map((item:any)=>item.id)
    this.setState({
      Manager:managers,
      ManagerId:managerId
    })
  }
  
}
