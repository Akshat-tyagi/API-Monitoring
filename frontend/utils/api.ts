const API_BASE_URL  = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const apicall = async(endpoint:string,options:RequestInit={})=>{
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url,{
        ...options,
        headers:{
            "Content-Type":"application/json",
            ...options.headers,
        },
        credentials:"include"
    });
    if(!response.ok){
        throw new Error(`API Error: ${response.status}`);
    }
    return response.json();
};

export const authAPI = {
    signup:(data:{username:string;email:string;password:string})=>
        apicall("/login/signup",{method:"POST",body:JSON.stringify(data)}),

    signin:(data:{email:string;password:string})=>
        apicall("/login/signin",{method:"POST",body:JSON.stringify(data)})
};

export const monitorAPI={
    create:(data:{name:string,url:string})=>
        apicall("/monitors",{method:"POST",body:JSON.stringify(data)}),

    getAll:()=>
        apicall("/monitors"),

    delete:(id:number)=>
        apicall(`/monitors/${id}`,{method:"DELETE"}),

    getStats:(id:number)=>
        apicall(`/monitors/${id}/checks`),

    getIncidents:(id:number)=>
        apicall(`/monitors/${id}/incidents`)
};