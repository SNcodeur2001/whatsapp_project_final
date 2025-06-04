import { createElement } from "../../component";

export function createMiniSidebar() {
  return createElement(
    "div",
    {
      class: [
        "w-[68px]",
        "bg-[#e9edef]", // Changed to light theme color
        "flex",
        "flex-col",
        "py-2",
        "gap-4",
        "border-r",
        "border-[#d1d7db]", // Added border
      ],
    },
    [
      // Messages icon with notification
      createNavItem("chat", "💬", true, "72"),
      // Status icon with green dot
      createElement(
        "div",
        {
          class: ["relative"],
        },
        [
          createNavItem("status", "○"),
          createElement("div", {
            class: [
              "w-[6px]",
              "h-[6px]",
              "bg-[#00a884]",
              "rounded-full",
              "absolute",
              "right-2",
              "top-2",
            ],
          }),
        ]
      ),
      // Communities icon
      createNavItem("communities", "👥"),
      // Channel icon
      createNavItem("channels", "📢"),
      // Settings at bottom
      createElement(
        "div",
        {
          class: ["mt-auto"],
        },
        [createNavItem("settings", "⚙️")]
      ),
      // Profile picture at bottom
      createElement("div", {
        class: [
          "w-[40px]",
          "h-[40px]",
          "rounded-full",
          "bg-[#dfe5e7]", // Changed to light theme color
          "cursor-pointer",
          "mx-auto",
          "mt-2",
        ],
      }),
    ]
  );
}

function createNavItem(name, icon, isActive = false, notificationCount = null) {
  const navItem = createElement(
    "div",
    {
      class: [
        "relative",
        "w-full",
        "h-[72px]",
        "flex",
        "items-center",
        "justify-center",
        "cursor-pointer",
        "hover:bg-[#d1d7db]", // Changed hover color
        isActive ? "bg-[#d1d7db]" : "", // Changed active color
        "group",
      ],
    },
    [
      createElement(
        "span",
        {
          class: [
            "text-2xl",
            isActive ? "text-[#00a884]" : "text-[#54656f]", // Changed inactive color
            "group-hover:text-[#00a884]",
          ],
        },
        icon
      ),
    ]
  );

  // Add notification badge if count exists
  if (notificationCount) {
    navItem.appendChild(
      createElement(
        "div",
        {
          class: [
            "absolute",
            "top-3",
            "right-2",
            "bg-[#00a884]",
            "text-white",
            "text-xs",
            "rounded-full",
            "px-[6px]",
            "py-[2px]",
            "min-w-[20px]",
            "text-center",
          ],
        },
        notificationCount
      )
    );
  }

  return navItem;
}
