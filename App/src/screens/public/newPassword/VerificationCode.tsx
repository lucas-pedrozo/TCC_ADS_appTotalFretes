import { Text, View, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { OtpInput } from "@/src/components/otpInput/OtpInput";
import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";
import { useHookPasswordValidate } from "@/src/hooks/forgotPassword/hookPasswordValidate";
import React, { useState, useEffect } from "react";
import { useHookResendCode } from "@/src/hooks/forgotPassword/hookResindCode";

const VerificationCode = () => {
	const { t } = useTranslation();
	const insets = useSafeAreaInsets();
	const { control, handleSubmit, rules, handleValidateCode, email } = useHookPasswordValidate();

	
	const [timer, setTimer] = useState(60);
	const [canResend, setCanResend] = useState(false);
	const { handleResendCode } = useHookResendCode(email);

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
				paddingHorizontal: 20,
				paddingBottom: insets.bottom + 20,
			}}
			keyboardShouldPersistTaps="handled"
		>
			<Text className="text-lightText dark:text-darkText text-base">
				{t("forgotPassword.description")} Informe o código para: {email || "—"}
			</Text>

			<View className="flex-1 pt-8">
				<Text className="text-lightText dark:text-darkText text-3xl font-semibold text-center pb-5">
					Código de Redefinição
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
								Reenviar código
							</Text>
						</TouchableOpacity>
					) : (
						<Text style={{ color: "gray" }}>
							Reenviar em {timer}s
						</Text>
					)}
				</View>
			</View>

			<View className="flex-1 justify-end pt-4">
				<ButtonDefault
					title={t("forgotPassword.submit")}
					onPress={handleSubmit(handleValidateCode)}
				/>
			</View>
		</KeyboardAwareScrollView>
	);
};

export default VerificationCode;