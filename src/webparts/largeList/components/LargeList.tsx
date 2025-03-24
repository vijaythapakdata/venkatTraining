import * as React from 'react';
// import styles from './LargeList.module.scss';
import type { ILargeListProps } from './ILargeListProps';
// import { escape } from '@microsoft/sp-lodash-subset';
import {useState,useEffect} from 'react';
import { IListItems } from './IListItem';
import { Service } from '../../../Services/service';
import { DetailsList } from '@fluentui/react';
const LargeList :React.FC<ILargeListProps>=(props)=>{
  const[ListResult,setResult]=useState<IListItems[]>([]);
  const _service =new Service(props.context);

  useEffect(()=>{
    const fetchdata=async()=>{
      try{
        const result =await _service.getListItems(props.ListName);
        setResult(result);
      }
      catch(err){
        console.error("Err",err);
      }
    };
    fetchdata();
  },[props.ListName,_service]);
  return(
    <>
    <DetailsList
    
    items={ListResult}/>
    </>
  )
}
export default LargeList