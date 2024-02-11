import { useEffect } from "react";
import { useLocation } from "react-router";
import clsx from "clsx";
import { useLayout } from "../../core";
import { DrawerComponent } from "../../../assets/ts/components";
import { WithChildren } from "../../../helpers";
import ConfirmationModal from "../../../partials/modals/confirmation/Confirmation";

const Content = ({ children }: WithChildren) => {
  const { config, classes, confirmation } = useLayout();
  const location = useLocation();
  useEffect(() => {
    DrawerComponent.hideAll();
  }, [location]);

  const appContentContainer = config.app?.content?.container;
  return (
    <div
      id="kt_app_content"
      className={clsx(
        "app-content flex-column-fluid",
        classes.content.join(" "),
        config?.app?.content?.class
      )}
    >
      {appContentContainer ? (
        <div
          id="kt_app_content_container"
          className={clsx("app-container", classes.contentContainer.join(" "), {
            "container-xxl": appContentContainer === "fixed",
            "container-fluid": appContentContainer === "fluid",
          })}
        >
          {children}
        </div>
      ) : (
        <>{children}</>
      )}
      {confirmation && (
        <ConfirmationModal
          message={confirmation.message}
          action={confirmation.action}
          close={confirmation.close}
        />
      )}
    </div>
  );
};

export { Content };
