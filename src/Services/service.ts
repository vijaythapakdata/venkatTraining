import {sp} from '@pnp/sp/presets/all';
import { IListItems } from '../webparts/largeList/components/IListItem';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export class Service{
   constructor(context:WebPartContext){
    sp.setup({
        spfxContext:context as any
    })
   }

   //get list item
   public async getListItems(ListName:string):Promise<IListItems[]>{
    try{
        const items=await sp.web.lists.getByTitle(ListName).items.getAll();
        return items.map((items:any)=>({
            Title:items.Title
        }));
    }
    catch(err){
        console.error("Error while the itmes",err);
        throw err;
    }
   }
}