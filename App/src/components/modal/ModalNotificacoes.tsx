import React, { useCallback, useEffect } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Pressable,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useThemeColors } from "@/src/context/ThemeContext";
import type { AppNotification } from "@/src/hooks/useNotifications";

interface ModalNotificacoesProps {
  visible: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onClear?: () => void;
  onNotificationPress?: (notification: AppNotification) => void;
}

const CARD_BG = "#FFFFFF";
const CARD_TITLE_COLOR = "#000000";
const CARD_BODY_COLOR = "#374151";
const HANDLE_COLOR = "#6B7280";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SNAP_EXPANDED = SCREEN_HEIGHT * 0.92;
const SNAP_MIDDLE = SCREEN_HEIGHT * 0.55;
const SNAP_CLOSE_THRESHOLD = SCREEN_HEIGHT * 0.28;

const SPRING_CONFIG = { damping: 24, stiffness: 220, mass: 0.9 };

function clamp(value: number, min: number, max: number) {
  "worklet";
  return Math.min(Math.max(value, min), max);
}

const ModalNotificacoes = ({
  visible,
  onClose,
  notifications,
  onClear,
  onNotificationPress,
}: ModalNotificacoesProps) => {
  const colors = useThemeColors();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const sheetHeight = useSharedValue(0);
  const dragStartHeight = useSharedValue(SNAP_MIDDLE);

  const finishClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const animateClose = useCallback(() => {
    sheetHeight.value = withSpring(0, SPRING_CONFIG, (finished) => {
      if (finished) {
        runOnJS(finishClose)();
      }
    });
  }, [finishClose, sheetHeight]);

  useEffect(() => {
    if (visible) {
      sheetHeight.value = withSpring(SNAP_MIDDLE, SPRING_CONFIG);
    } else {
      sheetHeight.value = 0;
    }
  }, [visible, sheetHeight]);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      dragStartHeight.value = sheetHeight.value;
    })
    .onUpdate((event) => {
      sheetHeight.value = clamp(
        dragStartHeight.value - event.translationY,
        0,
        SNAP_EXPANDED,
      );
    })
    .onEnd((event) => {
      const currentHeight = sheetHeight.value;
      const draggedDown = event.translationY > 0;
      const fastDown = event.velocityY > 900;
      const fastUp = event.velocityY < -900;

      if (currentHeight < SNAP_CLOSE_THRESHOLD || (draggedDown && fastDown)) {
        sheetHeight.value = withSpring(0, SPRING_CONFIG, (finished) => {
          if (finished) {
            runOnJS(finishClose)();
          }
        });
        return;
      }

      if (fastUp || currentHeight > (SNAP_MIDDLE + SNAP_EXPANDED) / 2) {
        sheetHeight.value = withSpring(SNAP_EXPANDED, SPRING_CONFIG);
        return;
      }

      sheetHeight.value = withSpring(SNAP_MIDDLE, SPRING_CONFIG);
    });

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    height: sheetHeight.value,
  }));

  if (!visible) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={animateClose}>
      <GestureHandlerRootView style={styles.root}>
        <View style={styles.overlay}>
          <Pressable style={styles.backdrop} onPress={animateClose} accessibilityRole="button" />

          <Animated.View style={[styles.sheetWrapper, sheetAnimatedStyle]}>
            <View
              style={[
                styles.sheet,
                {
                  backgroundColor: colors.bg,
                  paddingBottom: Math.max(insets.bottom, 16),
                },
              ]}
            >
              <GestureDetector gesture={panGesture}>
                <Animated.View style={styles.dragArea}>
                  <View style={styles.handleContainer}>
                    <View style={styles.handle} />
                  </View>

                  <View style={styles.header}>
                    <Text className="font-semibold text-lg" style={{ color: colors.text }}>
                      {t("MODALNOTIFICACOES.TITLE")}
                    </Text>
                    {onClear ? (
                      <TouchableOpacity onPress={onClear} hitSlop={8}>
                        <Text className="font-medium text-base" style={{ color: "#EF4444" }}>
                          {t("MODALNOTIFICACOES.CLEAR")}
                        </Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                </Animated.View>
              </GestureDetector>

              <FlatList
                data={notifications}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => onNotificationPress?.(item)}
                    className="mb-3 rounded-2xl px-4 py-3"
                    style={{ backgroundColor: CARD_BG }}
                  >
                    <Text className="font-semibold text-base" style={{ color: CARD_TITLE_COLOR }}>
                      {item.title}
                    </Text>
                    <Text className="text-sm mt-1.5 leading-5" style={{ color: CARD_BODY_COLOR }}>
                      {item.message}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <Text className="text-center mt-4" style={{ color: colors.textSecondary }}>
                    {t("MODALNOTIFICACOES.EMPTY")}
                  </Text>
                }
              />
            </View>
          </Animated.View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetWrapper: {
    width: "100%",
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 4,
  },
  dragArea: {
    paddingBottom: 4,
  },
  handle: {
    width: 48,
    height: 5,
    borderRadius: 999,
    backgroundColor: HANDLE_COLOR,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    flexGrow: 1,
  },
});

export default ModalNotificacoes;
