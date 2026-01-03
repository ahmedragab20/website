export function injectStyles(id: string, css: string) {
    if (typeof document === "undefined") return;
    if (!document.getElementById(id)) {
        const styleElement = document.createElement("style");
        styleElement.id = id;
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }
}
