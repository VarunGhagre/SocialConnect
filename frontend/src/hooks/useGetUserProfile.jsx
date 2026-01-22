import { setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";


const useGetUserProfile = (userId) => {

    const API = import.meta.env.VITE_API_URL;

    const dispatch = useDispatch();
    // const [userProfile, setUserProfile] = useState(null);
    useEffect(() => {
        if (!userId) return;

        const fetchUserProfile = async () => {
            try {
                const res = await axios.get(`${API}/user/${userId}/profile`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setUserProfile(res.data.user));
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchUserProfile();
    }, [userId, dispatch]);
};
export default useGetUserProfile;