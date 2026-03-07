import { Text, View, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { OtpInput } from "@/src/components/form";
import { ButtonDefault } from "@/src/components/form";
import { usePasswordValidate } from "@/src/hooks/auth/usePasswordValidate";
import React, { useState, useEffect } from "react";
import { useResendCode } from "@/src/hooks/auth/useResendCode";

const VerificationCode = () => {
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();
	const { control, handleSubmit, rules, handleValidateCode, email } = usePasswordValidate();

	
	const [timer, setTimer] = useState(60);
	const [canResend, setCanResend] = useState(false);
	const { handleResendCode } = useResendCode(email);

	useEffect(() => {
		if (timer > 0) {
			const interval = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);
			return () => clearInterval(interval);
		} else {
			setCanResend(true);
		}
	}, [timer]);

	const onResendCode = () => {
		if (canResend) {
			handleResendCode && handleResendCode();
			setTimer(60);
			setCanResend(false);
		}
	};

	return (
		<KeyboardAwareScrollView
			className="flex-1"
			contentContainerStyle={{
				flexGrow: 1,
				paddingHorizontal: 12,
				paddingBottom: insets.bottom + 20,
			}}
			keyboardShouldPersistTaps="handled"
		>
			<Text className="text-lightText dark:text-darkText text-base">
				{t("FORGOTPASSWORD.DESCRIPTION")} Informe o código para: {email || "—"}
			</Text>

			<View className="flex-1 pt-8">
				<Text className="text-lightText dark:text-darkText text-3xl font-semibold text-center pb-5">
					{t("FORGOTPASSWORDCODE.TITLE")}
				</Text>

				<OtpInput
					control={control}
					name="code"
					length={6}
					rules={rules.code}
				/>

				<View style={{ alignItems: "center", marginTop: 20 }}>
					{canResend ? (
						<TouchableOpacity onPress={onResendCode}>
							<Text style={{ color: "white" }}>
								{t("FORGOTPASSWORDCODE.RESENDCODE")}
							</Text>
						</TouchableOpacity>
					) : (
						<Text style={{ color: "gray" }}>
							{t("FORGOTPASSWORDCODE.RESENDIN", { seconds: timer })}
						</Text>
					)}
				</View>
			</View>

			<View className="flex-1 justify-end pt-4">
				<ButtonDefault
					title={t("FORGOTPASSWORD.SUBMIT")}
					onPress={handleSubmit(handleValidateCode)}
				/>
			</View>
		</KeyboardAwareScrollView>
	);
};

export default VerificationCode;
