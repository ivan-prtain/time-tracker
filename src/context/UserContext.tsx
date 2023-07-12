import React, { createContext, useContext, useState } from 'react';
import { User } from 'firebase/auth'

// Define the type for the theme context
type UserContextType = {
    userContext: {};
    updateUserContext: (newUser: User) => void;
};

type UserProviderProps = {
    children: React.ReactNode;
}

// Create a new context
const UserContext = createContext<UserContextType>({} as UserContextType);

// Create a user component
export const UserProvider = ({ children }: UserProviderProps) => {
    // State and logic for the user
    const [userContext, setUserContext] = useState({});

    // Function to set the user
    const updateUserContext = (newUser: User) => {
        setUserContext(newUser);
    };



    return (
        <UserContext.Provider value={{ userContext, updateUserContext }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to consume the user context
export const useUser = (): UserContextType => {
    return useContext(UserContext);
};