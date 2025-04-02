import * as React from 'react';
// import styles from './FunctionalForm.module.scss';
import type { IFunctionalFormProps } from './IFunctionalFormProps';
import { IFunctionalFormState } from './IFunctionalFormState';
import { Web } from '@pnp/sp/webs';
import { Dialog } from '@microsoft/sp-dialog';
import { PrimaryButton ,TextField} from '@fluentui/react';
import { useState } from 'react';


const FunctionalForm : React.FC<IFunctionalFormProps>=(props)=>{
  const[formData,setFormData]=useState<IFunctionalFormState>({
    Title:""
  });
  const createData=async()=>{
    let web=Web(props.siteurl);
    await web.lists.getByTitle("First List").items.add({
      Title:formData.Title
    })
    .then((data)=>{
      console.log("No error");
      return data;
    })
    .catch((err)=>{
      console.error("err");
      throw err;
    });
    Dialog.alert("Successfully Saved");
    setFormData({Title:""});
  }
  //Form event
  const handleChange=(field:keyof IFunctionalFormState,value:string)=>{
    setFormData(prevState=>({...prevState,[field]:value}));
  }
  return(
    <>
    <TextField value={formData.Title}
    label='Name'
    onChange={(_,event)=>handleChange("Title",event||"")}

    
/>
<br/>
<PrimaryButton text='Save' onClick={createData} iconProps={{iconName:'save'}}/>
    </>
  )
}
export default FunctionalForm 