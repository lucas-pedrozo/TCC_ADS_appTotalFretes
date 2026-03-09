import { ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeColors } from "@/src/context/ThemeContext";

const RULE_KEYS = [
  "TERM.RULE_1",
  "TERM.RULE_2",
  "TERM.RULE_3",
  "TERM.RULE_4",
  "TERM.RULE_5",
  "TERM.RULE_6",
  "TERM.RULE_7",
] as const;

function Term() {
  const { t } = useTranslation();
  const colors = useThemeColors();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.bg }}
      edges={["left", "right"]}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            color: colors.text,
            fontSize: 18,
            fontWeight: "700",
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          {t("TERM.TITLE")}
        </Text>

        <Text
          style={{
            color: colors.text,
            fontSize: 15,
            lineHeight: 22,
            marginBottom: 16,
          }}
        >
          {t("TERM.INTRO")}
        </Text>

        <Text
          style={{
            color: colors.text,
            fontSize: 16,
            fontWeight: "600",
            marginBottom: 12,
          }}
        >
          {t("TERM.RULES_TITLE")}
        </Text>

        <View style={{ marginBottom: 16 }}>
          {RULE_KEYS.map((key, index) => (
            <View
              key={key}
              style={{
                flexDirection: "row",
                marginBottom: 10,
                paddingLeft: 4,
              }}
            >
              <Text
                style={{
                  color: colors.text,
                  fontSize: 15,
                  lineHeight: 22,
                  minWidth: 24,
                }}
              >
                {index + 1}.{" "}
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontSize: 15,
                  lineHeight: 22,
                  flex: 1,
                }}
              >
                {t(key)}
              </Text>
            </View>
          ))}
        </View>

        <Text
          style={{
            color: colors.text,
            fontSize: 15,
            lineHeight: 22,
            fontStyle: "italic",
          }}
        >
          {t("TERM.DECLARATION")}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

export default Term;
