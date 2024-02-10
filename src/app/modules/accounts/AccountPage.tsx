import React from "react";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { Overview } from "./components/Overview";
import { Settings } from "./components/settings/Settings";
import { AccountHeader } from "./AccountHeader";

const accountBreadCrumbs: Array<PageLink> = [
  {
    title: "Contacts",
    path: "/crafted/account/overview",
    isSeparator: false,
    isActive: false,
  },
];

const AccountPage: React.FC = () => {
  return (
    <Routes>
      <Route
        element={
          <>
            {/* <AccountHeader /> */}
            <Outlet />
          </>
        }
      >
        <Route
          path="overview"
          element={
            <>
              <PageTitle breadcrumbs={accountBreadCrumbs}></PageTitle>
              <Overview />
            </>
          }
        />
        <Route index element={<Navigate to="/crafted/account/overview" />} />
      </Route>
    </Routes>
  );
};

export default AccountPage;
