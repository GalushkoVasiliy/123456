import React, {ReactNode, useState} from 'react';
import {
  ISuccessPaymentModal,
  SuccessPaymentModal,
} from './components/SuccessPaymentModal/SuccessPaymentModal';
import {
  ISuccessAddProductModal,
  SuccessAddProductModal,
} from './components/SuccessAddProductModal/SuccessAddProductModal';
import {
  INetworkErrorModal,
  NetworkErrorModal,
} from './components/NetworkErrorModal/NetworkErrorModal';
import {WalletModal} from './components/WalletModal/WalletModal';
import CardChallengeModal, {
  ICardChallengeModal,
} from './components/CardChallengeModal/CardChallengeModal';
import {CardChallengeErrorModal} from './components/CardChallengeErrorModal/CardChallengeErrorModal';
import GiftCarouselModal, {
  IGiftCarouselModal,
} from './components/GiftCarouselModal/GiftCarouselModal';

export enum MODAL_NAMES {
  success_checkout = 'success_checkout',
  success_add_product = 'success_add_product',
  wallet = 'wallet',
  network_error = 'network_error',
  challenge = 'challenge',
  challenge_error = 'challenge_error',
  gift_carousel = 'gift_carousel',
}

interface IModalArgs {
  [MODAL_NAMES.success_checkout]: ISuccessPaymentModal;
  [MODAL_NAMES.success_add_product]: ISuccessAddProductModal;
  [MODAL_NAMES.network_error]: INetworkErrorModal;
  [MODAL_NAMES.wallet]: void;
  [MODAL_NAMES.challenge]: ICardChallengeModal;
  [MODAL_NAMES.challenge_error]: void;
  [MODAL_NAMES.gift_carousel]: IGiftCarouselModal;
}

interface ModalValues {
  name: MODAL_NAMES;
  content?: any;
}

interface Props {
  onOpen: <T extends MODAL_NAMES, K extends IModalArgs[T]>(
    name: T,
    content: K,
  ) => void;
  onClose: () => void;
}

export const ModalContext = React.createContext<Props>({
  onOpen: () => {},
  onClose: () => {},
});

interface IModalProvider {
  children: ReactNode;
}

export const ModalProvider = ({children}: IModalProvider) => {
  const [modalState, setModalState] = useState<ModalValues | null>(null);

  function onOpen<T extends MODAL_NAMES, K extends IModalArgs[T]>(
    name: T,
    content: K,
  ) {
    setModalState({
      name,
      content,
    });
  }

  function onClose() {
    setModalState(null);
  }

  return (
    <ModalContext.Provider value={{onClose, onOpen}}>
      {children}
      {modalState?.name === MODAL_NAMES.success_checkout && (
        <SuccessPaymentModal
          isOpen
          onClose={onClose}
          {...modalState?.content}
        />
      )}

      {modalState?.name === MODAL_NAMES.success_add_product && (
        <SuccessAddProductModal
          isOpen
          onClose={onClose}
          {...modalState?.content}
        />
      )}

      {modalState?.name === MODAL_NAMES.gift_carousel && (
        <GiftCarouselModal isOpen onClose={onClose} {...modalState?.content} />
      )}

      {modalState?.name === MODAL_NAMES.wallet && (
        <WalletModal isOpen onClose={onClose} {...modalState?.content} />
      )}

      {modalState?.name === MODAL_NAMES.network_error && (
        <NetworkErrorModal isOpen onClose={onClose} {...modalState?.content} />
      )}

      {modalState?.name === MODAL_NAMES.challenge && (
        <CardChallengeModal isOpen onClose={onClose} {...modalState?.content} />
      )}

      {modalState?.name === MODAL_NAMES.challenge_error && (
        <CardChallengeErrorModal
          isOpen
          onClose={onClose}
          {...modalState?.content}
        />
      )}
    </ModalContext.Provider>
  );
};
