import { useEffect } from "react";
import { Platform } from "react-native";
import CarProjection, { createPaneTemplate } from "react-native-car-projection";

import { useCarProjection } from "@/src/context/CarProjectionContext";
import { useGetFreightUser } from "@/src/hooks/freight/useGetFreightUser";

const CAR_SCREEN_NAME = "freight";

/**
 * Sincroniza freightUser (API) com o contexto de projeção e registra a tela
 * do carro (Android Auto) com template PaneTemplate (destino, valor, origem).
 * Só executa lógica de Car Projection no Android.
 */
export function CarProjectionWrapper({ children }: { children: React.ReactNode }) {
  const { freightForDisplay, setFreightForDisplay } = useCarProjection();
  const { freightUser } = useGetFreightUser();

  // Sincroniza frete em andamento (API) para o contexto; não sobrescreve se o usuário estiver em "frete de teste"
  useEffect(() => {
    if (freightUser != null) {
      setFreightForDisplay(freightUser);
    }
  }, [freightUser, setFreightForDisplay]);

  // Android: registra tela no carro e inicia sessão
  useEffect(() => {
    if (Platform.OS !== "android") return;

    const template = freightForDisplay
      ? createPaneTemplate({
          title: "Frete em andamento",
          rows: [
            {
              title: "Destino",
              texts: [freightForDisplay.destination_label || "—"],
            },
            {
              title: "Valor",
              texts: [`R$ ${freightForDisplay.final_value ?? "—"}`],
            },
            {
              title: "Origem",
              texts: [freightForDisplay.origin_label || "—"],
            },
          ],
        })
      : createPaneTemplate({
          title: "Total Fretes",
          rows: [{ title: "Status", texts: ["Nenhum frete ativo"] }],
        });

    CarProjection.registerScreen({
      name: CAR_SCREEN_NAME,
      template,
    }).catch((e) => {
      if (__DEV__) {
        console.warn("[CarProjection] registerScreen failed:", e);
      }
    });
  }, [freightForDisplay]);

  // Inicia sessão do Android Auto uma vez ao montar (apenas Android)
  useEffect(() => {
    if (Platform.OS !== "android") return;
    CarProjection.startSession().catch((e) => {
      if (__DEV__) {
        console.warn("[CarProjection] startSession failed:", e);
      }
    });
  }, []);

  return <>{children}</>;
}
