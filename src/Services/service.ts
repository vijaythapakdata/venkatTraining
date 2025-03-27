import {sp} from '@pnp/sp/presets/all';
import { IListItems } from '../webparts/largeList/components/IListItem';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ICamlQuery } from '@pnp/sp/presets/all';
export class Service{
   constructor(context:WebPartContext){
    sp.setup({
        spfxContext:context as any
    });
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
   //Get List items
   public async getListItemsMorethan5000Items(ListName:string):Promise<IListItems[]>{
   const allItems:IListItems[]=[];
   let pagedItems:any=null;
   do{
    const camlQuery:ICamlQuery={
        ViewXml:`<View>
        <Query>
        <Where>

        <IsNotNull>
        <FieldRef Name='Title'/>
        </IsNotNull>
        </Where>
        </Query>
        <RowLimit>1000</RowLimit>
        <Paged>TRUE</Paged>
        </View>
        `
    }
    pagedItems=await sp.web.lists.getByTitle(ListName).getItemsByCAMLQuery(camlQuery,pagedItems?pagedItems['@odata.nextLink']:undefined);
    console.log(`Fetched batch of ${pagedItems.length} items`);
    allItems.push(...pagedItems.map((item:any)=>({
        Title:item.Title
    })));
   }
   while(pagedItems['@odata.nextLink']);
   console.log(`Total items fetched : ${allItems.length}`);
   return allItems;
}
}