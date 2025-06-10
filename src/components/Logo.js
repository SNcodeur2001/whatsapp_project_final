import { createElement } from "../component";

export function createLogo() {
  return createElement(
    "div",
    {
      class: ["flex", "items-center", "justify-center", "mb-8"],
    },
    [
      createElement("img", {
        src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
        alt: "WhatsApp Logo",
        class: ["w-10", "h-10"],
      }),
    ]
  );
}
