import { useLayout } from "../layout/core";
import { ThemeModeComponent } from "../assets/ts/layout";
import { UserModel } from "../../app/modules/auth";
import _ from "lodash";
const API_URL = import.meta.env.VITE_APP_API_URL;

export const toAbsoluteUrl = (pathname: string) =>
  import.meta.env.BASE_URL + pathname;

export const useIllustrationsPath = (illustrationName: string): string => {
  const { config } = useLayout();

  const extension = illustrationName.substring(
    illustrationName.lastIndexOf("."),
    illustrationName.length
  );
  const illustration =
    ThemeModeComponent.getMode() === "dark"
      ? `${illustrationName.substring(
          0,
          illustrationName.lastIndexOf(".")
        )}-dark`
      : illustrationName.substring(0, illustrationName.lastIndexOf("."));
  return toAbsoluteUrl(
    `media/illustrations/${config.illustrations?.set}/${illustration}${extension}`
  );
};

export const getAvatar = (user: UserModel | undefined) => {
  return `${API_URL}/${user?.image || "avatar.png"}`;
};

export const formatCurrency = (number: number, currency: string = "USD") => {
  const formattedNumber = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(number);
  return _.replace(formattedNumber, /^(\D+)/, "");
};
