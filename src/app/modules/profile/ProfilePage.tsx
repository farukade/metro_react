import { Navigate, Routes, Route, Outlet } from "react-router-dom";
import { PageLink, PageTitle } from "../../../_metronic/layout/core";
import { Overview } from "./components/Overview";
import { ProfileHeader } from "./ProfileHeader";
import { useState } from "react";
import { UpdateItem } from "../../../_metronic/partials/modals/itemUpdate/ItemUpdate";

const profileBreadCrumbs: Array<PageLink> = [
  {
    title: "Profile",
    path: "/crafted/pages/profile/overview",
    isSeparator: false,
    isActive: false,
  },
];

const ProfilePage = () => {
  const [updateItemOpen, setUpdateItemOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemValue, setItemValue] = useState(0);
  return (
    <Routes>
      <Route
        element={
          <>
            <ProfileHeader
              setUpdateItemOpen={setUpdateItemOpen}
              setItemName={setItemName}
              setItemValue={setItemValue}
            />
            <Outlet />
            {updateItemOpen && (
              <UpdateItem
                setUpdateItemOpen={setUpdateItemOpen}
                updateItemOpen={updateItemOpen}
                itemName={itemName}
                setItemName={setItemName}
                itemValue={itemValue}
                setItemValue={setItemValue}
              />
            )}
          </>
        }
      >
        <Route
          path="overview"
          element={
            <>
              <PageTitle breadcrumbs={profileBreadCrumbs}></PageTitle>
              <Overview />
              {updateItemOpen && (
                <UpdateItem
                  setUpdateItemOpen={setUpdateItemOpen}
                  updateItemOpen={updateItemOpen}
                  itemName={itemName}
                  setItemName={setItemName}
                  itemValue={itemValue}
                  setItemValue={setItemValue}
                />
              )}
            </>
          }
        />
        {/* <Route
        path='projects'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Projects</PageTitle>
            <Projects />
          </>
        }
      />
      <Route
        path='campaigns'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Campaigns</PageTitle>
            <Campaigns />
          </>
        }
      />
      <Route
        path='documents'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Documents</PageTitle>
            <Documents />
          </>
        }
      />
      <Route
        path='connections'
        element={
          <>
            <PageTitle breadcrumbs={profileBreadCrumbs}>Connections</PageTitle>
            <Connections />
          </>
        }
      /> */}
        <Route
          index
          element={<Navigate to="/crafted/pages/profile/overview" />}
        />
      </Route>
    </Routes>
  );
};

export default ProfilePage;
