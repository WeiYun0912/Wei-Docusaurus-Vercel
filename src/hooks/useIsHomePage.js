import { useLocation } from "@docusaurus/router";

export function useIsHomePage() {
    const location = useLocation();
    return location.pathname === "/";
}
