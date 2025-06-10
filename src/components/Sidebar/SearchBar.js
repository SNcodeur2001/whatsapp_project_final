import { createElement } from "../../component";

export function createSearchBar() {
  return createElement(
    "div",
    {
      class: ["h-[49px]", "p-2", "bg-white"],
    },
    [
      createElement(
        "div",
        {
          class: [
            "bg-[#f0f2f5]",
            "flex",
            "items-center",
            "gap-4",
            "px-4",
            "rounded-lg",
            "h-[35px]",
          ],
        },
        [
          createElement("span", { class: ["text-[#54656f]"] }, "🔍"),
          createElement("input", {
            type: "text",
            placeholder: "Rechercher ou démarrer une nouvelle discussion",
            class: [
              "bg-transparent",
              "w-full",
              "text-sm",
              "text-[#54656f]",
              "placeholder-[#667781]",
              "focus:outline-none",
            ],
          }),
        ]
      ),
    ]
  );
}
