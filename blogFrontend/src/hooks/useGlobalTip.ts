import GlobalTipContext from "@/context/GlobalTipContext";
import {useContext} from "react";

export const useGlobalTip = () => {
    const ctx = useContext(GlobalTipContext);
    if (!ctx) throw new Error('useGlobalTip must be used within GlobalTipProvider');
    return ctx;
}