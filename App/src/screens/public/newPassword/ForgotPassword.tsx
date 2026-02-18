import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { InputDefault } from "@/src/components/fom/inputs/InputDefault";
import { ButtonDefault } from "@/src/components/fom/buttons/ButtonDefauilt";


const ForgotPassword = () => {
	const insets = useSafeAreaInsets();
	
	return (
		<KeyboardAwareScrollView
			className="flex-1"
			contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: insets.top }}
			keyboardShouldPersistTaps="handled"
		>

		</KeyboardAwareScrollView>
	)
} 

export default ForgotPassword;