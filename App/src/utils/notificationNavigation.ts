import type { AppNotification } from '@/src/hooks/useNotifications';
import type { HomeTabNavigationProp } from '@/src/routes/navigationTypes';

export function navigateFromNotification(
  notification: AppNotification,
  navigation: HomeTabNavigationProp,
) {
  switch (notification.type) {
    case 'FRETE_EM_TRANSITO':
    case 'FRETE_ENTREGUE':
      navigation.navigate('AndamentoTab');
      break;
    case 'PROPOSTA_AGUARDANDO_CONFIRMACAO':
    case 'PROPOSTA_NAO_SELECIONADA':
    case 'PROPOSTA_RECUSADA':
    case 'PROPOSTA_ACEITA':
    case 'FRETE_CANCELADO':
    default:
      navigation.navigate('PropostaTab');
      break;
  }
}
