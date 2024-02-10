import { useIntl } from "react-intl";
import { SidebarMenuItem } from "./SidebarMenuItem";

const SidebarMenuMain = () => {
  const intl = useIntl();

  return (
    <>
      <SidebarMenuItem
        to="/crafted/pages/profile/overview"
        icon="element-11"
        title={intl.formatMessage({ id: "MENU.DASHBOARD" })}
        fontIcon="bi-app-indicator"
      />
      <SidebarMenuItem
        to="/crafted/account/overview"
        icon="element-10"
        title={intl.formatMessage({ id: "MENU.CONTACTS" })}
        fontIcon="bi-app-indicator"
      />
    </>
  );
};

export { SidebarMenuMain };
