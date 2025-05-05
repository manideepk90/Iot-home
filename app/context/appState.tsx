import { createContext, useState, useContext } from "react";

interface AppStateContextType {
    isAddNewDevice: boolean;
    setIsAddNewDevice: (isAddNewDevice: boolean) => void;
    ipAddress: string;
    setIpAddress: (ipAddress: string) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const useAppState = () => {
    const context = useContext(AppStateContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
};

export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAddNewDevice, setIsAddNewDevice] = useState(false);
    const [ipAddress, setIpAddress] = useState("");
    return (
        <AppStateContext.Provider value={{ isAddNewDevice, setIsAddNewDevice, ipAddress, setIpAddress }}>
            {children}
        </AppStateContext.Provider>
    );
};



