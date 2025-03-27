import {Web} from "@pnp/sp/presets/all";

export class SPService{
    private web;
    constructor(url:string){
        this.web=Web(url);

    }
    public async createTasks(listName:string,body:any){
        try{
            let createItems=await this.web.lists.getByTitle(listName).items.add(body)
            return(createItems);
        }
        catch(err){
            console.error("Error while creating the task");
            throw err;
        }
        finally{
            console.log("I will always run");
        }
    }
}