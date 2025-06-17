import { createElement } from "../component";
import { createMiniSidebar } from "../components/Sidebar/MiniSidebar";
import { createChatsSidebar } from "../components/Sidebar/ChatsSidebar";
import { createChatArea } from "../components/Chat/ChatArea";
import { logout } from "../services/api";
import { router } from "../utils/router";

export function createMainLayout() {
  const chatsSidebar = createChatsSidebar();

  const layout = createElement(
    "div",
    {
      class: ["flex", "h-screen", "bg-[#efeae2]", "fixed", "inset-0"],
    },
    [
      createMiniSidebar(() => chatsSidebar.toggleSettings()),
      createElement(
        "div",
        {
          class: ["flex", "flex-1"],
        },
        [chatsSidebar.element, createChatArea()]
      ),
    ]
  );

  return layout;
}
