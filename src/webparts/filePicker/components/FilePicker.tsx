import * as React from 'react';
// import styles from './FilePicker.module.scss';
import type { IFilePickerProps } from './IFilePickerProps';
import {Web} from "@pnp/sp/presets/all";
// import { IFilePickerState } from '@pnp/spfx-controls-react';
import { IFileUploadState } from './IFileUploadState';

export default class FilePicker extends React.Component<IFilePickerProps,IFileUploadState> {
  constructor(props:any){
    super(props);
    this.state={
    Attachments:[]
    }
  }
  //Handle File Selection
  private handleFileChange=(event:React.ChangeEvent<HTMLInputElement>)=>{
    const files=event.target.files;
    if(files){
      this.setState({Attachments:Array.from(files)});
    }
  }
  // upload document
  public async uploadDocuments(){
    try{
      let web=Web(this.props.siteurl);
      const list=web.lists.getByTitle(this.props.ListName);

      const item=await list.items.add({});
      const itemId=item.data.Id;
      //upload each attachment
      for(const file of this.state.Attachments){
        const arrayBuffer=await file.arrayBuffer();
        await list.items.getById(itemId).attachmentFiles.add(file.name,arrayBuffer);
      }
      console.log("Files uploaded successfully");
    }
    catch(err){
      console.error(err);
    }
  }
  public render(): React.ReactElement<IFilePickerProps> {
   

    return (
   <>
   <input type='file' multiple onChange={this.handleFileChange}/>
   <button onClick={()=>this.uploadDocuments()}>Upload</button>
   </>
    );
  }
}
