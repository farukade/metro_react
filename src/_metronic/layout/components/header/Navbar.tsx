import clsx from "clsx";
import { KTIcon, getAvatar } from "../../../helpers";
import {
  HeaderNotificationsMenu,
  HeaderUserMenu,
  Search,
  ThemeModeSwitcher,
} from "../../../partials";
import { useLayout } from "../../core";
import { useAuth } from "../../../../app/modules/auth";

const itemClass = "ms-1 ms-md-4";
const btnClass =
  "btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px";
const userAvatarClass = "symbol-35px";
const btnIconClass = "fs-2";

const Navbar = () => {
  const { config } = useLayout();
  const { currentUser } = useAuth();
  return (
    <div className="app-navbar flex-shrink-0">
      <div className={clsx("app-navbar-item align-items-stretch", itemClass)}>
        <Search />
      </div>

      {/* <div className={clsx("app-navbar-item", itemClass)}>
        <div id="kt_activities_toggle" className={btnClass}>
          <KTIcon iconName="chart-simple" className={btnIconClass} />
        </div>
      </div> */}

      <div className={clsx("app-navbar-item", itemClass)}>
        <div
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
          className={btnClass}
        >
          <KTIcon iconName="element-plus" className={btnIconClass} />
        </div>
        <HeaderNotificationsMenu />
      </div>

      {/* <div className={clsx("app-navbar-item", itemClass)}>
        <div
          className={clsx("position-relative", btnClass)}
          id="kt_drawer_chat_toggle"
        >
          <KTIcon iconName="message-text-2" className={btnIconClass} />
          <span className="bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink" />
        </div>
      </div> */}

      <div className={clsx("app-navbar-item", itemClass)}>
        <ThemeModeSwitcher
          toggleBtnClass={clsx("btn-active-light-primary btn-custom")}
        />
      </div>

      <div className={clsx("app-navbar-item", itemClass)}>
        <div
          className={clsx("cursor-pointer symbol", userAvatarClass)}
          data-kt-menu-trigger="{default: 'click'}"
          data-kt-menu-attach="parent"
          data-kt-menu-placement="bottom-end"
        >
          {/* <img src={toAbsoluteUrl("media/avatars/300-3.jpg")} alt="" /> */}
          <img alt="Logo" src={getAvatar(currentUser)} />
        </div>
        <HeaderUserMenu />
      </div>

      {config.app?.header?.default?.menu?.display && (
        <div
          className="app-navbar-item d-lg-none ms-2 me-n3"
          title="Show header menu"
        >
          <div
            className="btn btn-icon btn-active-color-primary w-35px h-35px"
            id="kt_app_header_menu_toggle"
          >
            <KTIcon iconName="text-align-left" className={btnIconClass} />
          </div>
        </div>
      )}
    </div>
  );
};

export { Navbar };
