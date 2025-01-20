import React from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { pageTitles } from "../constant/constatnt";

const DynamicTitle = () => {
  const location = useLocation();

  const normalizeRoute = (route) => route.replace(/:\w+\??/g, "");

  const normalizedPath = normalizeRoute(location.pathname);

  const matchingRoute = Object.keys(pageTitles)
    .sort((a, b) => b.length - a.length)
    .find((key) => normalizedPath.startsWith(normalizeRoute(key)));

  const title = pageTitles[matchingRoute] || "Sage Turtle";

  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  );
};

export default DynamicTitle;
