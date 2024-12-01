import { useIsHomePage } from "@site/src/hooks/useIsHomePage";

export default function Layout(props) {
    const isHomePage = useIsHomePage();

    return <div data-page-type={isHomePage ? "home" : "other"}>{/* ... 其他代碼 */}</div>;
}
