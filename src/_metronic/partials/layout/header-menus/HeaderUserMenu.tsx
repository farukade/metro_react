import { FC } from "react";
import { useAuth } from "../../../../app/modules/auth";
import { getAvatar } from "../../../helpers";

const HeaderUserMenu: FC = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div
      className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px"
      data-kt-menu="true"
    >
      <div className="menu-item px-3">
        <div className="menu-content d-flex align-items-center px-3">
          <div className="symbol symbol-50px me-5">
            <img alt="Logo" src={getAvatar(currentUser)} />
          </div>

          <div className="d-flex flex-column">
            <div className="fw-bolder d-flex align-items-center fs-5">
              {currentUser?.firstName} {currentUser?.lastName}
              <span className="badge badge-light-success fw-bolder fs-8 px-2 py-1 ms-2">
                Pro
              </span>
            </div>
            <a href="#" className="fw-bold text-muted text-hover-primary fs-7">
              {currentUser?.email}
            </a>
          </div>
        </div>
      </div>

      <div className="menu-item px-5">
        <a onClick={logout} className="menu-link px-5">
          Sign Out
        </a>
      </div>
    </div>
  );
};

export { HeaderUserMenu };
