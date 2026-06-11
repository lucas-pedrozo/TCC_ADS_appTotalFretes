import { useEffect, useMemo, useState } from "react";
import { Image, type ImageStyle, type StyleProp } from "react-native";

import {
	fetchCargoImageUrl,
	getCargoImageUrl,
	type CargoTypeWithImage,
} from "@/src/services/cargoImageUrl";

const CARGO_IMAGE_FALLBACK = require("@/src/assets/carga.png");

type CargoTypeImageProps = {
	cargo?: CargoTypeWithImage | null;
	className?: string;
	style?: StyleProp<ImageStyle>;
	resizeMode?: "contain" | "cover" | "stretch" | "center";
};

export function CargoTypeImage({
	cargo,
	className,
	style,
	resizeMode = "contain",
}: CargoTypeImageProps) {
	const [fetchedUrl, setFetchedUrl] = useState<string | undefined>();

	const imageUrl = useMemo(() => getCargoImageUrl(cargo) ?? fetchedUrl, [cargo, fetchedUrl]);

	useEffect(() => {
		if (getCargoImageUrl(cargo)) {
			setFetchedUrl(undefined);
			return;
		}

		const imageId = cargo?.imageCargo_id;
		if (!imageId || imageId <= 0) {
			setFetchedUrl(undefined);
			return;
		}

		let cancelled = false;
		void fetchCargoImageUrl(imageId).then((url) => {
			if (!cancelled) setFetchedUrl(url);
		});

		return () => {
			cancelled = true;
		};
	}, [cargo?.CargoImage?.path, cargo?.imageCargo_id]);

	const resolvedClassName = className ?? "w-full h-24";

	if (imageUrl) {
		return (
			<Image
				source={{ uri: imageUrl }}
				className={resolvedClassName}
				style={style}
				resizeMode={resizeMode}
			/>
		);
	}

	return (
		<Image
			source={CARGO_IMAGE_FALLBACK}
			className={resolvedClassName}
			style={style}
			resizeMode={resizeMode}
		/>
	);
}
