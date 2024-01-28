import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { KTIcon, formatCurrency, getAvatar } from "../../../_metronic/helpers";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
import { Content } from "../../../_metronic/layout/components/content";
import { useAuth } from "../auth";
import { startCase } from "lodash";

type Props = {
  setUpdateItemOpen: Dispatch<SetStateAction<boolean>>;
  setItemName: Dispatch<SetStateAction<string>>;
  setItemValue: Dispatch<SetStateAction<number>>;
};

const ProfileHeader: FC<Props> = ({
  setUpdateItemOpen,
  setItemName,
  setItemValue,
}) => {
  const { currentUser } = useAuth();
  const [unitBalance, setUnitBalance] = useState(0);
  const [totalUsed, setTotalUsed] = useState(0);
  const [total, setTotal] = useState(0);
  const [amountSpent, setAmountSpent] = useState(0);

  useEffect(() => {
    if (currentUser) {
      setUnitBalance(currentUser.unitBalance || 0);
      setTotalUsed(currentUser.totalUsed || 0);
      setTotal(currentUser.total || 0);
      setAmountSpent(currentUser.amountSpent || 0);
    }
  }, [currentUser]);

  return (
    <>
      <ToolbarWrapper />
      <Content>
        <div className="card mb-5 mb-xl-10">
          <div className="card-body pt-9 pb-0">
            <div className="d-flex flex-wrap flex-sm-nowrap mb-3">
              <div className="me-7 mb-4">
                <div className="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                  <img
                    // src={toAbsoluteUrl("/media/avatars/300-1.jpg")}
                    src={getAvatar(currentUser)}
                    alt="Avatar"
                  />
                  <div className="position-absolute translate-middle bottom-0 start-100 mb-6 bg-success rounded-circle border border-4 border-white h-20px w-20px"></div>
                </div>
              </div>

              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start flex-wrap mb-2">
                  <div className="d-flex flex-column">
                    <div className="d-flex align-items-center mb-2">
                      <a
                        href="#"
                        className="text-gray-800 text-hover-primary fs-2 fw-bolder me-1"
                      >
                        {startCase(
                          currentUser?.firstName + " " + currentUser?.lastName
                        )}
                      </a>
                      <a href="#">
                        <KTIcon
                          iconName="verify"
                          className="fs-1 text-primary"
                        />
                      </a>
                    </div>

                    <div className="d-flex flex-wrap fw-bold fs-6 mb-4 pe-2">
                      <a
                        href="#"
                        className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2"
                      >
                        <KTIcon
                          iconName="profile-circle"
                          className="fs-4 me-1"
                        />
                        {startCase(currentUser?.firstName)}
                      </a>
                      <a
                        href="#"
                        className="d-flex align-items-center text-gray-500 text-hover-primary me-5 mb-2"
                      >
                        <KTIcon iconName="geolocation" className="fs-4 me-1" />
                        {currentUser?.address}
                      </a>
                      <a
                        href="#"
                        className="d-flex align-items-center text-gray-500 text-hover-primary mb-2"
                      >
                        <KTIcon iconName="sms" className="fs-4 me-1" />
                        {currentUser?.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-wrap flex-stack">
                  <div className="d-flex flex-column flex-grow-1 pe-8">
                    <div className="d-flex flex-wrap">
                      <div
                        className="border cursor-pointer border-gray-300 border-dashed rounded min-w-115px py-3 px-4 me-6 mb-3"
                        onClick={() => {
                          if (currentUser?.type === "admin") {
                            setUpdateItemOpen(true);
                            setItemName("unitBalance");
                            setItemValue(unitBalance);
                          }
                        }}
                      >
                        <div className="d-flex align-items-center">
                          {unitBalance && unitBalance > 100 ? (
                            <KTIcon
                              iconName="arrow-up"
                              className="fs-3 text-success me-2"
                            />
                          ) : (
                            <KTIcon
                              iconName="arrow-down"
                              className="fs-3 text-danger me-2"
                            />
                          )}
                          <div className="fs-2 fw-bolder">{unitBalance}</div>
                        </div>

                        <div className="fw-bold fs-6 text-gray-500">
                          Unit Balance
                        </div>
                      </div>

                      <div
                        className="border cursor-pointer border-gray-300 border-dashed rounded min-w-115px py-3 px-4 me-6 mb-3"
                        onClick={() => {
                          if (currentUser?.type === "admin") {
                            setUpdateItemOpen(true);
                            setItemName("totalUsed");
                            setItemValue(totalUsed);
                          }
                        }}
                      >
                        <div className="d-flex align-items-center">
                          {totalUsed && totalUsed > 200 ? (
                            <KTIcon
                              iconName="arrow-up"
                              className="fs-3 text-success me-2"
                            />
                          ) : (
                            <KTIcon
                              iconName="arrow-down"
                              className="fs-3 text-danger me-2"
                            />
                          )}
                          <div className="fs-2 fw-bolder">{totalUsed}</div>
                        </div>

                        <div className="fw-bold fs-6 text-gray-500">
                          Total Used
                        </div>
                      </div>

                      <div
                        className="cursor-pointer border border-gray-300 border-dashed rounded min-w-115px py-3 px-4 me-6 mb-3"
                        onClick={() => {
                          if (currentUser?.type === "admin") {
                            setUpdateItemOpen(true);
                            setItemName("total");
                            setItemValue(total);
                          }
                        }}
                      >
                        <div className="d-flex align-items-center">
                          {total && total > 0 ? (
                            <KTIcon
                              iconName="arrow-up"
                              className="fs-3 text-success me-2"
                            />
                          ) : (
                            <KTIcon
                              iconName="arrow-down"
                              className="fs-3 text-danger me-2"
                            />
                          )}
                          <div className="fs-2 fw-bolder">{total}</div>
                        </div>

                        <div className="fw-bold fs-6 text-gray-500">Total</div>
                      </div>

                      <div className="border border-gray-300 border-dashed rounded min-w-115px py-3 px-4 me-6 mb-3">
                        <div className="d-flex align-items-center">
                          <KTIcon
                            iconName="arrow-up"
                            className="fs-3 text-success me-2"
                          />
                          <div className="fs-2 fw-bolder">
                            {formatCurrency(amountSpent)}
                          </div>
                        </div>

                        <div className="fw-bold fs-6 text-gray-500">
                          Amount Spent
                        </div>
                      </div>
                      <div className="border border-gray-300 border-dashed rounded min-w-115px py-3 px-4 me-6 mb-3">
                        <div className="d-flex align-items-center">
                          <KTIcon
                            iconName="arrow-up"
                            className="fs-3 text-success me-2"
                          />
                          <div className="fs-2 fw-bolder">
                            {currentUser?.transactionCount}
                          </div>
                        </div>

                        <div className="fw-bold fs-6 text-gray-500">Count</div>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center w-200px w-sm-300px flex-column mt-3">
                    <div className="d-flex justify-content-between w-100 mt-auto mb-2">
                      <span className="fw-bold fs-6 text-gray-500">
                        Profile Completion
                      </span>
                      <span className="fw-bolder fs-6">75%</span>
                    </div>
                    <div className="h-5px mx-3 w-100 bg-light mb-3">
                      <div
                        className="bg-success rounded h-5px"
                        role="progressbar"
                        style={{ width: "75%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="d-flex overflow-auto h-55px">
              <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bolder flex-nowrap">
                <li className="nav-item">
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname ===
                        "/crafted/pages/profile/overview" && "active")
                    }
                    to="/crafted/pages/profile/overview"
                  >
                    History
                  </Link>
                </li>
             <li className="nav-item">
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname ===
                        "/crafted/pages/profile/projects" && "active")
                    }
                    to="/crafted/pages/profile/projects"
                  >
                    Projects
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname ===
                        "/crafted/pages/profile/campaigns" && "active")
                    }
                    to="/crafted/pages/profile/campaigns"
                  >
                    Campaigns
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname ===
                        "/crafted/pages/profile/documents" && "active")
                    }
                    to="/crafted/pages/profile/documents"
                  >
                    Documents
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={
                      `nav-link text-active-primary me-6 ` +
                      (location.pathname ===
                        "/crafted/pages/profile/connections" && "active")
                    }
                    to="/crafted/pages/profile/connections"
                  >
                    Connections
                  </Link>
                </li> 
              </ul>
            </div>*/}
          </div>
        </div>
      </Content>
    </>
  );
};

export { ProfileHeader };
