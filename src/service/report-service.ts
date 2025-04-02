import { createAxiosInstance } from "@/lib/axios";

const reportService = {
    async getAll() {
        try{
            const axios = await createAxiosInstance({useToken:true});
            if(!axios){
                throw new Error("Failed to create axios instance");
            }
            const res = await axios.get("/report");
            console.log(res.data);
            return res.data;
        }
        catch(error){
            console.error("Error getting reports:", error);
            return null;

        }
    },

    async getById(id : string) {
        try{
            const axios = await createAxiosInstance({useToken:true});
            if(!axios){
                throw new Error("Failed to create axios instance");
            }
            const res = await axios.get(`/report/${id}`);
            console.log(res.data);
            return res.data;
        }
        catch(error){
            console.error("Error getting report by id:", error);
            return null;
        }
    },
    
    async permanentBan(id : string) {
        try{
            const axios = await createAxiosInstance({useToken:true});
            if(!axios){
                throw new Error("Failed to create axios instance");
            }
            const res = await axios.put(`/report/permanent-ban/${id}`);
            console.log(res.data);
            return res.data;
        }
        catch(error){
            console.error("Error banning report:", error);
            return null;
        }
    }
}

export default reportService;