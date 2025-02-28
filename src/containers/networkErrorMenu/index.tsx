import React from 'react';
import {Trans, useTranslation} from 'react-i18next';
import styled from 'styled-components';
import {Icon, IconType} from '@aragon/ods';
import {Avatar, ButtonIcon, ButtonText} from '@aragon/ods-old';

import ModalBottomSheetSwitcher from 'components/modalBottomSheetSwitcher';
import {useAlertContext} from 'context/alert';
import {useGlobalModalContext} from 'context/globalModals';
import {useNetwork} from 'context/network';
import useScreen from 'hooks/useScreen';
import {useSwitchNetwork} from 'hooks/useSwitchNetwork';
import {useWallet} from 'hooks/useWallet';
import WalletIcon from 'public/wallet.svg';
import {CHAIN_METADATA} from 'utils/constants';
import {handleClipboardActions, shortenAddress} from 'utils/library';

interface INetworkErrorMenuState {
  onClose?: () => void;
  onSuccess?: () => void;
}

export const NetworkErrorMenu = () => {
  const {isOpen, close, modalState} =
    useGlobalModalContext<INetworkErrorMenuState>('network');
  const {onClose, onSuccess} = modalState ?? {};

  const {network} = useNetwork();
  const {switchWalletNetwork} = useSwitchNetwork();
  const {address, ensName, ensAvatarUrl, connectorName} = useWallet();
  const {isDesktop} = useScreen();
  const {t} = useTranslation();
  const {alert} = useAlertContext();

  const handleCloseMenu = () => {
    onClose?.();
    close();
  };

  const handleSwitchNetwork = () => {
    switchWalletNetwork();
    close();
    onSuccess?.();
  };

  return (
    <ModalBottomSheetSwitcher onClose={handleCloseMenu} isOpen={isOpen}>
      <ModalHeader>
        <AvatarAddressContainer>
          <Avatar src={ensAvatarUrl || address || ''} size="small" />
          <AddressContainer>
            <Title>{ensName ? ensName : shortenAddress(address)}</Title>
            {ensName && <SubTitle>{shortenAddress(address)}</SubTitle>}
          </AddressContainer>
        </AvatarAddressContainer>
        <ButtonIcon
          mode="secondary"
          icon={<Icon icon={IconType.COPY} />}
          size="small"
          onClick={() =>
            address ? handleClipboardActions(address, () => null, alert) : null
          }
        />
        {isDesktop && (
          <ButtonIcon
            mode="ghost"
            icon={<Icon icon={IconType.CLOSE} />}
            size="small"
            onClick={handleCloseMenu}
          />
        )}
      </ModalHeader>
      <ModalBody>
        <StyledImage src={WalletIcon} />
        <WarningContainer>
          <WarningTitle>{t('alert.wrongNetwork.title')}</WarningTitle>
          <WarningDescription>
            {/** The text inside the <Trans> component is only used as a fallback if no translation is found, but the <strong> tag will replace the <1> placeholder. */}
            <Trans
              i18nKey={'alert.wrongNetwork.description'}
              values={{network: CHAIN_METADATA[network].name}}
            >
              The action can’t be executed because you are in the wrong network.
              Change to the <strong>{network}</strong> on your wallet and try
              again.
            </Trans>
          </WarningDescription>
        </WarningContainer>
        {connectorName === 'MetaMask' && (
          <ButtonText
            label={t('alert.wrongNetwork.buttonLabel', {
              network: CHAIN_METADATA[network].name,
            })}
            onClick={handleSwitchNetwork}
            size="large"
          />
        )}
      </ModalBody>
    </ModalBottomSheetSwitcher>
  );
};

const ModalHeader = styled.div.attrs({
  className: 'flex p-6 bg-neutral-0 rounded-xl gap-4 sticky top-0',
})`
  box-shadow:
    0px 4px 8px rgba(31, 41, 51, 0.04),
    0px 0px 2px rgba(31, 41, 51, 0.06),
    0px 0px 1px rgba(31, 41, 51, 0.04);
`;

export const Title = styled.div.attrs({
  className: 'flex-1 font-semibold text-neutral-800',
})``;

const SubTitle = styled.div.attrs({
  className: 'flex-1 font-medium text-neutral-500 text-sm leading-normal ',
})``;

const AvatarAddressContainer = styled.div.attrs({
  className: 'flex flex-1 gap-3 items-center',
})``;

const AddressContainer = styled.div.attrs({
  className: 'flex flex-col',
})``;

export const ModalBody = styled.div.attrs({
  className: 'flex flex-col px-6 pb-6',
})``;

export const StyledImage = styled.img.attrs({
  className: 'h-40',
})``;

export const WarningContainer = styled.div.attrs({
  className: 'flex flex-col justify-center items-center space-y-3 mb-6',
})``;

export const WarningTitle = styled.h2.attrs({
  className: 'text-2xl leading-tight font-semibold text-neutral-800',
})``;

const WarningDescription = styled.p.attrs({
  className: 'text-sm leading-normal text-neutral-500 text-center',
})``;
