// src/components/ThemeInitScript.tsx
import { useServerInsertedHTML } from "next/navigation";

export function ThemeInitScript() {
  useServerInsertedHTML(() => (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function(){
            document.documentElement.setAttribute("data-theme-settable", "true");
            try {
              var t = localStorage.getItem("theme");
              if (t === "dark") document.documentElement.classList.add("dark");
              else document.documentElement.classList.remove("dark");
            } catch (_) {}
          })();
        `,
      }}
    />
  ));

  return null;
}