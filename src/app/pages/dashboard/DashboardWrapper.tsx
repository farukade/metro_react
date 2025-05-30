import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { months, titles, toAbsoluteUrl } from "../../../_metronic/helpers";
import { PageTitle } from "../../../_metronic/layout/core";
import {
  ListsWidget2,
  ListsWidget3,
  ListsWidget4,
  ListsWidget6,
  TablesWidget5,
  TablesWidget10,
  MixedWidget8,
  CardsWidget7,
  CardsWidget17,
  CardsWidget20,
  ListsWidget26,
  EngageWidget10,
} from "../../../_metronic/partials/widgets";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
import { Content } from "../../../_metronic/layout/components/content";
import { UserModel, useAuth } from "../../modules/auth";

const DashboardPage: FC = () => {
  const { currentUser } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!items.length && currentUser) {
      let result: any = [];

      for (let i = 0; i < 3; i++) {
        let value = 0;
        switch (i) {
          case 0:
            value = currentUser.unitBalance;
            break;
          case 1:
            value = currentUser.openingBalance;
            break;
          case 2:
            value = currentUser.openingBalance - currentUser.unitBalance;
            break;
        }
        const current = {
          title: titles[i],
          value,
        };
        result = [...result, current];
      }
      setItems(result);
    }
  }, [items]);

  const getProgress = (user: UserModel, type: string) => {
    const { unitBalance, openingBalance } = user;
    switch (type) {
      case "usage":
        return Math.abs((openingBalance / 100) * unitBalance);
      default:
        return Math.abs((unitBalance / 100) * openingBalance);
    }
  };

  const getPercentage = (total: number, num: number) => {
    return Math.ceil(Math.abs((num / total) * 100));
  };
  return (
    <>
      <ToolbarWrapper />
      <Content>
        {/* begin::Row */}
        <div className="row g-5 g-xl-10 mb-5 mb-xl-10">
          {/* begin::Col */}
          <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
            {currentUser && (
              <CardsWidget20
                className="h-md-50 mb-5 mb-xl-10"
                description="Units left"
                color="#F1416C"
                num={currentUser.unitBalance}
                progress={getProgress(currentUser, "usage")}
                img={toAbsoluteUrl("media/patterns/vector-1.png")}
              />
            )}
            {currentUser && (
              <CardsWidget7
                className="h-md-50 mb-5 mb-xl-10"
                description={`${months[new Date().getMonth()]} usage`}
                icon={false}
                stats={357}
                labelColor="dark"
                textColor="gray-300"
              />
            )}
          </div>
          {/* end::Col */}

          {/* begin::Col */}
          <div className="col-md-6 col-lg-6 col-xl-6 col-xxl-3 mb-md-5 mb-xl-10">
            {currentUser && (
              <CardsWidget17
                className="h-md-50 mb-5 mb-xl-10"
                description={`Total spent in ${months[new Date().getMonth()]}`}
                user={currentUser}
                items={items}
                one={getPercentage(
                  currentUser.openingBalance,
                  currentUser.unitBalance
                )}
                two={
                  getPercentage(
                    currentUser.openingBalance,
                    currentUser.openingBalance - currentUser.unitBalance
                  ) -
                  getPercentage(
                    currentUser.openingBalance,
                    currentUser.unitBalance
                  )
                }
                three={getPercentage(
                  currentUser.openingBalance,
                  currentUser.openingBalance - currentUser.unitBalance
                )}
              />
            )}
            <ListsWidget26 className="h-lg-50" />
          </div>
          {/* end::Col */}

          {/* begin::Col */}
          <div className="col-xxl-6">
            <EngageWidget10 className="h-md-100" />
          </div>
          {/* end::Col */}
        </div>
        {/* end::Row */}

        {/* begin::Row */}
        <div className="row gx-5 gx-xl-10">
          {/* begin::Col */}
          <div className="col-xxl-6 mb-5 mb-xl-10">
            {/* <app-new-charts-widget8 cssclassName="h-xl-100" chartHeight="275px" [chartHeightNumber]="275"></app-new-charts-widget8> */}
          </div>
          {/* end::Col */}

          {/* begin::Col */}
          <div className="col-xxl-6 mb-5 mb-xl-10">
            {/* <app-cards-widget18 cssclassName="h-xl-100" image="./assetsmedia/stock/600x600/img-65.jpg"></app-cards-widget18> */}
          </div>
          {/* end::Col */}
        </div>
        {/* end::Row */}

        {/* begin::Row */}
        <div className="row gy-5 gx-xl-8">
          <div className="col-xxl-4">
            <ListsWidget3 className="card-xxl-stretch mb-xl-3" />
          </div>
          <div className="col-xl-8">
            <TablesWidget10 className="card-xxl-stretch mb-5 mb-xl-8" />
          </div>
        </div>
        {/* end::Row */}

        {/* begin::Row */}
        <div className="row gy-5 g-xl-8">
          <div className="col-xl-4">
            <ListsWidget2 className="card-xl-stretch mb-xl-8" />
          </div>
          <div className="col-xl-4">
            <ListsWidget6 className="card-xl-stretch mb-xl-8" />
          </div>
          <div className="col-xl-4">
            <ListsWidget4 className="card-xl-stretch mb-5 mb-xl-8" items={5} />
            {/* partials/widgets/lists/_widget-4', 'class' => 'card-xl-stretch mb-5 mb-xl-8', 'items' => '5' */}
          </div>
        </div>
        {/* end::Row */}

        <div className="row g-5 gx-xxl-8">
          <div className="col-xxl-4">
            <MixedWidget8
              className="card-xxl-stretch mb-xl-3"
              chartColor="success"
              chartHeight="150px"
            />
          </div>
          <div className="col-xxl-8">
            <TablesWidget5 className="card-xxl-stretch mb-5 mb-xxl-8" />
          </div>
        </div>
      </Content>
    </>
  );
};

const DashboardWrapper: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.DASHBOARD" })}
      </PageTitle>
      <DashboardPage />
    </>
  );
};

export { DashboardWrapper };
