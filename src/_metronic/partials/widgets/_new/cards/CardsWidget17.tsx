/* eslint-disable @typescript-eslint/ban-ts-comment */
import { FC, useEffect, useRef } from "react";
import { KTIcon } from "../../../../helpers";
import { getCSSVariableValue } from "../../../../assets/ts/_utils";
import { useThemeMode } from "../../../layout/theme-mode/ThemeModeProvider";
import { UserModel } from "../../../../../app/modules/auth";

type Props = {
  className: string;
  description: string;
  user: UserModel;
  chartSize?: number;
  chartLine?: number;
  chartRotate?: number;
  one?: number;
  two?: number;
  three?: number;
  items?: any[];
};

const CardsWidget17: FC<Props> = ({
  className,
  description,
  user,
  chartSize = 70,
  chartLine = 11,
  chartRotate = 145,
  one = 20,
  two = 30,
  three = 50,
  items,
}) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { mode } = useThemeMode();
  useEffect(() => {
    refreshChart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const refreshChart = () => {
    if (!chartRef.current) {
      return;
    }
    console.log("ONE => ", one);
    console.log("TWO => ", two);
    console.log("THREE => ", three);
    setTimeout(() => {
      initChart(chartSize, chartLine, chartRotate, one, two, three);
    }, 10);
  };

  return (
    <div className={`card card-flush ${className}`}>
      <div className="card-header pt-5">
        <div className="card-title d-flex flex-column">
          <div className="d-flex align-items-center">
            <span className="fs-4 fw-semibold text-gray-500 me-1 align-self-start">
              $
            </span>

            <span className="fs-2hx fw-bold text-gray-900 me-2 lh-1 ls-n2">
              {user?.totalSpent || 0}
            </span>

            <span className="badge badge-light-success fs-base">
              <KTIcon iconName="arrow-up" className="fs-5 text-success ms-n1" />{" "}
              {user?.percentageDifference || 0}%
            </span>
          </div>
          <span className="text-gray-500 pt-1 fw-semibold fs-6">
            {description}
          </span>
        </div>
      </div>

      <div className="card-body pt-2 pb-4 d-flex flex-wrap align-items-center">
        <div className="d-flex flex-center me-5 pt-2">
          <div
            id="kt_card_widget_17_chart"
            ref={chartRef}
            style={{ minWidth: chartSize + "px", minHeight: chartSize + "px" }}
            data-kt-size={chartSize}
            data-kt-line={chartLine}
          ></div>
        </div>
        <div className="d-flex flex-column content-justify-center flex-row-fluid">
          {items?.length &&
            items.map((item, i) => {
              return (
                <div key={i} className="d-flex fw-semibold align-items-center">
                  <div className="bullet w-8px h-3px rounded-2 bg-success me-3"></div>
                  <div className="text-gray-500 flex-grow-1 me-4">
                    {item.title}
                  </div>
                  <div className="fw-bolder text-gray-700 text-xxl-end">
                    ${item.value}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

const initChart = function (
  chartSize: number = 70,
  chartLine: number = 11,
  chartRotate: number = 145,
  one: number,
  two: number,
  three: number
) {
  const el = document.getElementById("kt_card_widget_17_chart");
  if (!el) {
    return;
  }
  el.innerHTML = "";

  const options = {
    size: chartSize,
    lineWidth: chartLine,
    rotate: chartRotate,
    //percent:  el.getAttribute('data-kt-percent') ,
  };

  const canvas = document.createElement("canvas");
  const span = document.createElement("span");

  //@ts-ignore
  if (typeof G_vmlCanvasManager !== "undefined") {
    //@ts-ignore
    G_vmlCanvasManager.initElement(canvas);
  }

  const ctx = canvas.getContext("2d");
  canvas.width = canvas.height = options.size;

  el.appendChild(span);
  el.appendChild(canvas);

  ctx?.translate(options.size / 2, options.size / 2); // change center
  ctx?.rotate((-1 / 2 + options.rotate / 180) * Math.PI); // rotate -90 deg

  //imd = ctx.getImageData(0, 0, 240, 240);
  const radius = (options.size - options.lineWidth) / 2;

  const drawCircle = function (
    color: string,
    lineWidth: number,
    percent: number
  ) {
    percent = Math.min(Math.max(0, percent || 1), 1);
    if (!ctx) {
      return;
    }

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2 * percent, false);
    ctx.strokeStyle = color;
    ctx.lineCap = "round"; // butt, round or square
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  };

  // Init 2
  drawCircle("#E4E6EF", options.lineWidth, 100 / (one * 5));
  drawCircle(
    getCSSVariableValue("--bs-primary"),
    options.lineWidth,
    100 / (two * 5)
  );
  drawCircle(
    getCSSVariableValue("--bs-success"),
    options.lineWidth,
    100 / (three * 5)
  );
};

export { CardsWidget17 };
