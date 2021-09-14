import React, { useEffect, useRef } from "react";
import { loadModules } from "esri-loader";

const Map = () => {
  const MapEl = useRef(null);

  useEffect(() => {
    loadModules([
      "esri/WebMap",
      "esri/views/MapView",
      "esri/widgets/Legend",
      "esri/widgets/Expand",
    ]).then(([WebMap, MapView, Legend, Expand]) => {
      var webmap = new WebMap({
        portalItem: {
          id: "52333f74c9d9465c88f2ed7336e1e627",
        },
      });

      webmap.when(function (map) {
        document.getElementById("title").innerHTML =
          map.portalItem.title + " - Expand Widget";
      });

      var view = new MapView({
        container: "viewDiv",
        map: webmap,
        padding: {
          top: 55,
        },
      });

      // Desktop

      var legend = new Legend({
        view: view,
        container: document.createElement("div"),
      });

      // Mobile

      var expandLegend = new Expand({
        view: view,
        content: new Legend({
          view: view,
          container: document.createElement("div"),
        }),
      });

      // Load

      const isResponsiveSize = view.widthBreakpoint === "xsmall";
      updateView(isResponsiveSize);

      // Breakpoints

      view.watch("widthBreakpoint", function (breakpoint) {
        switch (breakpoint) {
          case "xsmall":
            updateView(true);
            break;
          case "small":
          case "medium":
          case "large":
          case "xlarge":
            updateView(false);
            break;
          default:
        }
      });

      function updateView(isMobile) {
        setTitleMobile(isMobile);
        setLegendMobile(isMobile);
      }

      function setTitleMobile(isMobile) {
        if (isMobile) {
          document.querySelector("#titleDiv").classList.add("invisible");
          view.padding = {
            top: 0,
          };
        } else {
          document.querySelector("#titleDiv").classList.remove("invisible");
          view.padding = {
            top: 55,
          };
        }
      }

      function setLegendMobile(isMobile) {
        var toAdd = isMobile ? expandLegend : legend;
        var toRemove = isMobile ? legend : expandLegend;

        view.ui.remove(toRemove);
        view.ui.add(toAdd, "top-right");
      }
    });
  }, []);

  return (
    <>
      <div id="titleDiv" class="esri-widget">
        <div id="title"></div>
      </div>
      <div
        id="viewDiv"
        style={{ height: "100vh", width: "100vw" }}
        ref={MapEl}
      ></div>
    </>
  );
};

export default Map;
