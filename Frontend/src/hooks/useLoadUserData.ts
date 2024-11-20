import { useCallback, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../redux/slices/userSlicer';

const useLoadUserData = () => {
    const dispatch = useDispatch();

    const loadUserData = useCallback(async (): Promise<any> => {
        try {
            const res = await axios.get("http://localhost:3000/refreshtoken", { withCredentials: true });
            dispatch(addUser(res.data));
            return res.data; // Return user data so it can be used to navigate
        } catch (err:any) {
            console.log(err.message);
            return null; // Return null if there’s an error, to handle navigation based on this
        }
    }, [dispatch]);

    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    return { loadUserData };
};

export default useLoadUserData;
