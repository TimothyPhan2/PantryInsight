import axios from "axios";
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/";
export default axios.create({
    baseURL: baseURL,
    headers: {
        "Content-type": "application/json"
    
    }
})