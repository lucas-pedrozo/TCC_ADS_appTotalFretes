import React, { memo } from "react";
import { NavigationArrowIcon } from "@/src/components/mapbox/NavigationArrowIcon";

type NavigationDriverMarkerProps = {
	bearing: number;
};

export const NavigationDriverMarker = memo(function NavigationDriverMarker({
	bearing,
}: NavigationDriverMarkerProps) {
	return <NavigationArrowIcon bearing={bearing} size={26} />;
});
