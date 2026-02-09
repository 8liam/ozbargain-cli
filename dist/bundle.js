#!/usr/bin/env node

// index.js
import React, { useState, useEffect } from "react";
import { render, Box, Text, useInput, useApp } from "ink";
import Parser from "rss-parser";
import { exec } from "child_process";
import Gradient from "ink-gradient";
import Spinner from "ink-spinner";
import { jsx, jsxs } from "react/jsx-runtime";
var parser = new Parser();
var RSS_URL = "https://www.ozbargain.com.au/deals/feed";
var SUNSET_COLORS = ["#ff9966", "#ff5e62", "#ffa34e"];
var isDiscrete = process.argv.includes("--discrete");
var LOGO_ART = [
  "  \u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2588\u2588\u2588\u2557   \u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2557 \u2588\u2588\u2588\u2557   \u2588\u2588\u2557",
  " \u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557 \u255A\u2550\u2550\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D  \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2551",
  " \u2588\u2588\u2551   \u2588\u2588\u2551   \u2588\u2588\u2588\u2554\u255D  \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551 \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2551  \u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551 \u2588\u2588\u2551 \u2588\u2588\u2554\u2588\u2588\u2557 \u2588\u2588\u2551",
  " \u2588\u2588\u2551   \u2588\u2588\u2551  \u2588\u2588\u2588\u2554\u255D   \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557 \u2588\u2588\u2551   \u2588\u2588\u2551 \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2551 \u2588\u2588\u2551 \u2588\u2588\u2551\u255A\u2588\u2588\u2557\u2588\u2588\u2551",
  " \u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2551  \u2588\u2588\u2551 \u2588\u2588\u2551  \u2588\u2588\u2551 \u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D \u2588\u2588\u2551  \u2588\u2588\u2551 \u2588\u2588\u2551 \u2588\u2588\u2551 \u255A\u2588\u2588\u2588\u2588\u2551",
  "  \u255A\u2550\u2550\u2550\u2550\u2550\u255D  \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u255D  \u255A\u2550\u255D  \u255A\u2550\u255D \u255A\u2550\u255D  \u255A\u2550\u255D  \u255A\u2550\u2550\u2550\u2550\u2550\u255D  \u255A\u2550\u255D  \u255A\u2550\u255D \u255A\u2550\u255D \u255A\u2550\u255D  \u255A\u2550\u2550\u2550\u255D"
];
function Logo() {
  return /* @__PURE__ */ jsx(Box, { flexDirection: "column", children: LOGO_ART.map((line, i) => /* @__PURE__ */ jsx(Gradient, { colors: SUNSET_COLORS, children: /* @__PURE__ */ jsx(Text, { bold: true, children: line }) }, i)) });
}
function LoadingScreen() {
  return /* @__PURE__ */ jsxs(Box, { flexDirection: "column", paddingX: 1, marginTop: 1, children: [
    !isDiscrete && /* @__PURE__ */ jsx(Logo, {}),
    /* @__PURE__ */ jsx(Box, { marginTop: 1, children: /* @__PURE__ */ jsxs(Text, { color: "#ff9966", children: [
      /* @__PURE__ */ jsx(Spinner, { type: "dots" }),
      " ",
      /* @__PURE__ */ jsx(Text, { dimColor: true, children: "Loading deals from Ozbargain..." })
    ] }) })
  ] });
}
function ErrorScreen({ error }) {
  return /* @__PURE__ */ jsxs(Box, { flexDirection: "column", paddingX: 1, marginTop: 1, children: [
    !isDiscrete && /* @__PURE__ */ jsx(Logo, {}),
    /* @__PURE__ */ jsx(Box, { marginTop: 1, children: /* @__PURE__ */ jsxs(Text, { color: "red", children: [
      "\u2717 ",
      error
    ] }) }),
    /* @__PURE__ */ jsx(Box, { marginTop: 1, children: /* @__PURE__ */ jsx(Text, { dimColor: true, children: "Press Ctrl+C to exit" }) })
  ] });
}
async function fetchDeals() {
  try {
    const feed = await parser.parseURL(RSS_URL);
    return { success: true, items: feed.items.map((item, index) => ({
      id: index,
      title: item.title,
      link: item.link
    })) };
  } catch (err) {
    return { success: false, error: err.message || "Unknown error" };
  }
}
function openBrowser(url) {
  const command = process.platform === "darwin" ? `open "${url}"` : process.platform === "win32" ? `start "${url}"` : `xdg-open "${url}"`;
  exec(command, (err) => {
    if (err)
      console.error("Failed to open browser:", err);
  });
}
function App() {
  const { exit } = useApp();
  const [deals, setDeals] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchDeals().then((result) => {
      setLoading(false);
      if (result.success) {
        setDeals(result.items);
      } else {
        setError(`Failed to load deals: ${result.error}`);
      }
    });
  }, []);
  useInput((input, key) => {
    if (key.ctrl && input === "c")
      exit();
    if (input === "q")
      exit();
    if (error && (input === "q" || key.ctrl && input === "c")) {
      exit();
      return;
    }
    if (loading || error || deals.length === 0)
      return;
    if (key.upArrow) {
      setSelectedIndex((i) => (i - 1 + deals.length) % deals.length);
    }
    if (key.downArrow) {
      setSelectedIndex((i) => (i + 1) % deals.length);
    }
    if (key.return) {
      openBrowser(deals[selectedIndex].link);
    }
  });
  if (loading) {
    return /* @__PURE__ */ jsx(LoadingScreen, {});
  }
  if (error) {
    return /* @__PURE__ */ jsx(ErrorScreen, { error });
  }
  const visibleCount = 5;
  let windowStart = selectedIndex - 2;
  if (windowStart < 0)
    windowStart = 0;
  if (windowStart + visibleCount > deals.length)
    windowStart = Math.max(0, deals.length - visibleCount);
  const visibleDeals = deals.slice(windowStart, windowStart + visibleCount);
  return /* @__PURE__ */ jsxs(Box, { flexDirection: "column", paddingX: 1, marginTop: 1, children: [
    !isDiscrete && /* @__PURE__ */ jsx(Box, { marginBottom: 1, children: /* @__PURE__ */ jsx(Logo, {}) }),
    /* @__PURE__ */ jsxs(Box, { marginBottom: 1, children: [
      isDiscrete && /* @__PURE__ */ jsx(Text, { bold: true, color: "#50FA7B", children: "\u25C8 OZBARGAIN" }),
      /* @__PURE__ */ jsxs(Text, { dimColor: true, children: [
        " \u2013 Latest Deals (",
        deals.length,
        ")"
      ] })
    ] }),
    /* @__PURE__ */ jsx(Box, { flexDirection: "column", children: visibleDeals.map((deal, index) => {
      const globalIndex = windowStart + index;
      const isSelected = globalIndex === selectedIndex;
      const indicator = isSelected ? "\u25BA" : " ";
      return /* @__PURE__ */ jsxs(Box, { children: [
        /* @__PURE__ */ jsx(Text, { color: isSelected ? "#FF79C6" : "#6272A4", width: 3, children: indicator }),
        /* @__PURE__ */ jsx(
          Text,
          {
            color: isSelected ? "#FFFFFF" : "#F8F8F2",
            bold: isSelected,
            children: deal.title.length > 80 ? deal.title.slice(0, 77) + "..." : deal.title
          }
        )
      ] }, deal.id);
    }) }),
    /* @__PURE__ */ jsx(Box, { marginTop: 1, children: /* @__PURE__ */ jsx(Text, { dimColor: true, children: "\u2191\u2193: navigate | Enter: open deal | q: quit" }) })
  ] });
}
console.clear();
render(/* @__PURE__ */ jsx(App, {}), { clearOnRuntimeError: false });
